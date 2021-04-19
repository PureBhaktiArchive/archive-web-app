/*!
 * sri sri guru gaurangau jayatah
 */

import { ContentDetails } from './ContentDetails';
import { abbreviateLanguages, parseLanguages } from './languages';

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

export const getFfmpegMetadataOptions = (
  metadata: Record<string, string>
): string[] =>
  [
    // Required because Windows only supports version up to 3 of ID3v2 tags
    '-id3v2_version 3',
    // the ID3v1 version to create legacy v1.1 tags
    '-write_id3v1 1',
    // Clearing all existing metadata, see https://gist.github.com/eyecatchup/0757b3d8b989fe433979db2ea7d95a01#3-cleardelete-id3-metadata
    '-map_metadata -1',
  ].concat(
    Object.entries(metadata).flatMap(([name, value]) => [
      '-metadata',
      `${name}=${value || ''}`,
    ])
  );
