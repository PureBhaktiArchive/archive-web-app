/*!
 * sri sri guru gaurangau jayatah
 */

const path = require('path');

module.exports =
  require(path.resolve(__dirname, '../../', process.env.AUDIOS_DATA_PATH)) ||
  [];
