/*!
 * sri sri guru gaurangau jayatah
 */

import algoliasearch from 'algoliasearch/lite';
import Alpine from 'alpinejs';
import instantsearch from 'instantsearch.js/es';
import {
  configure,
  hits,
  numericMenu,
  pagination,
  refinementList,
  stats,
} from 'instantsearch.js/es/widgets';
import '../css/algolia.css';
import { itemTemplate } from './memories-item-template';
import { searchBar } from './search-bar';

const searchClient = algoliasearch(
  import.meta.env.ALGOLIA_APPLICATION_ID,
  import.meta.env.ALGOLIA_API_KEY
);
const search = instantsearch({
  indexName: import.meta.env.ALGOLIA_INDEX_MEMORIES,
  searchClient,
});

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
        document.getElementById('results-footer').classList.remove('hidden');
    },
  },
  refinementList({
    container: '#program-name-list  div:empty',
    attribute: 'programName',
    sortBy: ['name:asc'],
  }),
  refinementList({
    container: '#speaker-country-list  div:empty',
    attribute: 'speakerCountry',
    sortBy: ['name:asc'],
  }),
  refinementList({
    container: '#language-list  div:empty',
    attribute: 'language',
    sortBy: ['name:asc'],
  }),
  numericMenu({
    container: '#duration-menu  div:empty',
    attribute: 'duration',
    items: [
      { label: 'Any' },
      { label: 'Less than 15 minutes', end: 900 },
      { label: '15-45 minutes', start: 900, end: 2700 },
      { label: '45+ minutes', start: 2700 },
    ],
  }),
  refinementList({
    container: '#gurus-list  div:empty',
    attribute: 'gurus.fullName',
    showMore: true,
    showMoreLimit: 20,
    sortBy: ['gurus.desc'],
  }),
  hits({
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

search.start();
Alpine.start();
