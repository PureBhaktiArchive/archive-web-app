/*!
 * sri sri guru gaurangau jayatah
 */

import { File } from '@google-cloud/storage';
import { abbreviateLanguages, parseLanguages } from '../languages';
import { StorageFileMetadata } from '../StorageFileMetadata';
import { ContentDetails } from './ContentDetails';

export function composeFileName(
  id: string,
  contentDetails: ContentDetails
): string {
  return [
    contentDetails.date ?? 'UNDATED',
    contentDetails.timeOfDay?.toUpperCase(),
    abbreviateLanguages(parseLanguages(contentDetails.languages)),
    '—',
    [contentDetails.title, contentDetails.location]
      .filter(Boolean)
      .join(', ')
      .replace(/[\\/?*:|"<>]/, ''),
    `(#${String(id).padStart(4, '0')}).mp3`,
  ]
    .filter(Boolean) // removing empty/undefined components
    .join(' ');
}

export function composeMediaMetadata(
  id: string,
  contentDetails: ContentDetails
): Record<string, string> {
  return {
    'BVNM Archive ID': id,
    title: contentDetails.title,
    date: contentDetails.date?.substr(0, 4),
  };
}

export function composeStorageMetadata(
  id: string,
  sourceFile: File,
  contentDetails: ContentDetails
): Partial<StorageFileMetadata> {
  return {
    /*
     * File name may need encoding according to RFC 5987 as we have non-ASCII characters.
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#encoding_for_content-disposition_and_link_headers
     * https://stackoverflow.com/a/32782542/3082178
     */
    contentDisposition: `attachment; filename="${composeFileName(
      id,
      contentDetails
    )}"`,
    metadata: {
      source: `${sourceFile.bucket.name}/${sourceFile.name}#${sourceFile.generation}`,
      sourceMd5Hash: sourceFile.metadata.md5Hash,
    },
  };
}
