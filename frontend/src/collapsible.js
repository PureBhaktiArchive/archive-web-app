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
    'x-show.transition.opacity.duration.200ms': 'expanded',
  },
});
