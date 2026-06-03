# Archive Web App — Agent Guide

All frontend commands run from `frontend/`. The root is not a Node package.

## Commands (run in `frontend/`)

| Command | What |
|---|---|
| `npm start` | Dev server (Eleventy + Vite HMR, incremental) |
| `npm run build` | Static build → `frontend/dist/` |
| `npm run lint` | ESLint |
| `npm run check-js-typing` | `tsc -p jsconfig.json && tsc -p src/js/jsconfig.json` |
| `npm test` | Jest (only 2 test files) |
| `npx prettier --check .` | Formatting check |

CI order: `npm ci` → `lint` → `check-js-typing` → `build` → `test` → `prettier --check`.

## Env vars

- `.env.local` in `frontend/` (loaded by dotenv in eleventy config).
- Expose to client JS: add to `vite.config.js` `define` block.
- Expose to HTML templates: add to `src/_data/links.js`.

## Code style & quirks

- **Header required:** every source file starts with `/*! * sri sri guru gaurangau jayatah */` (ESLint rule). Note: `!` then space then `*`.
- **Prettier plugin order:** `@shopify/prettier-plugin-liquid` then `prettier-plugin-tailwindcss`.
- **`.npmrc` has `save-exact=true`** — exact version pinning.
- **HTML files** are Liquid templates in this repo.
- **Two JS environments with separate jsconfig files:**
  - Root `jsconfig.json` — Node.js/CommonJS (Eleventy configs, tests). Excludes `src/js/`.
  - `src/js/jsconfig.json` — browser/ES2022 modules (Alpine.js client code). Uses `types: ["vite/client"]`.
- **Patched plugin:** `@11ty/eleventy-plugin-vite` from `PureBhaktiArchive/eleventy-plugin-vite#patched`.
- **Vite config** passed explicitly via `eleventy.config.cjs`, not auto-loaded.

## Tests

Jest, only 2 files: `src/languages.test.js`, `src/reduced-precision-date.test.js`.

## Deploy

- Firebase Hosting, static site from `frontend/dist`.
- `production` branch → production; `test` branch → test.
- PRs with `preview` label → Firebase preview channel.
- Algolia index updated during deploy (temp index swap).
- `.firebaserc` is gitignored.

## Directus CMS

- SDK v14 (`@directus/sdk: "14.0.0"`). Schema types in `src/types.ts`.
- `directus/snapshots/` — CMS schema snapshots.
