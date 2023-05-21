/*!
 * sri sri guru gaurangau jayatah
 */

/** @type {import('vite').UserConfig} */
module.exports = {
  // Exposing certain environment variables according to https://vitejs.dev/config/shared-options.html#envprefix
  define: {
    'import.meta.env.STORAGE_BASE_URL': JSON.stringify(
      process.env.STORAGE_BASE_URL
    ),
    'import.meta.env.FEEDBACK_FORM_AUDIOS': JSON.stringify(
      process.env.FEEDBACK_FORM_AUDIOS
    ),
    'import.meta.env.FEEDBACK_FORM_MEMORIES': JSON.stringify(
      process.env.FEEDBACK_FORM_MEMORIES
    ),
    'import.meta.env.ALGOLIA_APPLICATION_ID': JSON.stringify(
      process.env.ALGOLIA_APPLICATION_ID
    ),
    'import.meta.env.ALGOLIA_API_KEY': JSON.stringify(
      process.env.ALGOLIA_API_KEY
    ),
    'import.meta.env.ALGOLIA_INDEX_AUDIOS': JSON.stringify(
      process.env.ALGOLIA_INDEX_AUDIOS
    ),
    'import.meta.env.ALGOLIA_INDEX_MEMORIES': JSON.stringify(
      process.env.ALGOLIA_INDEX_MEMORIES
    ),
  },
};
