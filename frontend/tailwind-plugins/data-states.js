/*!
 * sri sri guru gaurangau jayatah
 */

/**
 * Plugin that adds variants for custom element states
 * which are based on the presence of `data-` attributes.
 *
 * For example: `<div data-state-open></div>` will have state `open`,
 * and `open:block` will apply to such element.
 *
 * States are configured in the Tailwind config in the `dataStates` key:
 *
 * ```
 * {
 * ...
 *   dataStates: ['open', 'overlayed'],
 * ...
 * }
 * ```
 */
module.exports = function ({ addVariant, e, config }) {
  const states = config('dataStates');

  states.forEach((state) => {
    const dataAttribute = `data-state-${state}`;

    addVariant(state, ({ modifySelectors, separator }) => {
      modifySelectors(
        ({ className }) =>
          `.${e(`${state}${separator}${className}`)}[${dataAttribute}]`
      );
    });
    addVariant(`within-${state}`, ({ modifySelectors, separator }) => {
      modifySelectors(
        ({ className }) =>
          `[${dataAttribute}] .${e(`within-${state}${separator}${className}`)}`
      );
    });
  });
};
