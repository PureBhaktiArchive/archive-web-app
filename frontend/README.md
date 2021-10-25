# Frontend

This sub-project contains the frontend part of the Archive.

## Technology stack

- [Parcel.js](https://parceljs.org/) v2 as a bundler
- [Tailwind CSS](https://tailwindcss.com/) as an utility-first CSS framework
- [Alpine JS](https://github.com/alpinejs/alpine) as a JS framework
- [Algolia InstantSearch.js](https://www.algolia.com/doc/guides/building-search-ui/getting-started/js/) for search UI

## Environment variables

Environment variables should be added to an `.env` file according to the [Parcel's documentation](https://parceljs.org/env.html). Use `.env.development.local` for local development.

| Variable                 | Description                                                             |
| ------------------------ | ----------------------------------------------------------------------- |
| `ALGOLIA_API_KEY`        | Algolia API key                                                         |
| `ALGOLIA_APPLICATION_ID` | Algolia application ID                                                  |
| `ALGOLIA_INDEX`          | Algolia index name                                                      |
| `STORAGE_BUCKET`         | The Google Cloud Storage bucket containing the transcoded mp3 files.    |
| `FEEDBACK_FORM`          | The base URL of the Feedback Form, file ID will be appended in the end. |
| `DONATION_URL`           | The link to the external donation page                                  |
| `CONTACT_URL`            | The link to the external contact form                                   |
| `SUBSCRIPTION_URL`       | The link to the external subscription form                              |
| `ANALYTICS_ID`           | Google Analytics Measurement ID                                         |

Note: To use environment variables in HTML they should be added to `posthtml.config.js` file first, because [Parcel does not replaces them in HTML](https://github.com/parcel-bundler/parcel/issues/1209#issuecomment-432424397).

## Running locally

- Open terminal in the `frontend` folder.
- Run `npm i` to install the dependencies.
- Create `.env.development.local` file in the `frontend` folder and enter variables according to [Environment variables](#environment-variables) section.
- Run `npm start` to start the Parcel development server, which will automatically rebuild the app as you change files and supports hot module replacement for fast development.
- Open the local website URL using the link shown by the previous command. Note that for pages other than `index.html` the extension has to be added manually, like this: http://localhost:3000/about.html.
