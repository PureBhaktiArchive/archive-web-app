/*!
 * sri sri guru gaurangau jayatah
 */

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import ffmpeg from 'fluent-ffmpeg';
import { Duration } from 'luxon';
import { ContentDetails } from './ContentDetails';
import { StorageFileReference } from './StorageFileReference';

if (!admin.apps.length) admin.initializeApp();

export default functions
  .runWith({ timeoutSeconds: 540, memory: '1GB' })
  .database.ref('/audio/entries/{id}/file')
  .onWrite(async (change, { params: { id } }) => {
    // Don't process deletions
    if (!change.after.exists()) return;

    const sourceFileRef = change.after.val() as StorageFileReference;

    const sourceFile = admin
      .storage()
      .bucket(sourceFileRef.bucket)
      .file(sourceFileRef.name, { generation: sourceFileRef.generation });

    if (!(await sourceFile.exists()).shift()) {
      functions.logger.warn(
        'File',
        sourceFileRef.bucket,
        sourceFileRef.name,
        sourceFileRef.generation,
        'does not exist.'
      );
      return;
    }

    const mp3File = admin.storage().bucket().file(`${id}.mp3`);

    if (
      (await mp3File.exists()).shift() &&
      mp3File.metadata.metadata?.sourceMd5Hash === sourceFile.metadata.md5Hash
    ) {
      functions.logger.debug(
        'Hash of the source file is the same, skipping transcoding.'
      );
      return;
    }

    const uploadStream = mp3File.createWriteStream({
      resumable: false, // Turning off to avoid consuming memory for the local storage of the file
      metadata: {
        metadata: {
          source: `${sourceFileRef.bucket}/${sourceFileRef.name}#${sourceFileRef.generation}`,
          sourceMd5Hash: sourceFile.metadata.md5Hash,
        },
      },
    });

    functions.logger.debug(
      'Transcoding file',
      id,
      'from',
      sourceFileRef.bucket,
      sourceFileRef.name,
      sourceFileRef.generation,
      'to MP3'
    );

    const uploadTask = new Promise((resolve, reject) =>
      uploadStream.once('finish', resolve).once('error', reject)
    );

    const contentDetails = (
      await change.after.ref.parent?.child('contentDetails').once('value')
    )?.val() as ContentDetails;

    const duration = await new Promise<number>((resolve, reject) =>
      ffmpeg({ logger: functions.logger })
        .withOption('-hide_banner')
        .withOption('-nostats')
        .input(sourceFile.createReadStream())
        .output(uploadStream, { end: true })
        .withAudioCodec('libmp3lame')
        .withAudioBitrate(64)
        .withAudioFrequency(22050)
        .withOutputFormat('mp3')
        // Using the best reasonable quality https://github.com/gypified/libmp3lame/blob/f416c19b3140a8610507ebb60ac7cd06e94472b8/USAGE#L491
        .withOutputOption('-compression_level 2')
        // Clearing all existing metadata, see https://gist.github.com/eyecatchup/0757b3d8b989fe433979db2ea7d95a01#3-cleardelete-id3-metadata
        .withOutputOption('-map_metadata -1')
        .withOutputOption('-metadata', `BVNM Archive ID=${id}`)
        .withOutputOption('-metadata', `title=${contentDetails?.title || ''}`)
        .withOutputOption(
          '-metadata',
          `date=${contentDetails?.date?.substr(0, 4) || ''}`
        )
        .withOutputOptions([
          // Required because Windows only supports version 3 of ID3v2 tags
          '-id3v2_version 3',
          // the ID3v1 version to create legacy v1.1 tags
          '-write_id3v1 1',
        ])
        .on('start', (commandLine) =>
          functions.logger.debug('Spawned ffmpeg with command', commandLine)
        )
        .on('error', reject)
        .on('end', (stdout, stderr) => {
          functions.logger.debug(stderr);
          /**
           * Sometimes `ffprobe` cannot extract duration from a stream and returns N/A.
           * Therefore it is officially suggested to get real duration by decoding:
           * https://trac.ffmpeg.org/wiki/FFprobeTips#Getdurationbydecoding
           */
          const match = /time=(\d+):(\d\d):(\d\d)(.\d+)\b/.exec(stderr);
          resolve(
            match
              ? Duration.fromObject({
                  hours: Number(match[1]),
                  minutes: Number(match[2]),
                  seconds: Number(match[3]),
                  milliseconds: Number(match[4]) * 1000,
                }).as('seconds')
              : NaN
          );
        })
        .run()
    );

    if (Number.isFinite(duration))
      await admin.database().ref('/audio/durations').child(id).set(duration);
    else functions.logger.warn('Could not extract duration.');

    return uploadTask;
  });
