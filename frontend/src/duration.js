/*!
 * sri sri guru gaurangau jayatah
 */

/**
 * Formats duration in human-readable format
 * @param {number} durationInSeconds
 * @param {number} [referenceDuration] Another duration in seconds to align the formatted string length to
 * @returns {string} Duration in hh:mm:ss format
 */
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
