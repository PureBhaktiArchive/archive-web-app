/*!
 * sri sri guru gaurangau jayatah
 */

/**
 * Using JS computed data to have access to the environment variable.
 * Front matter does not have access to `process.env`.
 * See docs: https://www.11ty.dev/docs/data-computed/
 */
module.exports = {
  eleventyComputed: {
    eleventyNavigation: {
      url: process.env.DONATION_URL,
    },
  },
};
