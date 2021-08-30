/*!
 * sri sri guru gaurangau jayatah
 */

window.collapsible = () => ({
  expanded: true,

  toggle() {
    this.expanded = !this.expanded;
  },

  self: {
    ':data-state-open': 'expanded',
  },
  header: {
    '@click': 'toggle',
  },
  contents: {
    'x-show': 'expanded',
    'x-transition:enter': 'transition motion-safe:ease-out duration-200',
    'x-transition:enter-start': 'opacity-0',
    'x-transition:enter-end': 'opacity-100',
  },
});
