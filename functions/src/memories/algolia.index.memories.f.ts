/*!
 * sri sri guru gaurangau jayatah
 */

import algoliasearch from 'algoliasearch';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { MemoriesAlgoliaRecord } from './MemoriesAlgoliaRecord';
import { MemoriesEntry } from './MemoriesEntry';

if (!admin.apps.length) admin.initializeApp();

export default functions.pubsub
  .schedule('every monday 00:00')
  .timeZone('Asia/Calcutta')
  .onRun(async () => {
    const entriesSnapshot = await admin
      .database()
      .ref('/memories/entries')
      .once('value');

    /**
     * Since we are using integer keys, Firebase can return either array or map:
     * https://firebase.googleblog.com/2014/04/best-practices-arrays-in-firebase.html
     * For this reason we're using `Object.entries` which work identical for both data structures.
     */
    const records = Object.entries(
      entriesSnapshot.val() as Record<string, MemoriesEntry>
    ).map<MemoriesAlgoliaRecord>(([id, entry]) => ({
      objectID: id,
      programName: entry.programName,
      speakerName: entry.speakerName,
      speakerCountry: entry.speakerCountry,
      speakerIntro: entry.speakerIntro,
      hostName: entry.hostName,
      dateISO: entry.recordedDate,
      dateForHumans: entry.recordedDate,
      language: entry.language,
      url: entry.url,
      duration: entry.duration,
      topics: entry.topics,
    }));

    const client = algoliasearch(
      functions.config().algolia.appid,
      functions.config().algolia.apikey
    );
    const index = client.initIndex(functions.config().algolia.memories.index);

    if (records.length > 0) await index.replaceAllObjects(records);
    else await index.clearObjects();

    console.log('Indexing has been successfully queued.');
  });
