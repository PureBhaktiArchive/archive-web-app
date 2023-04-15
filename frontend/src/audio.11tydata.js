/*!
 * sri sri guru gaurangau jayatah
 */

module.exports = {
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
        duration,
      },
    }) => ({
      title,
      dateForHumans,
      dateUncertain,
      location,
      locationUncertain,
      category,
      languages,
      duration,
    }),
  },
};
