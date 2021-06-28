/*!
 * sri sri guru gaurangau jayatah
 */

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Entry } from './Entry';
import { composeMediaMetadata, composeStorageMetadata } from './metadata';
import { shallowlyEqual } from './shallowly-equal';
import { convertToMp3, copyCodec, transcode } from './transcode';

if (!admin.apps.length) admin.initializeApp();

export default functions
  .runWith({ timeoutSeconds: 540, memory: '1GB' })
  .database.ref('/audio/entries/{id}')
  .onWrite(async (change, { params: { id } }) => {
    // Don't process deletions
    if (!change.after.exists()) return;

    const entryBefore = change.before.val() as Entry;
    const entry = change.after.val() as Entry;

    if (!entry.contentDetails || !entry.file) {
      functions.logger.debug('Entry', id, 'is not complete');
      return;
    }

    const sourceFile = admin
      .storage()
      .bucket(entry.file.bucket)
      .file(entry.file.name, { generation: entry.file.generation });

    if (!(await sourceFile.exists()).shift()) {
      functions.logger.warn('Source file', entry.file, 'does not exist.');
      return;
    }

    const mp3File = admin
      .storage()
      .bucket(functions.config().storage?.bucket)
      .file(`${id}.mp3`);
    const mediaMetadata = composeMediaMetadata(id, entry.contentDetails);
    const storageMetadata = composeStorageMetadata(
      id,
      sourceFile,
      entry.contentDetails
    );

    /*
     * Performing least operation possible
     * depending on what was changed in the entry
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
        await admin.database().ref('/audio/durations').child(id).set(duration);
      else functions.logger.warn('Could not extract duration.');
    }

    // Updating media metadata if it changed
    else if (
      !change.before.exists() ||
      !shallowlyEqual(
        composeMediaMetadata(id, entryBefore.contentDetails),
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
        composeStorageMetadata(id, sourceFile, entryBefore.contentDetails),
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
