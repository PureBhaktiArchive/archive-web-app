/*!
 * sri sri guru gaurangau jayatah
 */

/**
 * This file is for Eleventy, written in CommonJS module syntax.
 * The same code is duplicated in the `src/js` folder in ESM syntax for the browser.
 */

/**
 * Mapping of the Sound Quality Rating to its label and color
 */
// Using CJS syntax because we have to import it in Eleventy config, which does not support ESM yet.
// https://github.com/11ty/eleventy/issues/836
module.exports.soundQualityRatingMapping = {
  Good: { label: 'Good', order: 1, color: 'bg-emerald-100' },
  Average: { label: 'Average', order: 2, color: 'bg-yellow-100' },
  Low: { label: 'Barely Audible', order: 3, color: 'bg-red-100' },
};
