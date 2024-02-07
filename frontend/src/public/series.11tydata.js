/*!
 * sri sri guru gaurangau jayatah
 */

module.exports = {
  eleventyComputed: {
    // Download URL
    fileUrl: (data) =>
      `${process.env.STORAGE_BASE_URL}/${data.series.audio.fileId}.mp3`,
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
    title: (data) => data.series.audio.title,
  },
};
