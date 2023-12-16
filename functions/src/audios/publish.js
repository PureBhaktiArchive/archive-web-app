/*!
 * sri sri guru gaurangau jayatah
 */

/* eslint-disable import/no-unresolved -- due to https://github.com/import-js/eslint-plugin-import/issues/1810 */
import { getApps, initializeApp } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
/* eslint-enable import/no-unresolved */
import * as functions from 'firebase-functions';
import { categorizeLanguages } from '../languages.js';
import {
  formatReducedPrecisionDateForHumans,
  parseReducedPrecisionIsoDate,
} from '../reduced-precision-date.js';

/**
 * @typedef {import('./algolia-record.js').AudiosAlgoliaRecord} AudiosAlgoliaRecord
 *
 *
 * @typedef {import('./record.js').AudioRecord} AudioRecord
 */

if (!getApps().length) initializeApp();

/**
 * @param {string} source
 * @returns {Pick<
 *   AudiosAlgoliaRecord,
 *   'dateForHumans' | 'dateISO' | 'year'
 * > | null}
 */
function getDateAttributes(source) {
  if (!source) return null;

  const date = parseReducedPrecisionIsoDate(source);
  if (!date) return null;

  return {
    dateISO: source,
    /*
     * Formatting date for free-text search according to precision.
     * - Full date: April 22, 1996
     * - Month: April 1996
     * - Year: 1996
     */
    dateForHumans: formatReducedPrecisionDateForHumans(date),
    year: date.date.year,
  };
}

/**
 * Fixes common human mistakes in topics formatting so that it renders correctly
 * as Markdown
 *
 * @param {string} topics
 * @returns {string}
 */
function sanitizeTopics(topics) {
  return (
    topics
      .replaceAll('\r\n', '\n')
      // Remove spaces in the beginning of the line
      .replaceAll(/^ -/gm, '-')
      // Add space after hyphen in the beginning of the line
      .replaceAll(/^-(?!\s)/gm, '- ')
      // Remove original text kept in the end of the cell
      .replace(/\n*\s*ORIGINAL.*$/s, '')
  );
}

export default functions.database
  .ref('/audio/published/trigger')
  .onWrite(async () => {
    const [recordsSnapshot, durationsSnapshot] = await Promise.all([
      getDatabase().ref('/audio/records').once('value'),
      getDatabase().ref('/audio/durations').once('value'),
    ]);
    const durations = new Map(
      Object.entries(
        /** @type {Record<string, number>} */ (durationsSnapshot.val())
      )
    );
    /*
     * Since we are using integer keys, Firebase can return either array or map:
     * https://firebase.googleblog.com/2014/04/best-practices-arrays-in-firebase.html
     * For this reason we're using `Object.entries` which work identical for both data structures.
     */
    const records = Object.entries(
      /** @type {Record<string, AudioRecord>} */ (recordsSnapshot.val())
    ).flatMap(
      /** @returns {AudiosAlgoliaRecord | []} */
      ([id, record]) =>
        // Only positive integers are allowed as ID
        /^\d+$/.test(id) &&
        // Only full records
        record.contentDetails &&
        // Only records with a duration
        (durations.get(id) || 0) > 0
          ? {
              objectID: id,
              fileId: +id,
              title: record.contentDetails.title,
              topics: sanitizeTopics(record.contentDetails.topics),
              ...getDateAttributes(record.contentDetails.date),
              dateUncertain: record.contentDetails.dateUncertain || null,
              timeOfDay: record.contentDetails.timeOfDay || null,
              location: record.contentDetails.location || null,
              locationUncertain:
                record.contentDetails.locationUncertain || null,
              category: record.contentDetails.category,
              languages: record.contentDetails.languages,
              languageCategory:
                categorizeLanguages(record.contentDetails.languages) ||
                undefined,
              percentage: record.contentDetails.percentage,
              otherSpeakers: record.contentDetails.otherSpeakers,
              soundQualityRating: record.contentDetails.soundQualityRating,
              duration:
                // We have filtered out `undefined` values above
                durations.get(id) || 0,
            }
          : []
    );

    await getDatabase().ref('/audio/published/records').set(records);
  });
