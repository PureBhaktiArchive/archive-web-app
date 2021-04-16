/*!
 * sri sri guru gaurangau jayatah
 */

import { ContentDetails } from './ContentDetails';
import { StorageFileReference } from './StorageFileReference';

export interface Entry {
  contentDetails: ContentDetails;
  file: StorageFileReference;
  obsolete?: boolean;
}
