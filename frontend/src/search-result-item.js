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

  // TODO: fetch isPlaying property from the player
  return {
    fileId,
    isPlaying: false,
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

    // For `x-spread`
    self: {
      [`@archive:toggle-play-${fileId}.window`]: 'onTogglePlay',
    },
    playButton: {
      '@click': 'togglePlay',
    },
  };
};
