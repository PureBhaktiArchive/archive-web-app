/*!
 * sri sri guru gaurangau jayatah
 */

const hide = (element) => {
  element.style.display = 'none';
};

const show = (element, display = 'block') => {
  element.style.display = display;
};

export const dom = {
  loading: document.getElementById('loading'),
  searchError: document.getElementById('search-error'),
  searchErrorMessage: document.getElementById('search-error-message'),
  filterPanel: document.getElementById('filter-panel'),
  stats: document.getElementById('stats'),
  hits: document.getElementById('hits'),
  pagination: document.getElementById('pagination'),
  underProgress: document.getElementById('under-progress'),
  hide,
  show,
};

export const restoreSearchWidgets = () => {
  show(dom.loading);
  show(dom.filterPanel);
  hide(dom.stats);
  show(dom.hits);
  show(dom.underProgress);
  show(dom.pagination);
  hide(dom.searchError);
};
