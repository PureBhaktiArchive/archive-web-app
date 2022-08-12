/*!
 * sri sri guru gaurangau jayatah
 */

import { connectSearchBox } from 'instantsearch.js/es/connectors';

export const searchBar = connectSearchBox((renderOptions, isFirstRender) => {
  const { query, refine, widgetParams } = renderOptions;

  if (isFirstRender) {
    const input = widgetParams.container.querySelector('input');
    input.addEventListener('input', (event) => {
      refine(event.target.value);
    });
    input.value = query;
  }
});
