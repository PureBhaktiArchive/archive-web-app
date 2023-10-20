/*!
 * sri sri guru gaurangau jayatah
 */

/* eslint-disable import/no-unresolved -- due to https://github.com/import-js/eslint-plugin-import/issues/1810 */
import { getApps, initializeApp } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
/* eslint-enable import/no-unresolved */
import * as functions from 'firebase-functions';
import { categorizeLanguages, parseLanguages } from '../languages.js';
import {
  formatReducedPrecisionDateForHumans,
  parseReducedPrecisionIsoDate,
} from '../reduced-precision-date.js';

/**
 * @typedef {import('./algolia-record.js').AudiosAlgoliaRecord} AudiosAlgoliaRecord
 *
 *
 * @typedef {import('./entry.js').AudiosEntry} AudiosEntry
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
      .filter(
        ([id, entry]) =>
          Number.isFinite(id) &&
          !entry.obsolete &&
          (durations.get(id) || 0) > 0 &&
          entry.contentDetails.title
      )
      .map(
        /** @returns {AudiosAlgoliaRecord} */
        ([id, entry]) => ({
          objectID: id,
          archiveId: Number(id),
          title: entry.contentDetails.title,
          topics: sanitizeTopics(entry.contentDetails.topics),
          topicsReady: entry.contentDetails.topicsReady,
          ...getDateAttributes(entry.contentDetails.date),
          dateUncertain: entry.contentDetails.dateUncertain || null,
          timeOfDay: entry.contentDetails.timeOfDay || null,
          location: entry.contentDetails.location || null,
          locationUncertain: entry.contentDetails.locationUncertain || null,
          category: entry.contentDetails.category,
          ...getLanguageAttributes(entry.contentDetails.languages),
          percentage: entry.contentDetails.percentage,
          soundQualityRating: entry.contentDetails.soundQualityRating,
          duration:
            /** @type {number} We Filtered out undefined values above */
            (durations.get(id)),
        })
      );

    await getDatabase().ref('/audio/records').set(records);
  });
