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
