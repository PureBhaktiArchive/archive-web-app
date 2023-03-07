/*!
 * sri sri guru gaurangau jayatah
 */

import Alpine from 'alpinejs';
import './player';
import './webshare';

document.addEventListener('alpine:initialized', () => {
  let article = document.querySelector('#audio-page');
  if (!(article instanceof HTMLElement)) return;

  window.dispatchEvent(
    new CustomEvent('archive:toggle-play', {
      detail: {
        fileId: article.dataset.audioNumber,
        shouldPlay: false,
        contentDetails: {
          title: article.dataset.audioTitle,
          dateForHumans: article.dataset.dateForHumans,
          dateUncertain: article.dataset.dateUncertain,
          location: article.dataset.location,
          locationUncertain: article.dataset.locationUncertain,
          category: article.dataset.category,
          languages: JSON.parse(article.dataset.languages),
          duration: article.dataset.duration,
        },
      },
    })
  );
});
Alpine.start();
