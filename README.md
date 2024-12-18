<p style="text-align: center">
  <i>sri sri guru gaurangau jayatah</i>
</p>

# Architecture

The Archive website consists of the following components.

- [Frontend](frontend) hosted at Firebase Hosting.
- [Directus](https://directus.io/) as a headless CMS.
- [Algolia](https://www.algolia.com/doc/) as an external search provider.

The frontend part of the Archive is built as a statically generated website and hosted on Firebase Hosting.

![](./docs/Architecture.svg)

# Frontend

- [Eleventy](https://www.11ty.dev/) as a Static Site Generator
- [Vite](https://vitejs.dev/) as a bundler via [Vite plugin for Eleventy](https://www.11ty.dev/docs/server-vite/)
- [Tailwind CSS](https://tailwindcss.com/) as an utility-first CSS framework
- [Alpine JS](https://github.com/alpinejs/alpine) as a JS framework
- [Algolia InstantSearch.js](https://www.algolia.com/doc/guides/building-search-ui/getting-started/js/) for search UI
- [Directus SDK](https://docs.directus.io/reference/sdk.html) for pulling data from the headless CMS

## InstantSearch Templates

New function-based templates with an `html` function as tagged template. Large templates should be moved to a separate JS file. See `audio-item-template.js` as an example.

In order to get syntax highlighting and intellisense of HTML inside javascript template literals, the `tobermory.es6-string-html` VSCode extension is recommended in the workspace settings.

Prettier [supports](https://prettier.io/blog/2018/11/07/1.15.0.html#html-template-literal-in-javascript) `html` template tags out of the box.

## JavaScript Type Checking

VS Code has built-in [intellisense and type checking for JavaScript](https://code.visualstudio.com/docs/nodejs/working-with-javascript). In order to improve it, `tsconfig.json` is present in the project to enable JS checking across all the files. Type checking step is included in the CI workflow to prevent buggy code to be merged. `tsc` command-line TypeScript compiler does not work well with `jsconfig.json` ([issue 50862](https://github.com/microsoft/TypeScript/issues/50862), [issue 43043](https://github.com/microsoft/TypeScript/issues/43043), [issue 41350](https://github.com/microsoft/TypeScript/issues/41350), [issue 6671](https://github.com/microsoft/TypeScript/issues/6671)), that is why `tsconfig.json` is used.

## Environment variables

Environment variables should be added to an `.env.local` file.

| Variable                 | Description                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `ALGOLIA_API_KEY`        | Algolia API key                                                                    |
| `ALGOLIA_APPLICATION_ID` | Algolia application ID                                                             |
| `ALGOLIA_INDEX_AUDIOS`   | Algolia index name                                                                 |
| `ALGOLIA_INDEX_MEMORIES` | Algolia memories index name                                                        |
| `STORAGE_BASE_URL`       | The base URL of the storage containing the MP3 files.                              |
| `FEEDBACK_FORM_AUDIOS`   | The base URL of the Audios Feedback Form, file ID will be appended in the end.     |
| `FEEDBACK_FORM_MEMORIES` | The base URL of the Memories Feedback Form, memory ID will be appended in the end. |
| `DONATION_URL`           | The URL of the external donation page.                                             |
| `DIRECTUS_URL`           | The URL of the Directus headless CMS.                                              |
| `DIRECTUS_STATIC_TOKEN`  | Authentication token for Directus, used instead of username/password.              |
| `YOUTUBE_API_KEY`        | API key for accessing YouTube                                                      |
| `CONTACT_FORM`           | The URL of the external contact form                                               |

For a new environment variable to be accessible from the frontend JS code, use `define` to expose it according to https://vitejs.dev/config/shared-options.html#envprefix.

To access a variable from the HTML template, add it to the `links.js` data file.

## Running locally

- Open terminal in the `frontend` folder.
- Run `npm i` to install the dependencies.
- Create `.env.local` file in the `frontend` folder and add variables according to the [Environment variables](#environment-variables) section.
- Run `npm start` to start the development server, which will automatically rebuild the app as you change files and supports hot module replacement for fast development.
- Open the local website URL using the link shown by the previous command.

### Caveats

On Windows, the `@11ty/eleventy-plugin-vite` package does not work properly. See [issue #22](https://github.com/11ty/eleventy-plugin-vite/issues/22) for detais. Pull requests have been sent, but not yet accepted. Therefore we use a patched version of this plugin from [our repository](https://github.com/PureBhaktiArchive/eleventy-plugin-vite/tree/patched) as of now.

# Continuous Integration and Deployment

CI/CD runs on GitHub Actions. The workflows are located in the [`.github/workflows`](.github/workflows) folder.

- When a pull request is created, a suite of checks is executed automatically.
- Deployment to production happens automatically from the `production` branch.

# Contributing

Please read our [Contributing guidelines](CONTRIBUTING.md).
