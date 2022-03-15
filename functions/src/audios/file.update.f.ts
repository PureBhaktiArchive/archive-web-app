/*!
 * sri sri guru gaurangau jayatah
 */

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { shallowlyEqual } from '../shallowly-equal';
import { StorageFileMetadata } from '../StorageFileMetadata';
import { AudiosEntry } from './AudiosEntry';
import { composeMediaMetadata, composeStorageMetadata } from './metadata';
import { convertToMp3, copyCodec, transcode } from './transcode';

if (!admin.apps.length) admin.initializeApp();

export default functions
  .runWith({ timeoutSeconds: 540, memory: '1GB' })
  .database.ref('/audio/entries/{id}')
  .onWrite(async (change, { params: { id } }) => {
    // Don't process deletions
    if (!change.after.exists()) return;

    const entryBefore = change.before.val() as AudiosEntry;
    const entry = change.after.val() as AudiosEntry;

    if (!entry.contentDetails || !entry.file) {
      functions.logger.debug('Entry', id, 'is not complete');
      return;
    }

    const sourceFile = admin
      .storage()
      .bucket(entry.file.bucket)
      .file(entry.file.name, { generation: entry.file.generation });

    const mp3File = admin
      .storage()
      .bucket(functions.config().storage?.bucket)
      .file(`${id}.mp3`);

    const durationRef = admin.database().ref('/audio/durations').child(id);

    // This will populate objects' `metadata` property.
    // For its structure, see https://googleapis.dev/nodejs/storage/latest/File.html#getMetadata-examples
    await Promise.all([sourceFile.getMetadata(), mp3File.getMetadata()]);

    const sourceFileMetadata = sourceFile.metadata as StorageFileMetadata;
    const mp3FileMetadata = mp3File.metadata as StorageFileMetadata;

    // This way we check for file existence to avoid second request with `exists()` method
    if (!sourceFileMetadata.name) {
      functions.logger.warn('Source file', entry.file, 'does not exist.');

      // Deleting mp3 file if it exists
      if (mp3FileMetadata.name) await mp3File.delete();

      // And removing duration
      durationRef.remove();
      return;
    }

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

    // Transcoding from source if MP3 does not exist or is not matching the source file
    if (
      !mp3FileMetadata.name ||
      mp3FileMetadata.size === 0 ||
      mp3FileMetadata.metadata?.sourceMd5Hash !== sourceFileMetadata.md5Hash
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

      if (Number.isFinite(duration)) await durationRef.set(duration);
      else {
        functions.logger.warn('Could not extract duration.');
        await durationRef.remove();
      }
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
