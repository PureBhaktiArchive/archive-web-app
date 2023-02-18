/*!
 * sri sri guru gaurangau jayatah
 */

import Alpine from 'alpinejs';
import './player';

document.addEventListener('alpine:initialized', () => {
  let article = document.querySelector('#audio-page');
  /** type @{HTMLElement} */ // JSDoc types
  if (article instanceof HTMLElement) {
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
});
Alpine.start();
