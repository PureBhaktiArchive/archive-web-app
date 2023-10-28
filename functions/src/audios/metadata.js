/*!
 * sri sri guru gaurangau jayatah
 */

import { abbreviateLanguages, parseLanguages } from '../languages.js';

/**
 * @typedef {import('./content-details.js').ContentDetails} ContentDetails
 *
 * @typedef {import('../storage-file-metadata.js').StorageFileMetadata} StorageFileMetadata
 *
 *
 * @typedef {import('@google-cloud/storage').File} File
 */

/**
 * @param {string} id
 * @param {ContentDetails} contentDetails
 * @returns {string}
 */
export function composeFileName(id, contentDetails) {
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

/**
 * @param {string} id
 * @param {ContentDetails} contentDetails
 * @returns {Record<string, string>}
 */
export function composeMediaMetadata(id, contentDetails) {
  return {
    'BVNM Archive ID': id,
    title: contentDetails.title,
    date: contentDetails.date?.substr(0, 4),
  };
}

/**
 * @param {string} id
 * @param {File} sourceFile
 * @param {ContentDetails} contentDetails
 * @returns {any}
 */
export function composeStorageMetadata(id, sourceFile, contentDetails) {
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
