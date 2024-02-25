/*!
 * sri sri guru gaurangau jayatah
 */

module.exports = {
  eleventyComputed: {
    // Download URL
    fileUrl: (data) =>
      `${process.env.STORAGE_BASE_URL}/${data.series.audios.fileId}.mp3`,
    // Computing the Feedback URL here because the env variables are not available in templates
    feedbackUrl: (data) =>
      `${process.env.FEEDBACK_FORM_AUDIOS}${data.series.audios.fileId}`,
  },
};
