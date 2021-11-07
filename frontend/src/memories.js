/*!
 * sri sri guru gaurangau jayatah
 */

import algoliasearch from 'algoliasearch/lite';
import instantsearch from 'instantsearch.js';
import { connectSearchBox } from 'instantsearch.js/es/connectors';
import {
  configure,
  hits,
  numericMenu,
  pagination,
  panel,
  refinementList,
  stats,
} from 'instantsearch.js/es/widgets';
import { formatDurationForHumans } from './duration';

const searchClient = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
);
const search = instantsearch({
  indexName: process.env.ALGOLIA_INDEX_MEMORIES,
  searchClient,
});

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
      header: 'Program Name',
    },
  })(refinementList)({
    container: '#program-name-list',
    attribute: 'programName',
    sortBy: ['name:asc'],
  }),
  panel({
    templates: {
      header: 'Speaker Country',
    },
  })(refinementList)({
    container: '#speaker-country-list',
    attribute: 'speakerCountry',
    sortBy: ['name:asc'],
  }),
  panel({
    templates: {
      header: 'Languages',
    },
  })(refinementList)({
    container: '#language-list',
    attribute: 'language',
    sortBy: ['name:asc'],
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
  hits({
    container: '#hits',
    templates: {
      item: document.getElementById('item-template').innerHTML,
      empty: '',
    },
    transformItems: (items) =>
      items.map((item) => ({
        ...item,
        idPadded: item.objectID.padStart(4, '0'),
        percentageRounded: Math.ceil(item.percentage * 20) * 5, // Rounding up to the next 5% step
        durationForHumans: formatDurationForHumans(item.duration),
      })),
  }),
  pagination({
    container: '#pagination',
  }),
]);

search.start();
