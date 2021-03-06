/*!
 * sri sri guru gaurangau jayatah
 */

import algoliasearch from 'algoliasearch/lite';
import instantsearch from 'instantsearch.js';
import { connectSearchBox } from 'instantsearch.js/es/connectors';
import {
  configure,
  infiniteHits,
  numericMenu,
  pagination,
  panel,
  refinementList,
  stats,
} from 'instantsearch.js/es/widgets';
import './algolia.css';
import './app.css';
import { sounds } from './player';

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

const soundQualityOrder = ['Good', 'Average', 'Low'];
const soundQualityRatingColors = {
  Good: 'bg-green-100',
  Average: 'bg-yellow-100',
  Low: 'bg-red-100',
};

search.addWidgets([
  configure({
    hitsPerPage: 100,
  }),
  connectSearchBox((renderOptions, isFirstRender) => {
    const { query, refine, widgetParams } = renderOptions;

    const input = widgetParams.container.querySelector('input');
    if (isFirstRender) {
      input.addEventListener('input', (event) => {
        refine(event.target.value);
      });
    }
    input.value = query;
  })({
    container: document.querySelector('#searchbox'),
  }),
  stats({
    container: '#stats',
    templates: {
      text: `
  {{#hasNoResults}}No results{{/hasNoResults}}
  {{#hasOneResult}}1 result{{/hasOneResult}}
  {{#hasManyResults}}{{#helpers.formatNumber}}{{nbHits}}{{/helpers.formatNumber}} results{{/hasManyResults}}
`,
    },
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
      { label: 'Less than 15 minutes', end: 900 },
      { label: '15-45 minutes', start: 900, end: 2700 },
      { label: '45+ minutes', start: 2700 },
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
        percentageRounded: Math.ceil(item.percentage * 20) * 5, // Rounding up to the next 5% step
        soundQualityRatingColor:
          soundQualityRatingColors[item.soundQualityRating],
        durationForHumans: new Date(1000 * item.duration)
          .toISOString()
          .substr(11, 8),
        playing:
          sounds.has(item.objectID) && sounds.get(item.objectID).playing(),
        feedbackURL: process.env.FEEDBACK_FORM + item.objectID,
      })),
  }),
  pagination({
    container: '#pagination',
  }),
]);

search.start();

document.getElementById('menu-button').onclick = function toggleMenu() {
  for (const element of document.getElementsByClassName('menu-toggle')) {
    element.classList.toggle('hidden');
  }
};
