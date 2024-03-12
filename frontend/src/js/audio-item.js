/*!
 * sri sri guru gaurangau jayatah
 */

import Alpine from 'alpinejs';

Alpine.data(
  'audioItem',
  /**
   * An audio item component.
   * @param {AudioRecord} record
   */
  (record) => ({
    /** @type {AudioRecord} */
    record,

    // Detecting if the current file Id is being played at the moment
    get isPlaying() {
      return Alpine.store('activeFileId') === this.record.fileId;
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
  })
);
