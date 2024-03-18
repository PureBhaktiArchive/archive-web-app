/*!
 * sri sri guru gaurangau jayatah
 */

module.exports = {
  pagination: {
    data: 'audios',
    size: 1,
    alias: 'audio',
  },
  /** @type {Record<string, (data: EleventyGlobalData & {audio: Audio}) => unknown>} */
  eleventyComputed: {
    title: (data) => data.audio.title,
  },
};
