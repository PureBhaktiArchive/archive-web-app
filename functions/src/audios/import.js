/*!
 * sri sri guru gaurangau jayatah
 */

/* eslint-disable import/no-unresolved -- due to https://github.com/import-js/eslint-plugin-import/issues/1810 */
import { getApps, initializeApp } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
/* eslint-enable import/no-unresolved */
import * as functions from 'firebase-functions';
import { splitToChunks } from '../split-chunks.js';

/** @typedef {import('./entry.js').AudiosEntry} AudiosEntry */

if (!getApps().length) initializeApp();

/**
 * This function imports entries from the `import` hive of the database into the working `entries` hive.
 * It does so in batches, so that number of Cloud Function invocations would not hit the limits.
 * Function is triggered by the adjacent database key.
 */
export default functions
  .runWith({ timeoutSeconds: 540 })
  .database.ref('/audio/import/trigger')
  .onWrite(async () => {
    /*
     * Since we are using integer keys, Firebase can return either array or map:
     * https://firebase.googleblog.com/2014/04/best-practices-arrays-in-firebase.html
     * For this reason we're using `Object.entries` which work identical for both data structures.
     */
    const imported = Object.entries(
      /** @type {Record<string, AudiosEntry>} */
      ((await getDatabase().ref('/audio/import/entries').once('value')).val())
    );

    const newIds = new Set(imported.map(([id]) => id));
    const oldIds = Object.entries(
      /** @type {Record<string, AudiosEntry>} */
      ((await getDatabase().ref('/audio/entries').once('value')).val())
    ).map(([id]) => id);

    const deletions = oldIds
      .filter((id) => !newIds.has(id))
      .map(
        /** @returns {[string, null]} */
        (id) => [id, null]
      );
    functions.logger.debug(imported.length, 'additions/updates');
    functions.logger.debug(deletions.length, 'deletions');

    await Promise.all(
      /*
       * Splitting the whole array into chunks of 500 to avoid
       * hitting limit of Cloud Functions triggered by a single write.
       * See https://firebase.google.com/docs/database/usage/limits
       */
      splitToChunks([...imported, ...deletions], 500).map((chunk) =>
        getDatabase().ref('/audio/entries').update(Object.fromEntries(chunk))
      )
    );
  });
