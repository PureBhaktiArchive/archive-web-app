/**
 * According to https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript
 */

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly STORAGE_BASE_URL: string;
  readonly FEEDBACK_FORM_AUDIOS: string;
  readonly FEEDBACK_FORM_MEMORIES: string;
  readonly ALGOLIA_APPLICATION_ID: string;
  readonly ALGOLIA_API_KEY: string;
  readonly ALGOLIA_INDEX_AUDIOS: string;
  readonly ALGOLIA_INDEX_MEMORIES: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
