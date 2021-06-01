/*!
 * sri sri guru gaurangau jayatah
 */

window.searchResultItem = (fileId) => {
  // TODO: fetch metadata from Algolia helper
  return {
    fileId,
    playing: false,
    metadata: {
      /** @type {string} */ title: 'Title',
      /** @type {string} */ date: 'Date',
      /** @type {string} */ location: 'Location',
      /** @type {string} */ category: 'Category',
      /** @type {string[]} */ languages: ['English', 'Hindi'],
    },

    togglePlay($dispatch) {
      $dispatch('archive:toggle-play', {
        fileId: this.fileId,
        playing: this.playing,
        metadata: { ...this.metadata },
      });
    },

    playButton: {
      '@click': 'togglePlay($dispatch)',
    },
  };
};
