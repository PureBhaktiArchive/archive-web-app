/*!
 * sri sri guru gaurangau jayatah
 */

import algoliasearch from 'algoliasearch';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DateTime } from 'luxon';
import { fromSerialDate } from '../date-conversion';
import { Spreadsheet } from '../Spreadsheet';
import { GuruRow } from './GuruRow';
import { MemoriesAlgoliaRecord } from './MemoriesAlgoliaRecord';
import { MemoriesRow } from './MemoriesRow';

if (!admin.apps.length) admin.initializeApp();

const YouTubeIdRegex =
  /(?:https?:\/\/)?(?:(?:www\.)?(?:youtube(?:-nocookie)?|youtube.googleapis)\.com.*(?:v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i;

const getGurusMap = async () => {
  const sheet = await Spreadsheet.open<GuruRow>(
    functions.config().memories.spreadsheet.id,
    'Gurus'
  );
  const rows = await sheet.getRows();
  return new Map(rows.map((i) => [i.Abbreviation, i['Full Name']]));
};

export default functions.pubsub
  .schedule('every monday 00:00')
  .timeZone('Asia/Calcutta')
  .onRun(async () => {
    const gurus = await getGurusMap();

    const sheet = await Spreadsheet.open<MemoriesRow>(
      functions.config().memories.spreadsheet.id,
      'Master'
    );

    const rows = await sheet.getRows();

    const records = rows
      // Using flatMap to filter and map array in one function
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap#for_adding_and_removing_items_during_a_map
      .flatMap(
        (row): MemoriesAlgoliaRecord | readonly MemoriesAlgoliaRecord[] => {
          // Only ready for launch are considered
          if (!row['Ready for Launch']) return [];

          // Validation
          const date = fromSerialDate(
            row['Date of memory (yyyy/mm/dd)'],
            'utc'
          );

          if (!date.isValid) {
            console.error(row['Sr No'], 'incorrect date');
            return [];
          }

          if (!Number.isFinite(row['Duration (of the final edited video)'])) {
            console.error(row['Sr No'], 'incorrect duration');
            return [];
          }

          const videoId = row['YouTube link'].match(YouTubeIdRegex)?.[1];
          if (!videoId) {
            console.error(row['Sr No'], 'cannot extract YouTube ID');
            return [];
          }

          return {
            objectID: row['Sr No'].toString(),
            programName: row['Program name'],
            seniority: row.Seniority,
            speakerName: row["Speaker's name"],
            speakerCountry: row["Speaker's country"],
            speakerIntro: row["Speaker's Intro"],
            hostName: row.Host,
            date: date.valueOf(),
            dateForHumans: date
              .setLocale('en-gb')
              .toLocaleString(DateTime.DATE_FULL),
            language: row.Language,
            videoId,
            // Converting duration from spreadsheet-based to seconds
            duration: Math.ceil(
              row['Duration (of the final edited video)'] * 24 * 3600
            ),
            topics: row.Topics,
            gurus: row['Guru Initials'].split(',').map((i) => ({
              abbreviation: i.trim(),
              fullName: gurus.get(i.trim()) ?? null,
            })),
          };
        }
      );

    const client = algoliasearch(
      functions.config().algolia.appid,
      functions.config().algolia.apikey
    );
    const index = client.initIndex(functions.config().algolia.index.memories);

    if (records.length > 0) await index.replaceAllObjects(records);
    else await index.clearObjects();

    console.log('Indexing has been successfully queued.');
  });
