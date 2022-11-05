/*!
 * sri sri guru gaurangau jayatah
 */

const algoliasearch = require('algoliasearch');
const { AssetCache } = require('@11ty/eleventy-fetch');

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
);
const index = client.initIndex(process.env.ALGOLIA_INDEX);

module.exports = async function () {
  // Pass in your unique custom cache key
  // (normally this would be tied to your API URL)
  let asset = new AssetCache('pure_bhakti_archive');
  // check if the cache is fresh within the last day
  if (asset.isCacheValid('1d')) {
    // return cached data.
    return asset.getCachedValue();
  }
  let hits = [];
  let algoliaHitsContent = index
    .browseObjects({
      batch: (batch) => {
        hits = hits.concat(batch);
      },
    })
    .then(() => {
      return hits;
    });
  await asset.save(algoliaHitsContent, 'json');
  return algoliaHitsContent;
};
