/*!
 * sri sri guru gaurangau jayatah
 */

export interface StorageFileMetadata {
  kind: string;
  id: string;
  selfLink: string;
  mediaLink: string;
  name: string;
  bucket: string;
  generation: string;
  metageneration: string;
  contentType: string;
  contentDisposition: string;
  storageClass: 'STANDARD' | 'NEARLINE' | 'COLDLINE';
  size: string; // This is how storage provides the size, as a string
  md5Hash: string;
  crc32c: string;
  etag: string;
  timeCreated: string;
  updated: string;
  timeStorageClassUpdated: string;
  metadata: Record<string, string> | undefined;
}
