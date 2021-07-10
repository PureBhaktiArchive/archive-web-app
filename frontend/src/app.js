/*!
 * sri sri guru gaurangau jayatah
 */

import algoliasearch from 'algoliasearch/lite';
import 'alpinejs';
import instantsearch from 'instantsearch.js';
import { connectSearchBox } from 'instantsearch.js/es/connectors';
import {
  configure,
  infiniteHits,
  numericMenu,
  pagination,
  panel,
  refinementList,
  stats
} from 'instantsearch.js/es/widgets';
import 'mdn-polyfills/Element.prototype.toggleAttribute';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import './algolia.css';
import './app.css';
import './modal';
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

const soundQualityRatingMapping = {
  Good: { label: 'Good', order: 1, color: 'bg-green-100' },
  Average: { label: 'Average', order: 2, color: 'bg-yellow-100' },
  Low: { label: 'Barely Audible', order: 3, color: 'bg-red-100' },
};

search.addWidgets([
  configure({
    hitsPerPage: 30,
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
  // Loading indicator
  {
    render: ({ searchMetadata = {} }) => {
      const { isSearchStalled } = searchMetadata;
      document
        .getElementById('loading')
        .classList.toggle('hidden', !isSearchStalled);
      document
        .getElementById('stats')
        .classList.toggle('hidden', isSearchStalled);
      if (!isSearchStalled)
        document.getElementById('under-progress').classList.remove('hidden');
    },
  },
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
    sortBy: (a, b) =>
      soundQualityRatingMapping[a.name].order -
      soundQualityRatingMapping[b.name].order,
    transformItems: (items) =>
      items.map((item) => ({
        ...item,
        label: soundQualityRatingMapping[item.label].label || item.label,
        highlighted: soundQualityRatingMapping[item.label].label || item.label,
      })),
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
    limit: 100,
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
      empty: '',
    },
    transformItems: (items) =>
     items.map((item) => ({
        ...item,
        idPadded: item.objectID.padStart(4, '0'),
        topicsArray: item._highlightResult.topics.value.replace(/^-\s*/gm,' ').split('\n'),
        percentageRounded: Math.ceil(item.percentage * 20) * 5, // Rounding up to the next 5% step
        soundQualityRatingLabel:
          soundQualityRatingMapping[item.soundQualityRating].label,
        soundQualityRatingColor:
          soundQualityRatingMapping[item.soundQualityRating].color,
        durationForHumans: new Date(1000 * item.duration)
          .toISOString()
          .substr(11, 8),
        playing:
          sounds.has(item.objectID) && sounds.get(item.objectID).playing(),
        feedbackURL: process.env.FEEDBACK_FORM + item.objectID,
        downloadURL: `https://${process.env.STORAGE_BUCKET}.storage.googleapis.com/${item.objectID}.mp3`,
      })),
  }),
  pagination({
    container: '#pagination',
  }),
]);

search.start();

document
  .querySelectorAll('[data-menu-toggle]')
  .forEach(
    (toggle) =>
      (toggle.onclick = () =>
        document
          .querySelectorAll('[data-menu-toggled]')
          .forEach((target) => target.classList.toggle('hidden')))
  );

const filterPanel = document.getElementById('filter-panel');
const backdrop = document.getElementById('backdrop');

const toggleFilter = (isOpen) => {
  filterPanel.toggleAttribute('data-state-open', isOpen);
  backdrop.toggleAttribute('data-state-open', isOpen);

  // Preventing body from scrolling behind the overlay
  document.body.toggleAttribute('data-state-overlayed', isOpen);
};

document.querySelectorAll('[data-filter-toggle]').forEach(
  (element) =>
    (element.onclick = () => {
      const isOpen = filterPanel.hasAttribute('data-state-open');
      toggleFilter(!isOpen);
    })
);

tippy('[data-tippy-content]');
