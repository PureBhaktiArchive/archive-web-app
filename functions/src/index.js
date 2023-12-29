/*!
 * sri sri guru gaurangau jayatah
 */

import { default as updateFile } from './audios/update-file.js';
import { default as updateMemoriesIndex } from './memories/update-search-index.js';

export const audios = {
  file: {
    update: updateFile,
  },
};

export const memories = {
  index: updateMemoriesIndex,
};
