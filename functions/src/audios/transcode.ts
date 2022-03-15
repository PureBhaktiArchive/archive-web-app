/*!
 * sri sri guru gaurangau jayatah
 */

import { File } from '@google-cloud/storage';
import * as functions from 'firebase-functions';
import ffmpeg, { FfmpegCommand } from 'fluent-ffmpeg';
import { Duration } from 'luxon';
import { Writable } from 'stream';
import { StorageFileMetadata } from '../StorageFileMetadata';

export const convertToMp3 = (command: FfmpegCommand): unknown =>
  command
    .withAudioCodec('libmp3lame')
    .withAudioBitrate(64)
    .withAudioFrequency(22050)
    // Using the best reasonable quality https://github.com/gypified/libmp3lame/blob/f416c19b3140a8610507ebb60ac7cd06e94472b8/USAGE#L491
    .withOutputOption('-compression_level 2');

export const copyCodec = (command: FfmpegCommand): unknown =>
  command.withAudioCodec('copy');

const addMediaMetadata =
  (metadata: Record<string, string>) => (command: FfmpegCommand) =>
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

export async function transcode(
  sourceFile: File,
  destinationFile: File,
  converstionPreset: (command: FfmpegCommand) => void,
  mediaMetadata: Record<string, string>,
  storageMetadata: Partial<StorageFileMetadata>
): Promise<number> {
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
