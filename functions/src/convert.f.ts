/*!
 * sri sri guru gaurangau jayatah
 */

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import ffmpeg from 'fluent-ffmpeg';
import { ContentDetails } from './ContentDetails';
import './ffmpeg-async';
import { StorageFileReference } from './StorageFileReference';

if (!admin.apps.length) admin.initializeApp();

export default functions
  .runWith({ timeoutSeconds: 540, memory: '4GB' })
  .database.ref('/audio/entries/{id}/file')
  .onWrite(async (change, { params: { id } }) => {
    // Don't process deletions
    if (!change.after.exists()) return;

    const sourceFileRef = change.after.val() as StorageFileReference;

    functions.logger.debug(
      'Converting file for',
      id,
      'from',
      sourceFileRef.bucket,
      sourceFileRef.name,
      sourceFileRef.generation
    );

    const sourceFile = admin
      .storage()
      .bucket(sourceFileRef.bucket)
      .file(sourceFileRef.name, { generation: sourceFileRef.generation });

    const duration = (
      await ffmpeg().input(sourceFile.createReadStream()).ffprobeAsync()
    ).format.duration;

    if (!duration) {
      functions.logger.error('Cannot extract duration for', id);
      return;
    }

    await change.after.ref.parent?.child('duration').set(duration);

    const contentDetails = (
      await change.after.ref.parent?.child('contentDetails').once('value')
    )?.val() as ContentDetails;

    const uploadStream = admin
      .storage()
      .bucket()
      .file(`${id}.mp3`)
      .createWriteStream({
        resumable: false, // Turning off to avoid consuming memory for the local storage of the file
        metadata: {
          metadata: {
            duration,
            source: `${sourceFileRef.bucket}/${sourceFileRef.name}#${sourceFileRef.generation}`,
          },
        },
      });

    return Promise.all([
      // Converting the file
      ffmpeg({ logger: functions.logger })
        .withOption('-hide_banner')
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
        .on('error', functions.logger.error)
        .on('end', (stdout, stderr) =>
          functions.logger.debug('Transcoding succeeded.', stderr)
        )
        .runAsync(),
      // Waiting for the upload to finish
      new Promise((resolve, reject) => {
        uploadStream.once('finish', resolve).once('error', reject);
      }),
    ]);
  });
