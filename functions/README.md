# Backend

This sub-project provides serverless backend for the Archive in the form of Cloud Functions for Firebase.

Project is written in pure JavaScript without any transpilation. ES Modules format is used instead of CommonJS.

## Cloud Functions detection

- Functions should be re-exported in the root `index.js` file.
- Exported functions can be grouped in an hierarchy if needed.
- Firebase console shows grouped functions with hyphens instead of dots, i.e. `group-another-function1`.

## Environment configuration

See [Firebase Environment configuration](https://firebase.google.com/docs/functions/config-env) documentation for details.

| Key                       | Description                             |
| ------------------------- | --------------------------------------- |
| `algolia.appid`           | Algolia’s App ID                        |
| `algolia.apikey`          | Algolia’s API key                       |
| `algolia.index.audios`    | Algolia’s audios index name             |
| `algolia.index.memories`  | Algolia’s memories index name           |
| `storage.bucket`          | Google Storage bucket for the MP3 files |
| `memories.spreadsheet.id` | Spreadsheet ID of the Memories sheet    |

## Tests

Crucial code should be tested. Jest is used for testing. Tests should have name format `*.spec.js`.

## Linting

All the code is linted with `ESLint`, both in the VS Code using a recommended extension and in the CI workflow.

- Common header is automatically added to all the JS files using `header-eslint-plugin`.

## Type Checking

TypeScript is used for type checking the JavaScript files. No transpilation takes place, only type checking. This is built-in in VS Code, and also running the type check is integrated into the CI workflow.

References:

- https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html
- https://www.scraggo.com/type-check-jsdocs-typescript/
- https://docs.joshuatz.com/cheatsheets/js/jsdoc/
