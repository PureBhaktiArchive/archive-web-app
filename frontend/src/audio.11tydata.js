/*!
 * sri sri guru gaurangau jayatah
 */

const { formatReducedPrecisionDate } = require('./reduced-precision-date');

module.exports = {
  pagination: {
    data: 'audios',
    size: 1,
    alias: 'audio',
  },
  /** @type {Record<string, (data: EleventyGlobalData & {audio: Audio}) => unknown>} */
  eleventyComputed: {
    // Compiling a record for the audio player
    // We can't just pass `audio` there because 11ty adds own properties to the `audio` project
    record: ({
      audio: {
        fileId,
        title,
        date,
        dateUncertain,
        location,
        locationUncertain,
        category,
        languages,
        duration,
      },
    }) => ({
      fileId,
      title,
      dateForHumans: formatReducedPrecisionDate(date),
      dateUncertain,
      location,
      locationUncertain,
      category,
      languages,
      duration,
    }),
    title: (data) => data.audio.title,
  },
};
