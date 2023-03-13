/*!
 * sri sri guru gaurangau jayatah
 */

const path = require('path');

module.exports = {
  audios:
    require(path.resolve(__dirname, '../', process.env.AUDIOS_DATA_PATH)) || [],
  pagination: {
    data: 'audios',
    size: 1,
    alias: 'audio',
  },
  eleventyComputed: {
    // Compiling content details for the audio player
    contentDetails: ({
      audio: {
        title,
        dateForHumans,
        dateUncertain,
        location,
        locationUncertain,
        category,
        languages,
      },
    }) => ({
      title,
      dateForHumans,
      dateUncertain,
      location,
      locationUncertain,
      category,
      languages,
    }),
  },
};
