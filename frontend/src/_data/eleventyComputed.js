/*!
 * sri sri guru gaurangau jayatah
 */

module.exports = {
  page: {
    title: (data) =>
      [data.title, data.website.title].filter(Boolean).join(' | '),
  },
  eleventyNavigation: {
    key: (data) => data.eleventyNavigation.key || data.title,
  },
};
