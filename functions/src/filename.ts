/*!
 * sri sri guru gaurangau jayatah
 */

import { ContentDetails } from './ContentDetails';
import { abbreviateLanguages, parseLanguages } from './languages';

export function composeFileName(
  contentDetails: ContentDetails,
  id: string
): string | undefined {
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
