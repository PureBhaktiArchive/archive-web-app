/*!
 * sri sri guru gaurangau jayatah
 */

import algoliasearch from 'algoliasearch';
/* eslint-disable import/no-unresolved -- due to https://github.com/import-js/eslint-plugin-import/issues/1810 */
import { getApps, initializeApp } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
/* eslint-enable import/no-unresolved */
import * as functions from 'firebase-functions';
import { categorizeLanguages, parseLanguages } from '../languages.js';
import {
  formatReducedPrecisionDateForHumans,
  parseReducedPrecisionIsoDate,
} from '../reducedPrecisionDate.js';

/**
 * @typedef {import('./AudiosAlgoliaRecord.js').AudiosAlgoliaRecord} AudiosAlgoliaRecord
 * @typedef {import('./AudiosEntry.js').AudiosEntry} AudiosEntry
 */

if (!getApps().length) initializeApp();

/**
 * @param {string} input
 * @returns {Pick<AudiosAlgoliaRecord, 'languageCategory' | 'languages'>}
 */
function getLanguageAttributes(input) {
  const languages = parseLanguages(input);
  return {
    languages,
    languageCategory: categorizeLanguages(languages) || undefined,
  };
}

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

export default functions.pubsub
  .schedule('every monday 00:00')
  .timeZone('Asia/Calcutta')
  .onRun(async () => {
    const [entriesSnapshot, durationsSnapshot] = await Promise.all([
      getDatabase().ref('/audio/entries').once('value'),
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
      /** @type {Record<string, AudiosEntry>} */ (entriesSnapshot.val())
    )
      // Skipping entries which are obsolete or has no valid duration
      .filter(([id, entry]) => !entry.obsolete && (durations.get(id) || 0) > 0)
      .map(
        /** @returns {AudiosAlgoliaRecord} */
        ([id, entry]) => ({
          objectID: id,
          title: entry.contentDetails.title,
          topics: entry.contentDetails.topics,
          topicsReady: entry.contentDetails.topicsReady,
          ...getDateAttributes(entry.contentDetails.date),
          dateUncertain: entry.contentDetails.dateUncertain,
          timeOfDay: entry.contentDetails.timeOfDay,
          location: entry.contentDetails.location,
          locationUncertain: entry.contentDetails.locationUncertain,
          category: entry.contentDetails.category,
          ...getLanguageAttributes(entry.contentDetails.languages),
          percentage: entry.contentDetails.percentage,
          soundQualityRating: entry.contentDetails.soundQualityRating,
          duration: durations.get(id) || null,
        })
      );
    const client = algoliasearch(
      functions.config().algolia.appid,
      functions.config().algolia.apikey
    );
    const index = client.initIndex(functions.config().algolia.index.audios);

    if (records.length > 0) await index.replaceAllObjects(records);
    else await index.clearObjects();

    console.log('Indexing has been successfully queued.');
  });
