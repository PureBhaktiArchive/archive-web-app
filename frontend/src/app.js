/*!
 * sri sri guru gaurangau jayatah
 */

import algoliasearch from 'algoliasearch/lite';
import instantsearch from 'instantsearch.js';
import {
  configure,
  infiniteHits,
  numericMenu,
  pagination,
  panel,
  poweredBy,
  refinementList,
  searchBox,
} from 'instantsearch.js/es/widgets';
import './algolia.css';
import './app.css';
import './tailwind.css';

const searchClient = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
);

const search = instantsearch({
  indexName: process.env.ALGOLIA_INDEX,
  searchClient,
});

const languageCategories = {
  E: { label: 'English only', order: 1 },
  H: { label: 'Hindi only', order: 2 },
  B: { label: 'Bengali only', order: 3 },
  EH: { label: 'English and Hindi', order: 4 },
  EB: { label: 'English and Bengali', order: 5 },
  HB: { label: 'Hindi and Bengali', order: 6 },
  EHB: { label: 'English, Hindi, Bengali', order: 7 },
  O: { label: 'English with translation to other languages', order: 8 },
};

const soundQualityOrder = ['Low', 'Average', 'Good'];

search.addWidgets([
  configure({
    hitsPerPage: 100,
  }),
  searchBox({
    container: '#searchbox',
  }),
  poweredBy({
    container: '#powered-by',
  }),
  panel({
    templates: {
      header: 'Location',
    },
  })(refinementList)({
    container: '#location-list',
    attribute: 'location',
    searchable: true,
    showMore: true,
    showMoreLimit: 50,
    sortBy: ['name:asc'],
  }),
  panel({
    templates: {
      header: 'Languages',
    },
  })(refinementList)({
    container: '#language-list',
    attribute: 'languageCategory',
    transformItems: (items) =>
      items
        .sort(
          (a, b) =>
            languageCategories[a.value].order -
            languageCategories[b.value].order
        )
        .map((item) => ({
          ...item,
          label: languageCategories[item.label].label,
          highlighted: languageCategories[item.label].label,
        })),
  }),
  panel({
    templates: {
      header: 'Sound Quality',
    },
  })(refinementList)({
    container: '#sound-quality-list',
    attribute: 'soundQualityRating',
    sortBy: (a, b) => {
      return (
        soundQualityOrder.indexOf(a.name) - soundQualityOrder.indexOf(b.name)
      );
    },
  }),
  panel({
    templates: {
      header: 'Category',
    },
  })(refinementList)({
    container: '#category-list',
    attribute: 'category',
    sortBy: ['name:asc'],
  }),
  panel({
    templates: {
      header: 'Year',
    },
  })(refinementList)({
    container: '#year-list',
    attribute: 'year',
    sortBy: ['name:asc'],
  }),
  panel({
    templates: {
      header: 'Srila Gurudeva Timing',
    },
  })(numericMenu)({
    container: '#percentage-menu',
    attribute: 'percentage',
    items: [
      { label: 'Any' },
      { label: 'More than 50%', start: 0.5 },
      { label: 'More than 90%', start: 0.9 },
    ],
  }),
  panel({
    templates: {
      header: 'Duration',
    },
  })(numericMenu)({
    container: '#duration-menu',
    attribute: 'duration',
    items: [
      { label: 'Any' },
      { label: 'Less than 15 minutes', end: 15 },
      { label: '15-45 minutes', start: 15, end: 46 },
      { label: '45+ minutes', start: 30 },
    ],
  }),
  infiniteHits({
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
