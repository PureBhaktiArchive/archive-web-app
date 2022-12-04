/*!
 * sri sri guru gaurangau jayatah
 */

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { categorizeLanguages, parseLanguages } from '../languages';
import {
  formatReducedPrecisionDateForHumans,
  parseReducedPrecisionIsoDate,
} from '../reducedPrecisionDate';
import { AudiosAlgoliaRecord } from './AudiosAlgoliaRecord';
import { AudiosEntry } from './AudiosEntry';

if (!admin.apps.length) admin.initializeApp();

function getLanguageAttributes(
  input: string
): Pick<AudiosAlgoliaRecord, 'languageCategory' | 'languages'> {
  const languages = parseLanguages(input);
  return {
    languages,
    languageCategory: categorizeLanguages(languages) || undefined,
  };
}

function getDateAttributes(
  source: string
): Pick<AudiosAlgoliaRecord, 'dateForHumans' | 'dateISO' | 'year'> | null {
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
    const [entriesSnapshot, durationsSnapshot] = await Promise.all([
      admin.database().ref('/audio/entries').once('value'),
      admin.database().ref('/audio/durations').once('value'),
    ]);
    const durations = new Map(
      Object.entries(durationsSnapshot.val() as Record<string, number>)
    );
    /**
     * Since we are using integer keys, Firebase can return either array or map:
     * https://firebase.googleblog.com/2014/04/best-practices-arrays-in-firebase.html
     * For this reason we're using `Object.entries` which work identical for both data structures.
     */
    const records = Object.entries(
      entriesSnapshot.val() as Record<string, AudiosEntry>
    )
      // Skipping entries which are obsolete or has no valid duration
      .filter(
        ([id, entry]) =>
          !entry.obsolete &&
          (durations.get(id) || 0) > 0 &&
          entry.contentDetails.title
      )
      .map<AudiosAlgoliaRecord>(([id, entry]) => ({
        objectID: id,
        title: entry.contentDetails.title,
        topics: entry.contentDetails.topics,
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
        duration: durations.get(id) as number, // We filtered out undefined values above
      }));

    await admin.database().ref('/audio/records').set(records);
  });
