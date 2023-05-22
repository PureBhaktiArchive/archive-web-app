/*!
 * sri sri guru gaurangau jayatah
 */

import Alpine from 'alpinejs';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

Alpine.start();

// Only in development according to https://vitejs.dev/guide/env-and-mode.html#env-variables
if (import.meta.env.DEV) {
  // Making devtools detect Alpine on the page: https://github.com/alpine-collective/alpinejs-devtools/issues/327
  window['Alpine'] = Alpine;
}

tippy('[data-tippy-content]');
