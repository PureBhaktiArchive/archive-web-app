/*!
 * sri sri guru gaurangau jayatah
 */

import algoliasearch from 'algoliasearch';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DateTime } from 'luxon';
import { fromSerialDate } from '../date-conversion';
import { Spreadsheet } from '../Spreadsheet';
import { MemoriesAlgoliaRecord } from './MemoriesAlgoliaRecord';
import { MemoriesRow } from './MemoriesRow';

if (!admin.apps.length) admin.initializeApp();

function getDateAttributes(
  source: number
): Pick<MemoriesAlgoliaRecord, 'dateForHumans' | 'date'> {
  const date = fromSerialDate(source, 'utc');

  return {
    date: date.valueOf(),
    dateForHumans: date.setLocale('en-gb').toLocaleString(DateTime.DATE_FULL),
  };
}

export default functions.pubsub
  .schedule('every monday 00:00')
  .timeZone('Asia/Calcutta')
  .onRun(async () => {
    const sheet = await Spreadsheet.open<MemoriesRow>(
      functions.config().memories.spreadsheet.id,
      'Master'
    );

    const rows = await sheet.getRows();

    const records = rows
      // Only ready for launch are considered
      .filter((row) => row['Ready for Launch'])
      // Validation
      .filter((row) => {
        if (!fromSerialDate(row['Date of memory (yyyy/mm/dd)']).isValid) {
          console.error(row['Sr No'], 'incorrect date');
          return false;
        }

        if (!Number.isFinite(row['Duration (of the final edited video)'])) {
          console.error(row['Sr No'], 'incorrect duration');
          return false;
        }

        return true;
      })
      .map<MemoriesAlgoliaRecord>((row) => ({
        objectID: row['Sr No'].toString(),
        programName: row['Program name'],
        speakerName: row["Speaker's name"],
        speakerCountry: row["Speaker's country"],
        speakerIntro: row["Speaker's Intro"],
        hostName: row.Host,
        ...getDateAttributes(row['Date of memory (yyyy/mm/dd)']),
        language: row.Language,
        url: row['YouTube link'],
        // Converting duration from spreadsheet-based to seconds
        duration: Math.ceil(
          row['Duration (of the final edited video)'] * 24 * 3600
        ),
        topics: row.Topics,
      }));

    const client = algoliasearch(
      functions.config().algolia.appid,
      functions.config().algolia.apikey
    );
    const index = client.initIndex(functions.config().algolia.index.memories);

    if (records.length > 0) await index.replaceAllObjects(records);
    else await index.clearObjects();

    console.log('Indexing has been successfully queued.');
  });
