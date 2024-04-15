/*!
 * sri sri guru gaurangau jayatah
 */

const { readItems } = require('@directus/sdk');

/**
 * @param {EleventyGlobalData} data
 */
module.exports = ({ directus }) =>
  directus.request(
    readItems('audios', {
      fields: ['*', { series: [{ series_id: ['title'] }] }],
      filter: { status: { _eq: 'active' } },
      deep: {
        series: {
          _filter: { series_id: { status: { _eq: 'published' } } },
        },
      },
      // Fetching all items. Later, when number of records grows, we may need to fetch in pages as described in https://docs.directus.io/reference/query.html#offset
      // Also, we assume that the `QUERY_LIMIT_MAX` env variable is not set on the server.
      limit: -1,
      ...(process.env.ELEVENTY_RUN_MODE === 'build'
        ? {}
        : // Overriding some options in development
          {
            // Fetching only few items in the development mode to speed up rebuilding the pages
            limit: 50,
            /**
             * Because of the limit above, not all search results will be clickable.
             * Sorting by date to match the Algolia's default sorting and thus
             * to make the first 50 search results clickable in development.
             * See `custoking` in `algolia/audios.json`.
             */
            sort: 'date',
          }),
      // Historically, in the code we refer to the `id` as `fileId`. Therefore using aliases here.
      alias: { fileId: 'id' },
    })
  );
