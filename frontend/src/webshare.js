/*!
 * sri sri guru gaurangau jayatah
 */

import Alpine from 'alpinejs';
import tippy from 'tippy.js';

/**
 * @typedef {Object} WebshareComponent
 * @property {string} url
 * @property {string} title
 */

Alpine.data(
  'webshare',
  /**
   * @param {string} title
   * @param {string} url
   * @returns {import('alpinejs').AlpineComponent<WebshareComponent>}
   */
  (title, url) => ({
    title: title,
    url: new URL(url, window.location.href).toString(), // Making the url absolute

    async share() {
      // Using Web Share API if it's supported, otherwise resorting to copying to clipboard and showing notification
      if (navigator.share)
        await navigator.share({ title: this.title, url: this.url });
      else {
        await navigator.clipboard.writeText(this.url);
        const tippyElement =
          /** @type {import('tippy.js').ReferenceElement} */ (this.$el);
        // Creating a tippy instance if it's not created yet
        (tippyElement._tippy ?? tippy(this.$el)).show();
      }
    },

    self: {
      '@click': 'share',
    },
  })
);
