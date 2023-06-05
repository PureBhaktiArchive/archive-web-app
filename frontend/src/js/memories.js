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
  panel,
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
  panel({
    templates: {
      header: () => 'Program Name',
    },
  })(refinementList)({
    container: '#program-name-list',
    attribute: 'programName',
    sortBy: ['name:asc'],
  }),
  panel({
    templates: {
      header: () => 'Speaker Country',
    },
  })(refinementList)({
    container: '#speaker-country-list',
    attribute: 'speakerCountry',
    sortBy: ['name:asc'],
  }),
  panel({
    templates: {
      header: () => 'Languages',
    },
  })(refinementList)({
    container: '#language-list',
    attribute: 'language',
    sortBy: ['name:asc'],
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
  panel({
    templates: {
      header: (options, { html }) => html`
        <span>Initiating Guru(s)</span>
        <p class="text-xs font-normal lowercase">
          [Sorted by decreasing count of matching records]
        </p>
      `,
    },
  })(refinementList)({
    container: '#gurus-list',
    attribute: 'gurus.fullName',
    showMore: true,
    showMoreLimit: 20,
    sortBy: ['gurus:desc'],
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
