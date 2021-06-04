/*!
 * sri sri guru gaurangau jayatah
 */

window.searchResultItem = (fileId) => {
  // TODO: fetch metadata from Algolia helper
  // TODO: fetch isPlaying property from the player
  return {
    fileId,
    isPlaying: false,
    metadata: {
      /** @type {string} */ title: 'Title',
      /** @type {string} */ date: 'Date',
      /** @type {string} */ location: 'Location',
      /** @type {string} */ category: 'Category',
      /** @type {string[]} */ languages: ['English', 'Hindi'],
    },

    togglePlay() {
      window.dispatchEvent(
        new CustomEvent('archive:toggle-play', {
          detail: {
            fileId: this.fileId,
            shouldPlay: !this.isPlaying,
            metadata: { ...this.metadata },
          },
        })
      );
    },

    onTogglePlay({ detail: { isPlaying } }) {
      this.isPlaying = isPlaying;
    },

    // For `x-spread`
    self: {
      [`@archive:toggle-play-${fileId}.window`]: 'onTogglePlay',
    },
    playButton: {
      '@click': 'togglePlay',
    },
  };
};
