/*!
 * sri sri guru gaurangau jayatah
 */

import Alpine from 'alpinejs';

Alpine.data(
  'webshare',
  (/** @type {string} */ title, /** @type {string} */ pathName) => ({
    async triggerEvent() {
      let relUrl = typeof pathName !== 'undefined' ? pathName : '';
      let url = new URL(relUrl, location.origin).toString();
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
