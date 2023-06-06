/*!
 * sri sri guru gaurangau jayatah
 */

import Alpine from 'alpinejs';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

/**
 * @typedef {Object} WebshareComponent
 * @property {string} url
 * @property {string} title
 */

Alpine.data(
  'webshare',
  /**
   * This component can be statically initialized using the paramters.
   * Alternatively it gets title and url dynamically from the `data` atributes.
   * This allows for changing these values dynamically from outside the component, i.e. in the audio player.
   * @param {string} title
   * @param {string} url
   * @returns {import('alpinejs').AlpineComponent<WebshareComponent>}
   */
  (title, url) => ({
    title,
    url,

    async share() {
      const absoluteUrl = new URL(
        this.url ?? this.$el.dataset.webshareUrl,
        window.location.href
      ).href;

      // Using Web Share API if it's supported, otherwise resorting to copying to clipboard and showing a notification
      if (navigator.share)
        await navigator.share({
          title: this.title ?? this.$el.dataset.webshareTitle,
          url: absoluteUrl,
        });
      else {
        await navigator.clipboard.writeText(absoluteUrl);
        const tippyElement =
          /** @type {import('tippy.js').ReferenceElement} */ (this.$el);
        // Creating a tippy instance if it's not created yet
        (tippyElement._tippy ?? tippy(this.$el)).show();
      }
    },

    // `self` can cause issues, see https://github.com/alpinejs/alpine/discussions/3603
    root: {
      '@click.prevent': 'share',
    },
  })
);
