/*!
 * sri sri guru gaurangau jayatah
 */

import Alpine from 'alpinejs';

Alpine.store(
  'search',
  /**
   * The type for the search store is decalared in the `types.ts` file.
   */
  {
    // This property is used to hide elements on empty search
    isEmpty: true,
  }
);

/**
 * Checks if the UI State is empty, i.e. without a query or any filtering
 * @param {import('instantsearch.js/es').UiState} uiState
 */
const isEmptySearch = (uiState) =>
  Object.entries(uiState).every(
    ([, indexState]) => !indexState.query && !indexState.refinementList
  );

/**
 * @type {import('instantsearch.js/es').Middleware}
 */
export const alpineSearchStoreMiddleware = () => ({
  onStateChange: ({ uiState }) => {
    Alpine.store('search').isEmpty = isEmptySearch(uiState);
  },
});
