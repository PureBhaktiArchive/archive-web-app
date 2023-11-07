/*!
 * sri sri guru gaurangau jayatah
 */

/* eslint-disable import/no-unresolved -- due to https://github.com/import-js/eslint-plugin-import/issues/1810 */
import { getApps, initializeApp } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import { getStorage } from 'firebase-admin/storage';
/* eslint-enable import/no-unresolved */
import * as functions from 'firebase-functions';
import { shallowlyEqual } from '../shallowly-equal.js';
import { composeMediaMetadata, composeStorageMetadata } from './metadata.js';
import { convertToMp3, copyCodec, transcode } from './transcode.js';

/** @typedef {import('./record.js').AudioRecord} AudioRecord */

if (!getApps().length) initializeApp();

export default functions
  .runWith({ timeoutSeconds: 540, memory: '1GB' })
  .database.ref('/audio/records/{id}')
  .onWrite(async (change, { params: { id } }) => {
    // Don't process deletions
    if (!change.after.exists()) return;
    /** @type {AudioRecord} */
    const recordBefore = change.before.val();
    /** @type {AudioRecord} */
    const record = change.after.val();

    if (!record.contentDetails || !record.file) {
      functions.logger.debug('Record', id, 'is not complete');
      return;
    }

    const sourceFile = getStorage()
      .bucket(record.file.bucket)
      .file(record.file.name, { generation: record.file.generation });

    if (!(await sourceFile.exists()).shift()) {
      functions.logger.warn('Source file', record.file, 'does not exist.');
      return;
    }

    const mp3File = getStorage()
      .bucket(functions.config().storage?.bucket)
      .file(`${id}.mp3`);
    const mediaMetadata = composeMediaMetadata(id, record.contentDetails);
    const storageMetadata = composeStorageMetadata(
      id,
      sourceFile,
      record.contentDetails
    );

    /*
     * Performing least operation possible
     * depending on what has changed in the record
     */

    // Transcoding from source if MP3 does not exist or the source file changed
    if (
      !(await mp3File.exists()).shift() ||
      mp3File.metadata.metadata?.sourceMd5Hash !== sourceFile.metadata.md5Hash
    ) {
      functions.logger.debug(
        'Transcoding file',
        sourceFile.id,
        'to',
        mp3File.id
      );

      const duration = await transcode(
        sourceFile,
        mp3File,
        convertToMp3,
        mediaMetadata,
        storageMetadata
      );

      if (Number.isFinite(duration))
        await getDatabase().ref('/audio/durations').child(id).set(duration);
      else functions.logger.warn('Could not extract duration.');
    }

    // Updating media metadata if it changed
    else if (
      !change.before.exists() ||
      !shallowlyEqual(
        composeMediaMetadata(id, recordBefore.contentDetails),
        mediaMetadata
      )
    ) {
      functions.logger.debug('Updating media metadata for file', id);
      await transcode(
        mp3File,
        mp3File,
        copyCodec,
        mediaMetadata,
        storageMetadata
      );
    }

    // Updating only storage metadata if it changed
    else if (
      !shallowlyEqual(
        composeStorageMetadata(id, sourceFile, recordBefore.contentDetails),
        storageMetadata
      )
    ) {
      functions.logger.debug('Updating storage metadata for file', id);
      await mp3File.setMetadata(storageMetadata);
    }

    // Otherwise doing nothing
    else
      functions.logger.debug(
        'Nothing essential changed in content details for file',
        id
      );
  });
