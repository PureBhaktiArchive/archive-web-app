/*!
 * sri sri guru gaurangau jayatah
 */

import express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DateTime } from 'luxon';
import { asyncHandler } from './async-handler';
import { Entry } from './Entry';
import { composeFileName } from './filename';

if (!admin.apps.length) admin.initializeApp();

export default functions.https.onRequest(
  express().get(
    '/download/:id(\\d+)',
    asyncHandler(async ({ params: { id } }, res) => {
      try {
        const file = admin.storage().bucket().file(`${id}.mp3`);
        const [[fileExists], entrySnapshot] = await Promise.all([
          file.exists(),
          admin.database().ref('/audio/entries').child(id).once('value'),
        ]);

        if (!fileExists || !entrySnapshot.exists())
          return res
            .status(404)
            .send(
              `File ${id} is not found. Please contact the Archive team at feedback@harikatha.com`
            )
            .end();

        const contentDetails = (entrySnapshot.val() as Entry).contentDetails;

        const [url] = await file.getSignedUrl({
          action: 'read',
          expires: DateTime.local().plus({ days: 3 }).toJSDate(),
          promptSaveAs: composeFileName(contentDetails, id),
        });

        res
          .set('Cache-Control', 'public, max-age=3600, s-maxage=86400')
          .redirect(303, url);
      } catch (error) {
        functions.logger.warn('Caught error:', error.message);
        res
          .status(500)
          .send(
            'Error getting the file. Please contact the Archive team at feedback@harikatha.com'
          );
      }
    })
  )
);
