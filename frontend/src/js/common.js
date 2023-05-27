/*!
 * sri sri guru gaurangau jayatah
 */

import Alpine from 'alpinejs';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

// Defer `Alpine.start` to allow other code register the Alpine extensions
// Approach taken from https://github.com/alpinejs/alpine/discussions/1705#discussioncomment-976821
queueMicrotask(() => {
  Alpine.start();
});

// Only in development according to https://vitejs.dev/guide/env-and-mode.html#env-variables
if (import.meta.env.DEV) {
  // Making devtools detect Alpine on the page: https://github.com/alpine-collective/alpinejs-devtools/issues/327
  window['Alpine'] = Alpine;
}

tippy('[data-tippy-content]');
