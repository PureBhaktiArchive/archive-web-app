/*!
 * sri sri guru gaurangau jayatah
 */

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
  audio: new Audio(),

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

    // Sending event to the previously played search result item
    if (this.fileId && this.isPlaying) this.isPlaying = false;

    this.fileId = fileId;
    this.metadata = metadata;
    this.isOpen = true;
    this.isPlaying = shouldPlay;

    this.audio.src = `https://${process.env.STORAGE_BUCKET}.storage.googleapis.com/${fileId}.mp3`;
    if (shouldPlay) this.audio.play();
  },

  /**
   * Toggles the playing state, or sets it to the passed value
   * @param {boolean} value Optional state: playing or not
   */
  togglePlay(value) {
    if (!this.fileId) return;

    this.isPlaying = value || !this.isPlaying;
    if (this.isPlaying) this.audio.play();
    else this.audio.pause();
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
