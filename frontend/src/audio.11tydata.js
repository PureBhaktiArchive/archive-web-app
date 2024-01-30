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
    // Download URL
    fileUrl: (data) =>
      `${process.env.STORAGE_BASE_URL}/${data.audio.fileId}.mp3`,
    // Computing the Feedback URL here because the env variables are not available in templates
    feedbackUrl: (data) =>
      `${process.env.FEEDBACK_FORM_AUDIOS}${data.audio.fileId}`,
    // Compiling content details for the audio player
    contentDetails: ({
      audio: {
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
