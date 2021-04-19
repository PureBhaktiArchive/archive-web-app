/*!
 * sri sri guru gaurangau jayatah
 */

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import ffmpeg from 'fluent-ffmpeg';
import { ContentDetails } from './ContentDetails';
import {
  composeFileName,
  composeMediaMetadata,
  getFfmpegMetadataOptions,
} from './metadata';
import { StorageFileMetadata } from './StorageFileMetadata';

if (!admin.apps.length) admin.initializeApp();

const shallowlyEqual = (
  a: Record<string, unknown>,
  b: Record<string, unknown>
) =>
  Object.keys(a).length === Object.keys(b).length &&
  Object.keys(a).every(
    (key) => Object.prototype.hasOwnProperty.call(b, key) && a[key] === b[key]
  );

export default functions
  .runWith({ memory: '1GB' })
  .database.ref('/audio/entries/{id}/contentDetails')
  .onWrite(async (change, { params: { id } }) => {
    // Don't process deletions
    if (!change.after.exists()) return;

    const mp3File = admin.storage().bucket().file(`${id}.mp3`);

    // Querying for existence also fills `metadata` which can be used later
    if (!(await mp3File.exists()).shift()) {
      functions.logger.warn('File', id, 'does not exist.');
      return;
    }

    const contentDetailsBefore = change.before.val() as ContentDetails;
    const contentDetails = change.after.val() as ContentDetails;
    const mediaMetadata = composeMediaMetadata(id, contentDetails);
    const fileName = composeFileName(id, contentDetails);
    const objectMetadata: Partial<StorageFileMetadata> = {
      contentDisposition: `attachment; filename="${fileName}"`,
    };

    if (
      !change.before.exists() ||
      !shallowlyEqual(
        composeMediaMetadata(id, contentDetailsBefore),
        mediaMetadata
      )
    ) {
      functions.logger.debug(
        'Setting media metadata for file',
        id,
        'using ffmpeg'
      );
      // Encoding the file with new metadata
      const uploadStream = mp3File.createWriteStream({
        resumable: false, // Turning off to avoid consuming memory for the local storage of the file
        metadata: {
          ...objectMetadata,
          metadata: mp3File.metadata.metadata,
        },
      });

      const uploadTask = new Promise<void>((resolve, reject) =>
        uploadStream.once('finish', resolve).once('error', reject)
      );
      const transcodingTask = new Promise<void>((resolve, reject) =>
        ffmpeg({ logger: functions.logger })
          .withOption('-hide_banner')
          .withOption('-nostats')
          .input(mp3File.createReadStream())
          .output(uploadStream, { end: true })
          .withAudioCodec('copy')
          // When using pipes, you need to tell ffmpeg which format you are using: https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/issues/802#issuecomment-366469595
          .withOutputFormat('mp3')
          .withOutputOptions(getFfmpegMetadataOptions(mediaMetadata))
          .on('start', (commandLine) =>
            functions.logger.debug('Spawned ffmpeg with command', commandLine)
          )
          .on('error', reject)
          .on('end', resolve)
          .run()
      );

      await Promise.all([transcodingTask, uploadTask]);
      return;
    }

    // Otherwise just updating the Content-Disposition metadata
    if (composeFileName(id, contentDetailsBefore) !== fileName) {
      functions.logger.debug('Setting Content-Disposition for file', id);
      await mp3File.setMetadata(objectMetadata);
      return;
    }
    functions.logger.debug(
      'Nothing essential changed in content details for file',
      id
    );
  });
