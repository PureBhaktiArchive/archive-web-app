/*!
 * sri sri guru gaurangau jayatah
 */

window.collapsible = () => ({
  expanded: true,

  toggle() {
    this.expanded = !this.expanded;
  },
  header: {
    '@click': 'toggle',
  },
  contents: {
    'x-show': 'expanded',
    'x-transition:enter': 'transition ease-out duration-500',
    'x-transition:enter-start': 'opacity-0 transform scale-90',
    'x-transition:enter-end': 'opacity-100 transform scale-100',
  },
});
