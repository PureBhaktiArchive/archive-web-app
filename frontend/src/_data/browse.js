/*!
 * sri sri guru gaurangau jayatah
 */

const filesystem = require('fs');
const algoliasearch = require('algoliasearch');
const { AssetCache } = require('@11ty/eleventy-fetch');

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
);
const index = client.initIndex(process.env.ALGOLIA_INDEX);

let hits = [];
index
  .browseObjects({
    batch: (batch) => {
      hits = hits.concat(batch);
    },
  })
  .then(() => {
    const data = JSON.stringify(hits);
    filesystem.writeFile('./../lectures.json', data, (err) => {
      if (err) {
        console.log('Error writing file', err);
      } else {
        console.log('JSON data is written to the file successfully');
      }
    });
  });

module.exports = async function () {
  // Pass in your unique custom cache key
  // (normally this would be tied to your API URL)
  let asset = new AssetCache('pure_bhakti_archive');
  // check if the cache is fresh within the last day
  if (asset.isCacheValid('1d')) {
    // return cached data.
    return asset.getCachedValue();
  }
  const algoliaHitsContent = require('../../../lectures.json');
  await asset.save(algoliaHitsContent, 'json');
  return algoliaHitsContent;
};
