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
    fileUrl: (data) =>
      `${process.env.STORAGE_BASE_URL}/${data.audio.objectID}.mp3`,
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
    title: (data) => data.audio.title,
  },
};
