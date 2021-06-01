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
    this.$watch('isPlaying', (value) => {
      // Dispatching event to the search result
      window.dispatchEvent(
        new CustomEvent(`archive:toggle-play-${this.fileId}`, {
          detail: { isPlaying: value },
        })
      );
    });
  },

  /**
   * Handles `archive:toggle-play` event from the search result item
   * @param {CustomEvent} $event
   */
  loadFile({ detail: item }) {
    if (item.fileId === this.fileId) {
      this.togglePlay();
      return;
    }

    this.fileId = item.fileId;
    this.metadata = item.metadata;
    this.isOpen = true;

    if (this.howl) this.howl.unload();

    this.howl = new Howl({
      src: `https://${process.env.STORAGE_BUCKET}.storage.googleapis.com/${this.fileId}.mp3`,
      html5: true,
      autoplay: true,
      onplay: () => {
        this.isPlaying = true;
      },
      onpause: () => (this.isPlaying = false),
      onstop: () => (this.isPlaying = false),
      onend: () => (this.isPlaying = false),
      // TODO: handle load error and add loading indication
    });
  },

  togglePlay() {
    if (!this.howl) return;

    if (this.howl.playing()) this.howl.pause();
    else this.howl.play();
  },

  // For x-spread
  self: {
    'x-show.transition': 'isOpen',
    '@archive:toggle-play.window': 'loadFile',
  },
  playButton: {
    '@click': 'togglePlay',
  },
  backwardButton: {},
  forwardButton: {},
});
