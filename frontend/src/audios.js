/*!
 * sri sri guru gaurangau jayatah
 */

import algoliasearch from 'algoliasearch/lite';
import Alpine from 'alpinejs';
import instantsearch from 'instantsearch.js/es';
import {
  configure,
  infiniteHits,
  numericMenu,
  pagination,
  panel,
  refinementList,
  stats,
} from 'instantsearch.js/es/widgets';
import 'mdn-polyfills/Element.prototype.toggleAttribute';
import './algolia.css';
import { itemTemplate } from './audio-item-template';
import './player';
import { searchBar } from './search-bar';
import './search-result-item';
import { soundQualityRatingMapping } from './sound-quality-rating.mjs';
import './webshare';

const searchClient = algoliasearch(
  process.env.ALGOLIA_APPLICATION_ID,
  process.env.ALGOLIA_API_KEY
);
const search = instantsearch({
  indexName: process.env.ALGOLIA_INDEX_AUDIOS,
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

search.addWidgets([
  configure({
    hitsPerPage: 30,
  }),
  searchBar({
    container: document.querySelector('#searchbox'),
  }),
  stats({
    container: '#stats',
    templates: {
      text: (data) =>
        data.hasManyResults
          ? `${data.nbHits} results`
          : data.hasOneResult
          ? '1 result'
          : 'No results',
    },
  }),
  // Loading indicator
  {
    $$type: 'Loading indicator',
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
      header: () => 'Location',
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
      header: () => 'Languages',
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
      header: () => 'Sound Quality',
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
      header: () => 'Category',
    },
  })(refinementList)({
    container: '#category-list',
    attribute: 'category',
    sortBy: ['name:asc'],
  }),
  panel({
    templates: {
      header: () => 'Year',
    },
  })(refinementList)({
    container: '#year-list',
    attribute: 'year',
    limit: 100,
    sortBy: ['name:asc'],
    cssClasses: {
      list: 'columns-[5rem]',
    },
  }),
  panel({
    templates: {
      header: () => 'Srila Gurudeva Timing',
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
      header: () => 'Duration',
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
      item: itemTemplate,
      empty: () => '',
    },
  }),
  pagination({
    container: '#pagination',
  }),
]);

if (process.env.NODE_ENV !== 'production') {
  // Making devtools detect ALpine on the page: https://github.com/alpine-collective/alpinejs-devtools/issues/327
  window['Alpine'] = Alpine;
}

search.start();

// This store keeps the currently playing file Id
// Cannot use null for single-value stores: https://github.com/alpinejs/alpine/discussions/3204
Alpine.store('activeFileId', 0);

// This store provides access to the search helper from the search result item component
// Search should be already started for the helper to be defined
Alpine.store('searchHelper', search.helper);

//TODO: Filter panel to be migrated to Alpine.js: https://trello.com/c/lesy1wNY/182-use-alpine-for-menu-and-filter-panel
const filterPanel = document.getElementById('filter-panel');
const backdrop = document.getElementById('backdrop');

const toggleFilter = (isOpen) => {
  filterPanel.toggleAttribute('data-state-open', isOpen);
  backdrop.toggleAttribute('data-state-open', isOpen);

  // Preventing body from scrolling behind the overlay
  document.body.toggleAttribute('data-state-overlayed', isOpen);
};

document.querySelectorAll('[data-filter-toggle]').forEach(
  (/** @type {HTMLElement} */ element) =>
    (element.onclick = () => {
      const isOpen = filterPanel.hasAttribute('data-state-open');
      toggleFilter(!isOpen);
    })
);
