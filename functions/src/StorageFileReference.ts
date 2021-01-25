/*!
 * sri sri guru gaurangau jayatah
 */

export interface StorageFileReference {
  bucket: string;
  name: string;
  generation?: number; // Used to refer to the fixed version of the edited file in the cloud bucket
}
