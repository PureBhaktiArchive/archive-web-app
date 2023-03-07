/*!
 * sri sri guru gaurangau jayatah
 */

/**
 * Formats duration in human-readable format
 * @param {number} durationInSeconds
 * @param {number} [referenceDuration] Another duration in seconds to align the formatted string length to
 * @returns {string} Duration in hh:mm:ss format
 */
// Using CJS syntax because we have to import it in Eleventy config, which does not support ESM yet.
// https://github.com/11ty/eleventy/issues/836
module.exports.formatDurationForHumans = (
  durationInSeconds,
  referenceDuration
) =>
  new Date(1000 * durationInSeconds)
    .toISOString()
    .substring(
      Math.max(durationInSeconds, referenceDuration || 0) >= 3600 ? 11 : 14,
      19
    );
