/*!
 * sri sri guru gaurangau jayatah
 */

const { readItems } = require('@directus/sdk');

/**
 * @param {{directus: DirectusClient}} data
 */
module.exports = ({ directus }) =>
  directus.request(
    readItems('audios', {
      fields: ['*'],
      filter: { status: { _eq: 'active' } },
      // Fetching all items. Later, when number of records grows, we may need to fetch in pages as described in https://docs.directus.io/reference/query.html#offset
      // Also, we assume that the `QUERY_LIMIT_MAX` env variable is not set on the server.
      limit: -1,
      alias: { fileId: 'id' },
    })
  );
