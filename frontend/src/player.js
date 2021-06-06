/*!
 * sri sri guru gaurangau jayatah
 */

window.player = () => ({
  isOpen: false,
  isPlaying: false,
  /** @type {string} */ fileId: null,
  contentDetails: {
    /** @type {string} */ title: null,
    /** @type {string} */ date: null,
    /** @type {string} */ location: null,
    /** @type {string} */ category: null,
    /** @type {string[]} */ languages: null,
    /** @type {number} */ duration: null,
  },
  audio: new Audio(),

  get duration() {
    return Math.floor(
      // Duration of the audio can be NaN or +Infinity
      Number.isFinite(this.audio.duration)
        ? this.audio.duration
        : this.contentDetails.duration
    );
  },

  get durationForHumans() {
    const durationInSeconds = this.duration;

    if (!durationInSeconds) return '??:??';

    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const seconds = Math.floor(durationInSeconds % 60)
      .toString()
      .padStart(2, '0');
    return `${hours ? `${hours}:` : ''}${minutes}:${seconds}`;
  },

  init() {
    // Syncing state between the player and the search result item
    this.$watch('isPlaying', (value) =>
      this.dispatchEventToSearchResultItem(value)
    );

    this.audio.addEventListener(
      'durationchange',
      () => (this.contentDetails.duration = this.audio.duration)
    );

    this.audio.addEventListener('progress', () => this.displayBufferedAmount());
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
  loadFile({ detail: { fileId, contentDetails, shouldPlay } }) {
    if (fileId === this.fileId) {
      this.togglePlay(shouldPlay);
      return;
    }

    // Sending event to the previously played search result item
    if (this.fileId) this.isPlaying = false;

    this.fileId = fileId;
    this.contentDetails = contentDetails;
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

  displayBufferedAmount() {
    this.$refs.seekSlider.style.setProperty(
      '--buffered',
      Math.floor(this.audio.buffered.end(this.audio.buffered.length - 1)) /
        this.duration
    );
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
  seekSlider: {
    'x-bind:max': 'duration',
  },
});
