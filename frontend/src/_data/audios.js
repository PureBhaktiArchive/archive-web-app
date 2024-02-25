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
      fields: ['*'],
      filter: { status: { _eq: 'active' } },
      // Fetching all items. Later, when number of records grows, we may need to fetch in pages as described in https://docs.directus.io/reference/query.html#offset
      // Also, we assume that the `QUERY_LIMIT_MAX` env variable is not set on the server.
      // Fetching only few items in the development mode to speed up rebuilding the pages
      limit: process.env.ELEVENTY_RUN_MODE === 'build' ? -1 : 50,
      // Historically, in the code we refer to the `id` as `fileId`. Therefore using aliases here.
      alias: { fileId: 'id' },
    })
  );
