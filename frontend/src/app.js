/*!
 * sri sri guru gaurangau jayatah
 */

import 'alpinejs';
import 'mdn-polyfills/Element.prototype.toggleAttribute';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import './algolia.css';
import './app.css';
import './modal';
import './player';
import { search } from './search';
import './search-result-item';

search.start();

document
  .querySelectorAll('[data-menu-toggle]')
  .forEach(
    (toggle) =>
      (toggle.onclick = () =>
        document
          .querySelectorAll('[data-menu-toggled]')
          .forEach((target) => target.classList.toggle('hidden')))
  );

const filterPanel = document.getElementById('filter-panel');
const backdrop = document.getElementById('backdrop');

const toggleFilter = (isOpen) => {
  filterPanel.toggleAttribute('data-state-open', isOpen);
  backdrop.toggleAttribute('data-state-open', isOpen);

  // Preventing body from scrolling behind the overlay
  document.body.toggleAttribute('data-state-overlayed', isOpen);
};

document.querySelectorAll('[data-filter-toggle]').forEach(
  (element) =>
    (element.onclick = () => {
      const isOpen = filterPanel.hasAttribute('data-state-open');
      toggleFilter(!isOpen);
    })
);

tippy('[data-tippy-content]');
