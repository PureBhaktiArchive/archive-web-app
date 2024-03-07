/*!
 * sri sri guru gaurangau jayatah
 */

import Alpine from 'alpinejs';

Alpine.data('audioItem', () => {
  return {
    /** @type {AudioRecord} */
    record: null,

    // Detecting if the current file Id is being played at the moment
    get isPlaying() {
      return Alpine.store('activeFileId') === this.record.fileId;
    },

    init() {
      this.record = JSON.parse(this.$root.dataset.record);
    },

    togglePlay() {
      /**
       * Declaring a variable in order to enforce stricter object literal assignment checks
       * See {@link https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-6.html#stricter-object-literal-assignment-checks}
       * @type {PlayerToggleEventDetail}
       **/
      const detail = {
        record: this.record,
        shouldPlay: !this.isPlaying,
      };

      window.dispatchEvent(new CustomEvent('archive:toggle-play', { detail }));
    },
  };
});
