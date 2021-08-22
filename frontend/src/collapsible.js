/*!
 * sri sri guru gaurangau jayatah
 */

window.collapsible = () => {
  return {
    expanded: false,

    toggle() {
      this.expanded = !this.expanded;
    },
    header: {
      '@click': 'toggle',
    },
    contents: {
      'x-show': 'expanded',
    },
  };
};
