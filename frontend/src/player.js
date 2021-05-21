/*!
 * sri sri guru gaurangau jayatah
 */

import { Howl } from 'howler';

class Player {
  constructor() {
    /** @type {Map<string, Howl>} */
    this.sounds = new Map();
  }

  /**
   * Swaps play and pause buttons for a particular search result
   * @param {string} fileId File ID for which to swap the buttons
   * @param {boolean} state Current state of playback: `true` for playback, `false` for pause
   */
  switchPlayButton(fileId, state) {
    const iconsToHide = state ? 'play' : 'pause';
    const iconsToShow = state ? 'pause' : 'play';

    document
      .querySelectorAll(
        `article[data-file-id="${fileId}"] .${iconsToHide}-icon`
      )
      .forEach((element) => element.classList.add('hidden'));

    document
      .querySelectorAll(
        `article[data-file-id="${fileId}"] .${iconsToShow}-icon`
      )
      .forEach((element) => element.classList.remove('hidden'));
  }

  /**
   * Toggles playback of the specified file ID.
   * Stops other sound if any is playing.
   * @param {string} fileId File ID to toggle playback
   */
  togglePlay(fileId) {
    const sound = this.sounds.get(fileId);

    if (sound && sound.playing()) {
      sound.pause();
      return;
    }

    // Pausing all the sounds, hopefully the one that is playing now
    this.sounds.forEach((sound) => (sound.playing() ? sound.pause() : null));

    if (sound) sound.play();
    else
      this.sounds.set(
        fileId,
        new Howl({
          src: `https://${process.env.STORAGE_BUCKET}.storage.googleapis.com/${fileId}.mp3`,
          html5: true,
          autoplay: true,
        })
          .on('play', () => this.switchPlayButton(fileId, true))
          .on('pause', () => this.switchPlayButton(fileId, false))
          .on('stop', () => this.switchPlayButton(fileId, false))
          .once('end', () => this.switchPlayButton(fileId, false))
      );
    this.switchPlayButton(fileId, true);
  }

  get sound() {
    return this.sounds.get(this.fileId);
  }

  get isPlaying() {
    return this.sound && this.sound.playing();
  }
}

export const player = new Player();

window.togglePlay = function (/** @type {HTMLButtonElement} */ button) {
  const fileId = button.closest('article').dataset.fileId;
  player.togglePlay(fileId);
};
