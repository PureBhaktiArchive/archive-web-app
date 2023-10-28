/*!
 * sri sri guru gaurangau jayatah
 */

import * as functions from 'firebase-functions';
import ffmpeg from 'fluent-ffmpeg';
import { Duration } from 'luxon';

/**
 * @typedef {import('fluent-ffmpeg').PresetFunction} PresetFunction
 *
 * @typedef {import('fluent-ffmpeg').FfmpegCommand} FfmpegCommand
 *
 * @typedef {import('@google-cloud/storage').File} File
 *
 * @typedef {import('../storage-file-metadata.js').StorageFileMetadata} StorageFileMetadata
 */

/** @type {PresetFunction} */
export const convertToMp3 = (command) => {
  command
    .withAudioCodec('libmp3lame')
    .withAudioBitrate(64)
    .withAudioFrequency(22050)
    // Using the best reasonable quality https://github.com/gypified/libmp3lame/blob/f416c19b3140a8610507ebb60ac7cd06e94472b8/USAGE#L491
    .withOutputOption('-compression_level 2');
};

/** @type {PresetFunction} */
export const copyCodec = (command) => {
  command.withAudioCodec('copy');
};

/**
 * @param {Record<string, string>} metadata
 * @returns {PresetFunction}
 */
const addMediaMetadata = (metadata) => (command) =>
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

/**
 * @param {FfmpegCommand} command
 * @returns {Promise<number>}
 */
const runCommandAsync = (command) =>
  new Promise((resolve, reject) =>
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

/** @param {import('node:stream').Writable} stream */
const promisifyStream = (stream) =>
  new Promise((resolve, reject) =>
    stream.once('finish', resolve).once('error', reject)
  );

/**
 * @param {File} sourceFile
 * @param {File} destinationFile
 * @param {PresetFunction} converstionPreset
 * @param {Record<string, string>} mediaMetadata
 * @param {Partial<StorageFileMetadata>} storageMetadata
 * @returns {Promise<number>}
 */
export async function transcode(
  sourceFile,
  destinationFile,
  converstionPreset,
  mediaMetadata,
  storageMetadata
) {
  const uploadStream = destinationFile.createWriteStream({
    resumable: false,
    metadata: storageMetadata,
  });

  const uploadTask = promisifyStream(uploadStream);

  const command = ffmpeg({ logger: functions.logger })
    .withOption('-hide_banner')
    .withOption('-nostats')
    .input(sourceFile.createReadStream())
    .output(uploadStream, { end: true })
    .withOutputFormat('mp3')
    .usingPreset(converstionPreset)
    .usingPreset(addMediaMetadata(mediaMetadata));

  const [duration] = await Promise.all([runCommandAsync(command), uploadTask]);
  return duration;
}
