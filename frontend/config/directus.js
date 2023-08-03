/*!
 * sri sri guru gaurangau jayatah
 */

const { createDirectus, staticToken, rest } = require('@directus/sdk');

module.exports.getDirectusClient = () =>
  createDirectus(process.env.DIRECTUS_URL)
    .with(staticToken(process.env.DIRECTUS_STATIC_TOKEN))
    .with(rest());
