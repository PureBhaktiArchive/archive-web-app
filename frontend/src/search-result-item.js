/*!
 * sri sri guru gaurangau jayatah
 */

window.searchResultItem = (fileId) => {
  // TODO: fetch metadata from Algolia helper
  // TODO: fetch isPlaying property from the player
  return {
    fileId,
    isPlaying: false,
    contentDetails: {
      /** @type {string} */ title: 'Title',
      /** @type {string} */ date: 'Date',
      /** @type {string} */ location: 'Location',
      /** @type {string} */ category: 'Category',
      /** @type {string[]} */ languages: ['English', 'Hindi'],
      /** @type {number} */ duration: null,
    },

    togglePlay() {
      window.dispatchEvent(
        new CustomEvent('archive:toggle-play', {
          detail: {
            fileId: this.fileId,
            shouldPlay: !this.isPlaying,
            contentDetails: { ...this.contentDetails },
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
