/*!
 * sri sri guru gaurangau jayatah
 */

import Alpine from 'alpinejs';

Alpine.data('searchResultItem', (fileId) => {
  const itemData = Alpine.store('search').lastResults.hits.find(
    // fileId has to be converted to string because the objectID is a string
    (hit) => hit.objectID === fileId.toString()
  );
  if (!itemData)
    throw new Error(`Cannot find search result item for ${fileId}`);

  return {
    fileId,
    isPlaying: Alpine.store('player').activeFileId === fileId,
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
    self: {
      [`@archive:player-status-${fileId}.window`]: 'onPlayerStatus',
    },
    playButton: {
      '@click': 'togglePlay',
    },
  };
});
