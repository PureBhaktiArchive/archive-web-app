/*!
 * sri sri guru gaurangau jayatah
 */

import { search } from './search';

window.searchResultItem = (fileId) => {
  const itemData = search.helper.lastResults.hits.find(
    // fileId has to be converted to string because the objectID is a string
    (hit) => hit.objectID === fileId.toString()
  );
  if (!itemData)
    throw new Error(`Cannot find search result item for ${fileId}`);

  // Implemented using https://codewithhugo.com/alpinejs-inspect-component-data-from-js/
  // We'll have to use another approach in Alpine v3: https://github.com/alpinejs/alpine/discussions/1543#discussioncomment-887031
  const playerData = document.getElementById('player').__x.getUnobservedData();
  const isPlaying = playerData.isPlaying && playerData.fileId === fileId;

  return {
    fileId,
    isPlaying,
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

    onTogglePlay({ detail: { isPlaying } }) {
      this.isPlaying = isPlaying;
    },

    // For `x-bind`
    self: {
      [`@archive:toggle-play-${fileId}.window`]: 'onTogglePlay',
    },
    playButton: {
      '@click': 'togglePlay',
    },
  };
};
