/*!
 * sri sri guru gaurangau jayatah
 */

import Alpine from 'alpinejs';
import './player';

Alpine.start();
//Alpine.on('initialized')

let article = document.querySelector('#audio-page');

/** type @{HTMLElement} */ // JSDoc types
if (article instanceof HTMLElement) {
  //let languages = JSON.parse(article.dataset.languages);
  //}

  //if (languages instanceof Array);
  //let languageJson = article.dataset.languages;
  //let langarry = JSON.parse(languageJson);
  //console.log(langarry);

  window.dispatchEvent(
    new CustomEvent('archive:toggle-play', {
      detail: {
        fileId: article.dataset.audioNumber,
        shouldPlay: false,
        contentDetails: {
          title: article.dataset.audioTitle,
          dateForHumans: article.dataset.dateforhumans,
          dateUncertain: article.dataset.dateuncertain,
          location: article.dataset.location,
          locationUncertain: article.dataset.locationuncertain,
          category: article.dataset.category,
          languages: JSON.parse(article.dataset.languages),
          duration: article.dataset.duration,
        },
      },
    })
  );
}
