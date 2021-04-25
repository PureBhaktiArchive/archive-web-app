/*!
 * sri sri guru gaurangau jayatah
 */

import { Howl } from 'howler';

/** @type {Map<Number, Howl>} */
export const sounds = new Map();

function switchPlayButton(
  /** @type {Number} */ fileId,
  /** @type {Boolean} */ state
) {
  const iconsToHide = state ? 'play' : 'pause';
  const iconsToShow = state ? 'pause' : 'play';

  document
    .querySelectorAll(`article[data-file-id="${fileId}"] .${iconsToHide}-icon`)
    .forEach((element) => element.classList.add('hidden'));

  document
    .querySelectorAll(`article[data-file-id="${fileId}"] .${iconsToShow}-icon`)
    .forEach((element) => element.classList.remove('hidden'));
}

window.togglePlay = function (/** @type {HTMLButtonElement} */ button) {
  const fileId = button.closest('article').dataset.fileId;
  const sound = sounds.get(fileId);

  if (sound && sound.playing()) {
    sound.pause();
    return;
  }

  // Pausing all the sounds, hopefully the one that is playing now
  sounds.forEach((sound) => (sound.playing() ? sound.pause() : null));

  if (sound) sound.play();
  else
    sounds.set(
      fileId,
      new Howl({
        src: `https://${process.env.STORAGE_BUCKET}.storage.googleapis.com/${fileId}.mp3`,
        html5: true,
        autoplay: true,
      })
        .on('play', () => switchPlayButton(fileId, true))
        .on('pause', () => switchPlayButton(fileId, false))
        .on('stop', () => switchPlayButton(fileId, false))
        .once('end', () => switchPlayButton(fileId, false))
    );
  switchPlayButton(fileId, true);
};
