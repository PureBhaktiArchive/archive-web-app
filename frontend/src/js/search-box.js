/*!
 * sri sri guru gaurangau jayatah
 */

import { connectSearchBox } from 'instantsearch.js/es/connectors';

/**
 * @typedef {{container: Element}} WidgetParams
 */

/** @type {ReturnType<typeof connectSearchBox<WidgetParams>>} */
export const searchBox = connectSearchBox((renderOptions, isFirstRender) => {
  const { query, refine, widgetParams, instantSearchInstance } = renderOptions;
  if (isFirstRender) {
    const input = widgetParams.container.querySelector('input');
    input.addEventListener('input', (event) =>
      event.target instanceof HTMLInputElement
        ? refine(event.target.value)
        : void 0
    );
    input.value = query;
  }

  const isStalled = instantSearchInstance.status === 'stalled';

  widgetParams.container
    .querySelector('button > :first-child') // The search label is the first child
    .classList.toggle('hidden', isStalled);
  widgetParams.container
    .querySelector('button > :not(:first-child)') // The loading indicator is the second child
    .classList.toggle('hidden', !isStalled);
});
