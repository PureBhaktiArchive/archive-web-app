/*!
 * sri sri guru gaurangau jayatah
 */

module.exports = {
  plugins: {
    // In order to use environment variables in HTML
    // Inspired by https://github.com/parcel-bundler/parcel/issues/1209#issuecomment-432424397
    'posthtml-expressions': {
      delimiters: ['{%', '%}'],
      unescapeDelimiters: ['{%%', '%%}'],
      locals: {
        DONATION_URL: process.env.DONATION_URL,
        CONTACT_URL: process.env.CONTACT_URL,
      },
    },
  },
};
