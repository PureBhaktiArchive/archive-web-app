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
    // Download URL
    fileUrl: `${process.env.STORAGE_BASE_URL}/{{audio.fileId}}.mp3`,
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
