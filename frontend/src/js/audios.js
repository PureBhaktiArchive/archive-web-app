/*!
 * sri sri guru gaurangau jayatah
 */

import algoliasearch from 'algoliasearch/lite';
// eslint-disable-next-line import/no-named-as-default -- See https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/69404
import Alpine from 'alpinejs';
import instantsearch from 'instantsearch.js/es';
import {
  configure,
  hits,
  numericMenu,
  pagination,
  refinementList,
  stats,
  toggleRefinement,
} from 'instantsearch.js/es/widgets';
import '../css/algolia.css';
import { alpineSearchStoreMiddleware } from './alpine-search-store';
import { toPlayerItem } from './audio-item';
import { itemTemplate } from './audio-search-result-item';
import './player';
import { searchBar } from './search-bar';
import { soundQualityRatingMapping } from './sound-quality-rating';
import './webshare';

const search = instantsearch({
  searchClient: algoliasearch(
    import.meta.env.ALGOLIA_APPLICATION_ID,
    import.meta.env.ALGOLIA_API_KEY
  ),
  indexName: import.meta.env.ALGOLIA_INDEX_AUDIOS,
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
          ? `${
              data.nbPages > 1
                ? `${data.page * data.hitsPerPage + 1}–${Math.min(
                    data.nbHits,
                    (data.page + 1) * data.hitsPerPage
                  )} of `
                : ''
            }${data.nbHits} results`
          : data.hasOneResult
            ? '1 result'
            : data.hasNoResults
              ? 'No results'
              : '',
    },
  }),
  // Loading indicator
  {
    $$type: 'Loading indicator',
    render: ({ status }) => {
      const isSearchStalled = status === 'stalled';
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
  refinementList({
    container: '#location-list div:empty',
    attribute: 'location',
    searchable: true,
    showMore: true,
    showMoreLimit: 50,
    sortBy: ['name:asc'],
  }),
  refinementList({
    container: '#language-list div:empty',
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
  refinementList({
    container: '#sound-quality-list div:empty',
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
  refinementList({
    container: '#category-list div:empty',
    attribute: 'category',
    sortBy: ['name:asc'],
  }),
  refinementList({
    container: '#year-list div:empty',
    attribute: 'year',
    limit: 100,
    sortBy: ['name:asc'],
  }),
  numericMenu({
    container: '#percentage-menu div:empty',
    attribute: 'percentage',
    items: [
      { label: 'Any' },
      { label: 'More than 50%', start: 0.5 },
      { label: 'More than 90%', start: 0.9 },
      { label: 'Only other guru-varga', end: 0 },
    ],
  }),
  numericMenu({
    container: '#duration-menu div:empty',
    attribute: 'duration',
    items: [
      { label: 'Any' },
      { label: 'Less than 15 minutes', end: 900 },
      { label: '15-45 minutes', start: 900, end: 2700 },
      { label: '45+ minutes', start: 2700 },
    ],
  }),
  refinementList({
    container: '#other-speakers-list div:empty',
    attribute: 'otherSpeakers',
    sortBy: ['name:asc'],
  }),
  toggleRefinement({
    container: '#transcript-toggle div:empty',
    attribute: 'transcriptPresent',
    templates: {
      labelText({ count }, { html }) {
        return html`<span
          >With a transcript only (${count?.toLocaleString()})</span
        >`;
      },
    },
  }),
  hits({
    container: '#hits',
    templates: {
      // Casting type because HitsTemplates is not generic in InstantSearch
      item: /** @type {import("instantsearch.js").TemplateWithBindEvent<import('instantsearch.js').Hit>} */ (
        itemTemplate
      ),
      empty: () => '',
    },
  }),
  pagination({
    container: '#pagination',
  }),
]);

search.use(alpineSearchStoreMiddleware);

/**
 * @typedef {import("instantsearch.js").Hit<AudioRecord>} AudioHit
 */

// Intercepting results according to https://github.com/algolia/instantsearch/issues/953
search.addWidgets([
  {
    $$type: 'Playlist manager',
    render:
      /**
       *
       * @param {{results: import("algoliasearch-helper").SearchResults<AudioHit>}} options
       */
      ({ results }) => {
        Alpine.store('player').list = results.hits.map(toPlayerItem);
      },
  },
]);
search.start();

Alpine.start();
