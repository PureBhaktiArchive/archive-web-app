/*!
 * sri sri guru gaurangau jayatah
 */

import { Howl } from 'howler';

window.player = () => ({
  isOpen: false,
  isPlaying: false,
  /** @type {string} */ fileId: null,
  metadata: {
    /** @type {string} */ title: null,
    /** @type {string} */ date: null,
    /** @type {string} */ location: null,
    /** @type {string} */ category: null,
    /** @type {string[]} */ languages: null,
  },
  /** @type {Howl} */ howl: null,

  init() {
    // Syncing state between the player and the search result item
    this.$watch('isPlaying', (value) =>
      this.dispatchEventToSearchResultItem(value)
    );
  },

  dispatchEventToSearchResultItem(value) {
    window.dispatchEvent(
      new CustomEvent(`archive:toggle-play-${this.fileId}`, {
        detail: { isPlaying: value },
      })
    );
  },

  /**
   * Handles `archive:toggle-play` event from the search result item
   * @param {CustomEvent} $event
   */
  loadFile({ detail: { fileId, metadata, shouldPlay } }) {
    if (fileId === this.fileId) {
      this.togglePlay(shouldPlay);
      return;
    }

    if (this.howl) {
      this.isPlaying = false;
      this.howl.unload();
    }

    this.fileId = fileId;
    this.metadata = metadata;
    this.isOpen = true;
    this.isPlaying = shouldPlay;
    this.howl = new Howl({
      src: `https://${process.env.STORAGE_BUCKET}.storage.googleapis.com/${fileId}.mp3`,
      html5: true,
      autoplay: shouldPlay,
      onend: () => (this.isPlaying = false),
      // TODO: handle load error and add loading indication
    })
      .on('load', () => console.log('Loaded', fileId))
      .on('stop', () => console.log('Stopped', fileId))
      .on('end', () => console.log('Ended', fileId))
      .on('play', () => console.log('Playing', fileId))
      .on('pause', () => console.log('Paused', fileId));
  },

  /**
   * Toggles the playing state, or sets it to the passed value
   * @param {boolean} value Optional state: playing or not
   */
  togglePlay(value) {
    if (!this.howl) return;

    this.isPlaying = value || !this.isPlaying;
    if (this.isPlaying) this.howl.play();
    else this.howl.pause();
  },

  // For x-spread
  self: {
    'x-show.transition': 'isOpen',
    '@archive:toggle-play.window': 'loadFile',
  },
  playButton: {
    '@click': 'togglePlay()',
  },
  backwardButton: {},
  forwardButton: {},
});
