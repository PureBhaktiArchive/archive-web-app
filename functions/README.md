# Backend

This sub-project provides serverless backend for the Archive in the form of Cloud Functions for Firebase.

## Project structure

### Functions

- Functions are detected and exported automatically in the `index.ts`. It scans the folder for `*.f.ts` files and exports them for the Firebase platform.
- Directories will become segments in the resulting function name, i.e. `dir/another/function1.f.ts` file will become `dir.another.function1` function.
- If the file name itself contains segments, they will be preserved, i.e. `group.function1.f.ts` file will become `group.function1` function.
- The file can either have ES6 default export, CommonJS `module.exports` or named exports. In the latter case the file name will become a group of functions, i.e. `dir/filename.f.ts` with two exports will become `dir.filename.export1` and `dir.filename.export2` functions.
- Firebase console shows grouped functions with hyphens instead of dots, i.e. `dir-another-function1`.

## Tests

Crucial code should be tested. Jest is used for testing. Tests should be in the `spec` folder and have name `*.spec.ts`.

## Linting

All the code is linted with `ESLint`.

- Common header is added to all the JS/TS files using `header-eslint-plugin`.
