/*!
 * sri sri guru gaurangau jayatah
 */

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import ffmpeg from 'fluent-ffmpeg';
import { ContentDetails } from './ContentDetails';
import './ffmpeg-async';
import { StorageFileReference } from './StorageFileReference';

if (!admin.apps.length) admin.initializeApp();

export default functions
  .runWith({ timeoutSeconds: 120 })
  .database.ref('/audio/entries/{id}/file')
  .onWrite(async (change, { params: { id } }) => {
    // Don't process deletions
    if (!change.after.exists()) return;

    const sourceFileRef = change.after.val() as StorageFileReference;

    const sourceFile = admin
      .storage()
      .bucket(sourceFileRef.bucket)
      .file(sourceFileRef.name, { generation: sourceFileRef.generation });

    const duration = (
      await ffmpeg().input(sourceFile.createReadStream()).ffprobeAsync()
    )?.format?.duration;

    const contentDetails = (
      await change.after.ref.parent?.child('contentDetails').once('value')
    )?.val() as ContentDetails;

    const mp3File = admin.storage().bucket().file(`${id}.mp3`);
    const uploadStream = mp3File.createWriteStream({
      resumable: false, // Turning off to avoid consuming memory for the local storage of the file
      metadata: {
        metadata: {
          duration,
          source: `${sourceFileRef.bucket}/${sourceFileRef.name}#${sourceFileRef.generation}`,
        },
      },
    });

    return Promise.all([
      // Converting the file
      ffmpeg()
        .input(sourceFile.createReadStream())
        .withAudioCodec('libmp3lame')
        .withAudioChannels(1)
        .withAudioBitrate(64)
        .withAudioFrequency(22050)
        .output(uploadStream, { end: true })
        .withOutputFormat('mp3')
        .withOutputOptions([
          // Clearing all existing metadata, see https://gist.github.com/eyecatchup/0757b3d8b989fe433979db2ea7d95a01#3-cleardelete-id3-metadata
          '-map_metadata -1',
          // To pass option parameter with spaces we need to add it separately, see https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/issues/311#issuecomment-54281059
          '-metadata',
          `title=${contentDetails?.title}`,
          `-metadata date=${contentDetails?.date?.substr(0, 4)}`,
          // Required because Windows only supports version 3 of ID3v2 tags
          '-id3v2_version 3',
          // the ID3v1 version to create legacy v1.1 tags
          '-write_id3v1 1',
        ])
        .runAsync(),
      // Waiting for the upload to finish
      new Promise((resolve, reject) => {
        uploadStream.once('finish', resolve).once('error', reject);
      }),
    ]);
  });
