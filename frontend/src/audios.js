/*!
 * sri sri guru gaurangau jayatah
 */

import 'alpinejs';
import 'mdn-polyfills/Element.prototype.toggleAttribute';
import './algolia.css';
import './player';
import { search } from './search';
import './search-result-item';

search.start();

//TODO: Filter panel to be migrated to Alpine.js: https://trello.com/c/lesy1wNY/182-use-alpine-for-menu-and-filter-panel
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
