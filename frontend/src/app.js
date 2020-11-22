/*!
 * sri sri guru gaurangau jayatah
 */

import algoliasearch from 'algoliasearch/lite';
import instantsearch from 'instantsearch.js';
import {
  hits,
  numericMenu,
  pagination,
  refinementList,
  searchBox,
} from 'instantsearch.js/es/widgets';
import './app.css';

const searchClient = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
);

const search = instantsearch({
  indexName: process.env.ALGOLIA_INDEX,
  searchClient,
});

search.addWidgets([
  searchBox({
    container: '#searchbox',
  }),
  refinementList({
    container: '#location-list',
    attribute: 'location',
    sortBy: ['name:asc'],
  }),
  refinementList({
    container: '#language-list',
    attribute: 'languages',
    sortBy: ['name:asc'],
  }),
  refinementList({
    container: '#sound-quality-list',
    attribute: 'soundQualityRating',
    sortBy: ['name:asc'],
  }),
  refinementList({
    container: '#category-list',
    attribute: 'category',
    sortBy: ['name:asc'],
  }),
  refinementList({
    container: '#year-list',
    attribute: 'year',
    sortBy: ['name:asc'],
  }),
  numericMenu({
    container: '#percentage-menu',
    attribute: 'percentage',
    items: [
      { label: 'Any' },
      { label: 'More than 50%', start: 0.5 },
      { label: 'More than 90%', start: 0.9 },
    ],
  }),
  numericMenu({
    container: '#duration-menu',
    attribute: 'duration',
    items: [
      { label: 'Any' },
      { label: 'Less than 15 minutes', end: 15 },
      { label: '15-30 minutes', start: 15, end: 30 },
      { label: '30 minutes and longer', start: 30 },
    ],
  }),
  hits({
    container: '#hits',
    templates: {
      item: document.getElementById('item-template').innerHTML,
    },
    transformItems: (items) =>
      items.map((item) => ({
        ...item,
        percentage: Math.ceil(item.percentage * 20) * 5, // Rounding up to the next 5% step
      })),
  }),
  pagination({
    container: '#pagination',
  }),
]);

search.start();
