/*!
 * sri sri guru gaurangau jayatah
 */

const { readItems } = require('@directus/sdk');

/**
 * @param {EleventyGlobalData} data
 */
module.exports = ({ directus }) =>
  directus
    .request(
      readItems('series', {
        fields: ['*', { audios: [{ audios_id: ['*'] }] }],
        filter: { status: { _eq: 'published' } },
        sort: 'sort',
        deep: {
          audios: {
            _sort: 'sort',
            // At this time, alias has not been typed yet for use in other query parameters like deep. See https://docs.directus.io/guides/sdk/types.html#working-with-input-query-types
            _alias: {
              // Historically, in the code we refer to the `id` as `fileId`. Therefore using aliases here.
              fileId: 'id',
            },
          },
        },
        limit: -1,
      })
    )
    // Transforming the response to fit our expected data structure
    .then((response) =>
      response.map(({ id, title, audios }) => ({
        id,
        title,
        // Eliminating the junction object manually because it is not yet possible to skip it in the query: https://github.com/directus/directus/discussions/4112
        audios: audios.map(
          /**
           * We need to specify the type explicitly because Directus' type is not recognized properly
           * @param {{ audios_id: Audio; }} serieAudio
           * @returns {Audio}
           */
          (serieAudio) => serieAudio.audios_id
        ),
      }))
    );
