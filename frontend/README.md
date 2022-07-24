# Frontend

This sub-project contains the frontend part of the Archive.

## Technology stack

- [Parcel.js](https://parceljs.org/) v2 as a bundler
- [Tailwind CSS](https://tailwindcss.com/) as an utility-first CSS framework
- [Alpine JS](https://github.com/alpinejs/alpine) as a JS framework
- [Algolia InstantSearch.js](https://www.algolia.com/doc/guides/building-search-ui/getting-started/js/) for search UI

## Environment variables

Environment variables should be added to an `.env` file according to the [Parcel's documentation](https://parceljs.org/features/node-emulation/#.env-files). Use `.env.development.local` for local development.

| Variable                 | Description                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `ALGOLIA_API_KEY`        | Algolia API key                                                                    |
| `ALGOLIA_APPLICATION_ID` | Algolia application ID                                                             |
| `ALGOLIA_INDEX`          | Algolia index name                                                                 |
| `ALGOLIA_INDEX_MEMORIES` | Algolia memories index name                                                        |
| `STORAGE_BUCKET`         | The Google Cloud Storage bucket containing the transcoded mp3 files.               |
| `FEEDBACK_FORM`          | The base URL of the Audios Feedback Form, file ID will be appended in the end.     |
| `MEMORIES_FEEDBACK_FORM` | The base URL of the Memories Feedback Form, memory ID will be appended in the end. |

## Running locally

- Open terminal in the `frontend` folder.
- Run `npm i` to install the dependencies.
- Create `.env.development.local` file in the `frontend` folder and enter variables according to [Environment variables](#environment-variables) section.
- Run `npm start` to start the Parcel development server, which will automatically rebuild the app as you change files and supports hot module replacement for fast development.
- Open the local website URL using the link shown by the previous command. Note that for pages other than `index.html` the extension has to be added manually, like this: http://localhost:3000/about.html.

## Deployment in firebase previw channel and live deployment.

- Make sure firebase cli is installed, otherwise Run `npm install -g firebase-tools` to install firbase tools.
- After pull request is merged to main branch, check `.env.development.local` file and `.env.production.local` file in the `frontend` folder and enter variables according to [Environment variables](#environment-variables) section.
- Log into Firebase using your Google account by running the following command: `firebase login` and confirm authentication in firebase console.
- Run `firebase use --add` to select the active project alias, give an alias name.
- For preview channel deployment Run `firebase hosting:channel:deploy <channel-name>` ([channel-name e,g, Production]).
- After channel deployment reviewed and approved go for live deployment
- For Live deployment Run `firebase deploy --only hosting`.
- Congratulations.
