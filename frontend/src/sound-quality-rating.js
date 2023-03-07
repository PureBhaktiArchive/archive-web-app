/*!
 * sri sri guru gaurangau jayatah
 */

// Using CJS syntax because we have to import it in Eleventy config, which does not support ESM yet.
// https://github.com/11ty/eleventy/issues/836
module.exports.soundQualityRatingMapping = {
  Good: { label: 'Good', order: 1, color: 'bg-emerald-100' },
  Average: { label: 'Average', order: 2, color: 'bg-yellow-100' },
  Low: { label: 'Barely Audible', order: 3, color: 'bg-red-100' },
};
