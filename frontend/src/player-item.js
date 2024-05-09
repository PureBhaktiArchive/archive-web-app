/*!
 * sri sri guru gaurangau jayatah
 */

const { formatReducedPrecisionDate } = require('./reduced-precision-date');

/**
 *
 * @param {Audio} audio
 * @returns {PlayerItem}
 */
const createPlayerItem = ({
  fileId,
  title,
  date,
  dateUncertain,
  timeOfDay,
  location,
  locationUncertain,
  category,
  percentage,
  soundQualityRating,
  languages,
  duration,
}) => ({
  fileId,
  title,
  dateForHumans: formatReducedPrecisionDate(date),
  dateUncertain,
  timeOfDay,
  location,
  locationUncertain,
  category,
  percentage,
  soundQualityRating,
  languages,
  duration,
});

/**
 *
 * @param {Audio[]} audios
 * @returns {PlayerItem[]}
 */
const createPlayerItems = (audios) => audios.map(createPlayerItem);

/**
 *
 * @param {Audio | Audio[]} input
 * @returns
 */
const toPlayerItem = (input) =>
  input instanceof Array ? createPlayerItems(input) : createPlayerItem(input);

module.exports = { toPlayerItem };
