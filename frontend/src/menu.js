/*!
 * sri sri guru gaurangau jayatah
 */

import tippy from 'tippy.js';

document
  .querySelectorAll('[data-menu-toggle]')
  .forEach(
    (toggle) =>
      (toggle.onclick = () =>
        document
          .querySelectorAll('[data-menu-toggled]')
          .forEach((target) => target.classList.toggle('hidden')))
  );

tippy('[data-tippy-content]');
