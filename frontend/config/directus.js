/*!
 * sri sri guru gaurangau jayatah
 */

const { createDirectus, staticToken, rest } = require('@directus/sdk');
const EleventyFetch = require('@11ty/eleventy-fetch');

const cachedFetch =
  /**
   * @type {import('@directus/sdk').FetchInterface}
   * @param {RequestInit} init
   */
  (input, init) =>
    // Caching only GET requests. See https://github.com/11ty/eleventy-fetch/issues/20
    init.method === 'GET'
      ? EleventyFetch(input, {
          // Using such a small duration to catch up with changes in the CMS during development.
          // Still, caching can help working offline: https://www.11ty.dev/docs/plugins/fetch/#what-happens-when-a-request-fails
          duration: '1m',
          // We suppose that all Directus requests return JSON
          type: 'json',
          // Not a well-documented option, see https://www.11ty.dev/docs/plugins/fetch/#fetch-google-fonts-css
          fetchOptions: init,
        })
      : fetch(input, init);

module.exports.getDirectusClient = () =>
  createDirectus(process.env.DIRECTUS_URL, { globals: { fetch: cachedFetch } })
    .with(staticToken(process.env.DIRECTUS_STATIC_TOKEN))
    .with(rest());
