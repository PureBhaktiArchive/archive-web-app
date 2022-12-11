/*!
 * sri sri guru gaurangau jayatah
 */

import { default as importAudioEntries } from './audios/import.js';
import { default as publishAudioRecords } from './audios/publish.js';
import { default as updateFile } from './audios/update-file.js';
import { default as updateMemoriesIndex } from './memories/update-search-index.js';

export const audios = {
  import: importAudioEntries,
  publishRecords: publishAudioRecords,
  file: {
    update: updateFile,
  },
};

export const memories = {
  index: updateMemoriesIndex,
};
