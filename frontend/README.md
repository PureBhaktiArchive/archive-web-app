## NOTE on environment variables

- `ALGOLIA_API_KEY` - Algolia API key
- `ALGOLIA_APPLICATION_ID` - Algolia application ID
- `ALGOLIA_INDEX` - Algolia index name
- `STORAGE_BUCKET` - The Google Cloud Storage bucket containing the transcoded mp3 files.
- `FEEDBACK_FORM` - The base URL of the Feedback Form, file ID will be appended in the end.
- `DONATION_URL` - The link to the external donation page
- `CONTACT_URL` - The link to the external contact form

Note: To use environment variables in HTML they should be added to `posthtml.config.js` file first, because [Parcel does not replaces them in HTML](https://github.com/parcel-bundler/parcel/issues/1209#issuecomment-432424397).
