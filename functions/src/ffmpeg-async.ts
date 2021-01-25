/*!
 * sri sri guru gaurangau jayatah
 */

import ffmpeg, { FfmpegCommand } from 'fluent-ffmpeg';

declare module 'fluent-ffmpeg' {
  interface FfmpegCommand {
    runAsync(): Promise<void>;
    ffprobeAsync(): Promise<FfprobeData>;
  }
}

/**
 * Inspired by https://github.com/firebase/functions-samples/pull/254#issuecomment-336503767
 */
ffmpeg.prototype.runAsync = function (this: FfmpegCommand) {
  return new Promise((resolve, reject) => {
    this.on('error', reject);
    this.on('end', resolve);
    this.run();
  });
};

ffmpeg.prototype.ffprobeAsync = function (this: FfmpegCommand) {
  return new Promise((resolve, reject) => {
    this.ffprobe((err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

export {};
