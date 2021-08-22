/*!
 * sri sri guru gaurangau jayatah
 */

window.collapsible = () => {
  return {
    expanded: false,

    toggle() {
      this.expanded = !this.expanded;
    },
    itemsList: {
      'x-show'() {
        return this.expanded;
      },
      searchHeader: {
        '@click': 'toggle',
      },
    },
  };
};
