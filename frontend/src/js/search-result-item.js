/*!
 * sri sri guru gaurangau jayatah
 */

import Alpine from 'alpinejs';

/**
 * @typedef {import('./audio-record').AudioRecord} AudioRecord
 * @typedef {import('algoliasearch-helper').SearchResults<AudioRecord>} AudioSearchResults
 * @typedef {import('algoliasearch-helper').AlgoliaSearchHelper} AlgoliaSearchHelper
 */

Alpine.data('searchResultItem', (/** @type {number} */ fileId) => {
  const helper = /** @type {AlgoliaSearchHelper} */ (
    Alpine.store('searchHelper')
  );

  // Type cast is needed because the helper is not generic
  const itemData = /** @type {AudioSearchResults} */ (
    helper.lastResults
  ).hits.find((hit) => hit.fileId === fileId);
  if (!itemData)
    throw new Error(`Cannot find search result item for ${fileId}`);

  return {
    fileId,
    isPlaying: Alpine.store('activeFileId') === fileId,
    itemData,

    togglePlay() {
      window.dispatchEvent(
        new CustomEvent('archive:toggle-play', {
          detail: {
            fileId: this.fileId,
            shouldPlay: !this.isPlaying,
            contentDetails: {
              title: this.itemData.title,
              dateForHumans: this.itemData.dateForHumans,
              dateUncertain: this.itemData.dateUncertain,
              location: this.itemData.location,
              locationUncertain: this.itemData.locationUncertain,
              category: this.itemData.category,
              languages: this.itemData.languages,
              duration: this.itemData.duration,
            },
          },
        })
      );
    },

    onPlayerStatus({ detail: { isPlaying } }) {
      this.isPlaying = isPlaying;
    },

    // For `x-bind`
    // `self` causes issues, see https://github.com/alpinejs/alpine/discussions/3603
    root: {
      [`@archive:player-status-${fileId}.window`]: 'onPlayerStatus',
    },
    playButton: {
      '@click': 'togglePlay',
    },
  };
});
