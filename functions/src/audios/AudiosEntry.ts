/*!
 * sri sri guru gaurangau jayatah
 */

import { StorageFileReference } from '../StorageFileReference';
import { ContentDetails } from './ContentDetails';

export interface AudiosEntry {
  contentDetails: ContentDetails;
  file: StorageFileReference;
  obsolete?: boolean;
}
