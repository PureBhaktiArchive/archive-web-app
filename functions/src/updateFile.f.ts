/*!
 * sri sri guru gaurangau jayatah
 */

import { File } from '@google-cloud/storage';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import ffmpeg, { FfmpegCommand } from 'fluent-ffmpeg';
import { Duration } from 'luxon';
import { Writable } from 'stream';
import { ContentDetails } from './ContentDetails';
import { Entry } from './Entry';
import { composeFileName, composeMediaMetadata } from './metadata';
import { StorageFileMetadata } from './StorageFileMetadata';

if (!admin.apps.length) admin.initializeApp();

export default functions
  .runWith({ timeoutSeconds: 540, memory: '1GB' })
  .database.ref('/audio/entries/{id}')
  .onWrite(async (change, { params: { id } }) => {
    // Don't process deletions
    if (!change.after.exists()) return;

    const entryBefore = change.before.val() as Entry;
    const entry = change.after.val() as Entry;

    if (!entry.contentDetails || !entry.file) {
      functions.logger.debug('Entry', id, 'is not complete');
      return;
    }

    const sourceFile = admin
      .storage()
      .bucket(entry.file.bucket)
      .file(entry.file.name, { generation: entry.file.generation });

    if (!(await sourceFile.exists()).shift()) {
      functions.logger.warn('Source file', entry.file, 'does not exist.');
      return;
    }

    const mp3File = admin.storage().bucket().file(`${id}.mp3`);
    const mediaMetadata = composeMediaMetadata(id, entry.contentDetails);
    const storageMetadata = composeStorageMetadata(
      id,
      sourceFile,
      entry.contentDetails
    );

    if (
      !(await mp3File.exists()).shift() ||
      mp3File.metadata.metadata?.sourceMd5Hash !== sourceFile.metadata.md5Hash
    ) {
      functions.logger.debug(
        'Transcoding file',
        sourceFile.id,
        'to',
        mp3File.id
      );

      const duration = await transcode(
        sourceFile,
        mp3File,
        convertToMp3,
        mediaMetadata,
        storageMetadata
      );

      if (Number.isFinite(duration))
        await admin.database().ref('/audio/durations').child(id).set(duration);
      else functions.logger.warn('Could not extract duration.');
    } else if (
      !change.before.exists() ||
      !shallowlyEqual(
        composeMediaMetadata(id, entryBefore.contentDetails),
        mediaMetadata
      )
    ) {
      functions.logger.debug('Updating media metadata for file', id);
      await transcode(
        mp3File,
        mp3File,
        copyCodec,
        mediaMetadata,
        storageMetadata
      );
    } else if (
      !shallowlyEqual(
        composeStorageMetadata(id, sourceFile, entryBefore.contentDetails),
        storageMetadata
      )
    ) {
      functions.logger.debug('Updating storage metadata for file', id);
      await mp3File.setMetadata(storageMetadata);
    } else
      functions.logger.debug(
        'Nothing essential changed in content details for file',
        id
      );
  });

const shallowlyEqual = (
  a: Record<string, unknown>,
  b: Record<string, unknown>
) =>
  Object.keys(a).length === Object.keys(b).length &&
  Object.keys(a).every(
    (key) => Object.prototype.hasOwnProperty.call(b, key) && a[key] === b[key]
  );

const convertToMp3 = (command: FfmpegCommand) =>
  command
    .withAudioCodec('libmp3lame')
    .withAudioBitrate(64)
    .withAudioFrequency(22050)
    // Using the best reasonable quality https://github.com/gypified/libmp3lame/blob/f416c19b3140a8610507ebb60ac7cd06e94472b8/USAGE#L491
    .withOutputOption('-compression_level 2');

const copyCodec = (command: FfmpegCommand) => command.withAudioCodec('copy');

const addMediaMetadata = (metadata: Record<string, string>) => (
  command: FfmpegCommand
) =>
  command
    .withOutputOptions([
      // Required because Windows only supports version up to 3 of ID3v2 tags
      '-id3v2_version 3',
      // the ID3v1 version to create legacy v1.1 tags
      '-write_id3v1 1',
      // Clearing all existing metadata, see https://gist.github.com/eyecatchup/0757b3d8b989fe433979db2ea7d95a01#3-cleardelete-id3-metadata
      '-map_metadata -1',
    ])
    .withOutputOptions(
      Object.entries(metadata).flatMap(([name, value]) => [
        '-metadata',
        `${name}=${value || ''}`,
      ])
    );

const runCommandAsync = (command: FfmpegCommand): Promise<number> =>
  new Promise<number>((resolve, reject) =>
    command
      .on('start', (commandLine) =>
        functions.logger.debug('Spawned ffmpeg with command', commandLine)
      )
      .on('error', reject)
      .on('end', (stdout, stderr) => {
        functions.logger.debug(stderr);
        /*
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

const promisifyStream = (stream: Writable): Promise<void> =>
  new Promise((resolve, reject) =>
    stream.once('finish', resolve).once('error', reject)
  );

const composeStorageMetadata = (
  id: string,
  sourceFile: File,
  contentDetails: ContentDetails
): Partial<StorageFileMetadata> => ({
  /*
   * File name may need encoding according to RFC 5987 as we have non-ASCII characters.
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#encoding_for_content-disposition_and_link_headers
   * https://stackoverflow.com/a/32782542/3082178
   */
  contentDisposition: `attachment; filename="${composeFileName(
    id,
    contentDetails
  )}"`,
  metadata: {
    source: `${sourceFile.bucket.name}/${sourceFile.name}#${sourceFile.generation}`,
    sourceMd5Hash: sourceFile.metadata.md5Hash,
  },
});

const transcode = async (
  sourceFile: File,
  destinationFile: File,
  converstionPreset: (command: FfmpegCommand) => void,
  mediaMetadata: Record<string, string>,
  storageMetadata: Partial<StorageFileMetadata>
) => {
  const uploadStream = destinationFile.createWriteStream({
    resumable: false, // Turning off to avoid consuming memory for the local storage of the file
    metadata: storageMetadata,
  });

  const uploadTask = promisifyStream(uploadStream);

  const command = ffmpeg({ logger: functions.logger })
    .withOption('-hide_banner')
    .withOption('-nostats')
    .input(sourceFile.createReadStream())
    .output(uploadStream, { end: true })
    .withOutputFormat('mp3')
    // @ts-expect-error: There is an error in typing. See https://github.com/DefinitelyTyped/DefinitelyTyped/issues/52550
    .usingPreset(converstionPreset)
    // @ts-expect-error: There is an error in typing. See https://github.com/DefinitelyTyped/DefinitelyTyped/issues/52550
    .usingPreset(addMediaMetadata(mediaMetadata));

  const [duration] = await Promise.all([runCommandAsync(command), uploadTask]);
  return duration;
};
