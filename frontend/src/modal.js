/*!
 * sri sri guru gaurangau jayatah
 */

window.modalComponent = function () {
  return {
    open: false,
    init() {
      this.$watch('open', (value) =>
        // Preventing body from scrolling behind the overlay
        document.body.toggleAttribute('data-state-overlayed', value)
      );
    },
    show() {
      this.open = true;
    },

    close() {
      this.open = false;
    },
  };
};
