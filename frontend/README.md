# Frontend

This sub-project contains the frontend part of the Archive.

## Technology stack

- [Eleventy](https://www.11ty.dev/) as a Static Site Generator
- [Parcel.js](https://parceljs.org/) v2 as a bundler
- [Tailwind CSS](https://tailwindcss.com/) as an utility-first CSS framework
- [Alpine JS](https://github.com/alpinejs/alpine) as a JS framework
- [Algolia InstantSearch.js](https://www.algolia.com/doc/guides/building-search-ui/getting-started/js/) for search UI

HTML files are processed by Eleventy first, then by Parcel.

### InstantSearch Templates

New function-based templates with an `html` function as tagged template. Large templates should be moved to a separate JS file. See `audio-item-template.js` as an example.

In order to get syntax highlighting and intellisense of HTML inside javascript template literals, the `tobermory.es6-string-html` VSCode extension is recommended in the workspace settings.

Prettier [supports](https://prettier.io/blog/2018/11/07/1.15.0.html#html-template-literal-in-javascript) `html` template tags out of the box.

### JavaScript Type Checking

VS Code has built-in [intellisense and type checking for JavaScript](https://code.visualstudio.com/docs/nodejs/working-with-javascript). In order to improve it, `tsconfig.json` is present in the project to enable JS checking across all the files. Type checking step is included in the CI workflow to prevent buggy code to be merged. `tsc` command-line TypeScript compiler does not work well with `jsconfig.json` ([issue 50862](https://github.com/microsoft/TypeScript/issues/50862), [issue 43043](https://github.com/microsoft/TypeScript/issues/43043), [issue 41350](https://github.com/microsoft/TypeScript/issues/41350), [issue 6671](https://github.com/microsoft/TypeScript/issues/6671)), that is why `tsconfig.json` is used.

## Environment variables

Environment variables should be added to an `.env` file according to the [Parcel's documentation](https://parceljs.org/features/node-emulation/#.env-files). Use `.env.development.local` for local development.

| Variable                 | Description                                                                                                                                                                      |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ALGOLIA_API_KEY`        | Algolia API key                                                                                                                                                                  |
| `ALGOLIA_APPLICATION_ID` | Algolia application ID                                                                                                                                                           |
| `ALGOLIA_INDEX_AUDIOS`   | Algolia index name                                                                                                                                                               |
| `ALGOLIA_INDEX_MEMORIES` | Algolia memories index name                                                                                                                                                      |
| `STORAGE_BUCKET`         | The Google Cloud Storage bucket containing the transcoded mp3 files.                                                                                                             |
| `FEEDBACK_FORM_AUDIOS`   | The base URL of the Audios Feedback Form, file ID will be appended in the end.                                                                                                   |
| `FEEDBACK_FORM_MEMORIES` | The base URL of the Memories Feedback Form, memory ID will be appended in the end.                                                                                               |
| `AUDIOS_DATA_PATH`       | Path to a file containing JSON data for audio pages generation. Should be absolute or relative to the `frontend` folder. This file can be downloaded from the Realtime Database. |

## Running locally

- Open terminal in the `frontend` folder.
- Run `npm i` to install the dependencies.
- Create `.env.development.local` file in the `frontend` folder and enter variables according to [Environment variables](#environment-variables) section.
- Run `npm start` to start the Parcel development server, which will automatically rebuild the app as you change files and supports hot module replacement for fast development.
- Open the local website URL using the link shown by the previous command. Note that for pages other than `index.html` the extension has to be added manually, like this: http://localhost:3000/about.html.

## Deployment

- Make sure Firebase CLI is installed, otherwise run `npm install -g firebase-tools`.
- Make sure `.env.production.local` file in the `frontend` folder contains variables according to [Environment variables](#environment-variables) section.
- Log into Firebase CLI using your Google account by running the `firebase login` command.
- Run `firebase use --add` to select the active project andprovide an alias for it.
- For preview channel deployment, run `firebase hosting:channel:deploy <channel-name>`.
- For live deployment, run `firebase deploy --only hosting`.
