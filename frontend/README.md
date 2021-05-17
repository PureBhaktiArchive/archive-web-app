# Frontend

This sub-project contains the frontend part of the Archive. Mainly it is a single page application built with vanilla JS.

## Environment variables

Environment variables should be added to an `.env.local` file according to the [Parcel's documentation](https://parceljs.org/env.html).

| Variable                 | Description                                                             |
| ------------------------ | ----------------------------------------------------------------------- |
| `ALGOLIA_API_KEY`        | Algolia API key                                                         |
| `ALGOLIA_APPLICATION_ID` | Algolia application ID                                                  |
| `ALGOLIA_INDEX`          | Algolia index name                                                      |
| `STORAGE_BUCKET`         | The Google Cloud Storage bucket containing the transcoded mp3 files.    |
| `FEEDBACK_FORM`          | The base URL of the Feedback Form, file ID will be appended in the end. |
| `DONATION_URL`           | The link to the external donation page                                  |
| `CONTACT_URL`            | The link to the external contact form                                   |
| `ANALYTICS_ID`           | Google Analytics Measurement ID                                         |

Note: To use environment variables in HTML they should be added to `posthtml.config.js` file first, because [Parcel does not replaces them in HTML](https://github.com/parcel-bundler/parcel/issues/1209#issuecomment-432424397).
