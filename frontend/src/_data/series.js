/*!
 * sri sri guru gaurangau jayatah
 */

const { readItems } = require('@directus/sdk');

/**
 * @param {EleventyGlobalData} data
 */

module.exports = ({ directus }) =>
  directus.request(
    readItems('series', {
      fields: ['*.*.*'],
      filter: { status: { _eq: 'published' } },
      // Also, we assume that the `QUERY_LIMIT_MAX` env variable is not set on the server.
      limit: -1,
    })
  );
