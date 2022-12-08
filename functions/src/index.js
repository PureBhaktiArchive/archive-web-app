/*!
 * sri sri guru gaurangau jayatah
 */

import { default as audiosReindex } from './audios/algolia.reindex.f.js';
import { default as updateFile } from './audios/file.update.f.js';
import { default as audiosImport } from './audios/import.f.js';
import { default as memoriesIndex } from './memories/index.f.js';

export const audios = {
  import: audiosImport,
  algolia: {
    reindex: audiosReindex,
  },
  file: {
    update: updateFile,
  },
};

export const memories = {
  index: memoriesIndex,
};
