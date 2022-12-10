/*!
 * sri sri guru gaurangau jayatah
 */

import { default as importAudioEntries } from './audios/import.js';
import { default as updateFile } from './audios/update-file.js';
import { default as updateAudiosIndex } from './audios/update-search-index.js';
import { default as updateMemoriesIndex } from './memories/update-search-index.js';

export const audios = {
  import: importAudioEntries,
  algolia: {
    reindex: updateAudiosIndex,
  },
  file: {
    update: updateFile,
  },
};

export const memories = {
  index: updateMemoriesIndex,
};
