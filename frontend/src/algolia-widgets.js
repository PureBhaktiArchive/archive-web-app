/*!
 * sri sri guru gaurangau jayatah
 */

import { connectInfiniteHits } from 'instantsearch.js/es/connectors';
import Hogan from 'hogan.js';
import { dom } from './dom-utils';
import { TempStorage } from './temp-storage';

export class AlgoliaWidgets {
  get appInfiniteHits() {
    const renderInfiniteHits = (renderOptions) => {
      const { hits } = renderOptions;
      const container = document.getElementById('hits');
      let itemTemplate =
        TempStorage.cachedItemTemplate ||
        document.getElementById('item-template');

      TempStorage.cachedItemTemplate = itemTemplate;

      const itemTemplateString = itemTemplate.cloneNode(true).innerHTML;
      const template = Hogan.compile(itemTemplateString);
      container.innerHTML = hits
        .map((hit) => {
          return template.render(hit);
        })
        .join('');

      dom.hide(dom.loading);

      if (!TempStorage.searchError) {
        dom.show(dom.stats);
        dom.show(dom.underProgress);
      } else {
        dom.hide(dom.stats);
        dom.hide(dom.underProgress);
        dom.hide(dom.filterPanel);
        dom.hide(dom.stats);
        dom.hide(dom.hits);
        dom.hide(dom.underProgress);
        dom.hide(dom.pagination);
        dom.show(dom.searchError);
        dom.searchErrorMessage.innerText = TempStorage.searchError.message;
      }
    };

    return connectInfiniteHits(renderInfiniteHits);
  }
}
