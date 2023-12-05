/*!
 * sri sri guru gaurangau jayatah
 */

import { connectSearchBox } from 'instantsearch.js/es/connectors';

/**
 * @typedef {{container: Element}} WidgetParams
 */

/** @type {ReturnType<typeof connectSearchBox<WidgetParams>>} */
export const searchBox = connectSearchBox((renderOptions, isFirstRender) => {
  const { query, refine, widgetParams } = renderOptions;
  const searchBtn = document.getElementById('search-btn');
  const spinnerBtn = document.getElementById('spinner-btn');

  if (isFirstRender) {
    const input = widgetParams.container.querySelector('input');
    input.addEventListener('input', (event) => {
      refine(/** @type {HTMLInputElement } */ (event.target).value);
    });
    input.value = query;
  }

  // Using the `render` event, which is dispatched in all cases.
  renderOptions.instantSearchInstance.on('render', () => {
    spinnerBtn.classList.toggle(
      'hidden',
      renderOptions.instantSearchInstance.status !== 'stalled'
    );
    searchBtn.classList.toggle(
      'hidden',
      renderOptions.instantSearchInstance.status === 'stalled'
    );
  });
});
