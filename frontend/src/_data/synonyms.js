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
      fields: ['id', 'title', 'topics'],
      filter: { status: { _eq: 'active' } },
    })
  );
/*
    .then((response) => {
      console.log(response);
    });*/
