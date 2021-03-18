/*!
 * sri sri guru gaurangau jayatah
 */

import algoliasearch from 'algoliasearch';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { AlgoliaRecord } from './AlgoliaRecord';
import {
  formatReducedPrecisionDateForHumans,
  parseReducedPrecisionIsoDate,
} from './dates';
import { Entry } from './Entry';
import { categorizeLanguages, parseLanguages } from './languages';

if (!admin.apps.length) admin.initializeApp();

function getLanguageAttributes(
  input: string
): Pick<AlgoliaRecord, 'languageCategory' | 'languages'> {
  const languages = parseLanguages(input);
  return {
    languages,
    languageCategory: categorizeLanguages(languages) || undefined,
  };
}

function getDateAttributes(
  source: string
): Pick<AlgoliaRecord, 'dateForHumans' | 'dateISO' | 'year'> | null {
  if (!source) return null;

  const date = parseReducedPrecisionIsoDate(source);
  if (!date) return null;

  return {
    dateISO: source,
    /**
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
    const snapshot = await admin.database().ref('/audio/entries').once('value');

    /**
     * Since we are using integer keys, Firebase can return either array or map:
     * https://firebase.googleblog.com/2014/04/best-practices-arrays-in-firebase.html
     * For this reason we're using `Object.entries` which work identical for both data structures.
     */
    const records = Object.entries(snapshot.val() as Record<number, Entry>)
      .filter(([, entry]) => !entry.obsolete)
      .map<AlgoliaRecord>(([id, entry]) => ({
        objectID: id,
        title: entry.contentDetails.title,
        topics: entry.contentDetails.topics,
        ...getDateAttributes(entry.contentDetails.date),
        timeOfDay: entry.contentDetails.timeOfDay,
        location: entry.contentDetails.location,
        category: entry.contentDetails.category,
        ...getLanguageAttributes(entry.contentDetails.languages),
        percentage: entry.contentDetails.percentage,
        soundQualityRating: entry.contentDetails.soundQualityRating,
        duration: entry.duration || null,
      }));

    const client = algoliasearch(
      functions.config().algolia.appid,
      functions.config().algolia.apikey
    );
    const index = client.initIndex(functions.config().algolia.index);

    if (records.length > 0) await index.replaceAllObjects(records);
    else await index.clearObjects();

    console.log('Indexing has been successfully queued.');
  });
