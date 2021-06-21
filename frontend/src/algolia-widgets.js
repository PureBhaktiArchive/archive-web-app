/*!
 * sri sri guru gaurangau jayatah
 */

import { connectInfiniteHits } from 'instantsearch.js/es/connectors'
import Hogan from 'hogan.js';
import { dom, itemTemplateString } from './dom-utils';

export class AlgoliaWidgets {

  static error = null;

  get appInfiniteHits() {
    const renderInfiniteHits = (renderOptions) => {
      const {hits} = renderOptions;
      const container = document.getElementById('hits');
      const template = Hogan.compile(itemTemplateString)
      container.innerHTML = hits.map((hit) => {
        return template.render(hit)
      }).join('')

      dom.hide(dom.loading)

      if (!AlgoliaWidgets.error) {
        dom.show(dom.stats);
        dom.show(dom.underProgress);
      } else {
        dom.hide(dom.stats);
        dom.hide(dom.underProgress);
        dom.hide(dom.filterPanel)
        dom.hide(dom.stats)
        dom.hide(dom.hits)
        dom.hide(dom.underProgress)
        dom.hide(dom.pagination)
        dom.show(dom.searchError)
        dom.searchError.innerHTML = `<span>Error occurred: <b> ${AlgoliaWidgets.error.message} </b> Please retry later, or <a class='text-blue-300' href='https://docs.google.com/forms/d/e/1FAIpQLSfjwP_n5uJPD-BxwE_Ta-tbaf2aWNWZqe-YOOoUzjcPw209Uw/viewform' target='_blank'>contact tech support</a>.</span>`
      }
    };

    return connectInfiniteHits(
      renderInfiniteHits
    );
  }
}
