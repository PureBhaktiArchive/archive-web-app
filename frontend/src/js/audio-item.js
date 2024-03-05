/*!
 * sri sri guru gaurangau jayatah
 */

import Alpine from 'alpinejs';

Alpine.data('audioItem', (/** @type {number} */ fileId) => {
  return {
    fileId,
    // Detecting if the current file Id is being played at the moment
    isPlaying: Alpine.store('activeFileId') === fileId,
    /** @type {ContentDetails} */
    contentDetails: null,
    playerStatusListener: null,

    get playerStatusEventName() {
      return `archive:player-status-${this.fileId}`;
    },

    init() {
      this.contentDetails = JSON.parse(this.$root.dataset.contentDetails);

      // Saving the listener in order to remove it in the `destroy` method
      this.playerStatusListener =
        /** @param {CustomEvent<PlayerStatusEventDetail>} event */
        ({ detail: { isPlaying } }) => (this.isPlaying = isPlaying);

      window.addEventListener(
        this.playerStatusEventName,
        this.playerStatusListener
      );
    },

    destroy() {
      window.removeEventListener(
        this.playerStatusEventName,
        this.playerStatusListener
      );
    },

    togglePlay() {
      /**
       * Declaring a variable in order to enforce stricter object literal assignment checks
       * See {@link https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-6.html#stricter-object-literal-assignment-checks}
       * @type {PlayerToggleEventDetail}
       **/
      const detail = {
        fileId: this.fileId,
        shouldPlay: !this.isPlaying,
        contentDetails: this.contentDetails,
      };

      window.dispatchEvent(new CustomEvent('archive:toggle-play', { detail }));
    },
  };
});
