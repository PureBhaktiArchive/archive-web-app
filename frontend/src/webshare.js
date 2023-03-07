/*!
 * sri sri guru gaurangau jayatah
 */

import Alpine from 'alpinejs';

Alpine.data(
  'webshare',
  (/** @type {string} */ title, /** @type {string} */ url) => ({
    async triggerEvent() {
      if (navigator.share) {
        navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        /** @type {import('tippy.js').ReferenceElement} */ (
          this.$el
        )._tippy?.show();
      }
    },

    self: {
      '@click': 'triggerEvent',
    },
  })
);
