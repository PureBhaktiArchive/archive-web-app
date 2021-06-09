/*!
 * sri sri guru gaurangau jayatah
 */

window.player = () => ({
  isOpen: false,
  isPlaying: false,
  isSeeking: false,
  duration: 0,
  currentTime: 0,
  /** @type {string} */ fileId: null,
  contentDetails: {
    /** @type {string} */ title: null,
    /** @type {string} */ date: null,
    /** @type {string} */ location: null,
    /** @type {string} */ category: null,
    /** @type {string[]} */ languages: null,
  },
  audio: new Audio(),

  get durationForHumans() {
    return new Date(1000 * this.duration).toISOString().substr(11, 8);
  },

  get currentTimeForHumans() {
    return new Date(1000 * this.currentTime).toISOString().substr(11, 8);
  },

  init() {
    // Syncing state between the player and the search result item
    this.$watch('isPlaying', (value) =>
      this.dispatchEventToSearchResultItem(value)
    );

    // As WebKit browsers do not provide any pseudo-element for range progress,
    // we have to use the ::before pseudo-element to improvise the progress.
    this.$watch('currentTime', (value) => {
      this.$refs.seekSlider.style.setProperty(
        '--progress',
        value / this.duration
      );
    });

    this.audio.addEventListener('durationchange', () => {
      if (Number.isFinite(this.audio.duration))
        this.duration = this.audio.duration;
    });

    this.audio.addEventListener('progress', () => {
      this.$refs.seekSlider.style.setProperty(
        '--buffered',
        // Finding the last buffered range which begins before the current time
        [...Array(this.audio.buffered.length)]
          // Extracting buffered ranges as [start, end] couple to avoid depending on the original index
          .map((value, index) => [
            this.audio.buffered.start(index),
            this.audio.buffered.end(index),
          ])
          // Picking only those ranges which start before current time
          .filter(([start]) => start <= this.audio.currentTime)
          // Getting the end of the rightmost of such ranges, hopefully it is after the current time
          .map(([, end]) => end)
          .reduce((a, b) => Math.max(a, b), 0) / this.audio.duration
      );
    });

    this.audio.addEventListener('timeupdate', () => {
      if (this.isSeeking) return;
      this.currentTime = this.audio.currentTime;
    });

    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
    });
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
    this.duration = contentDetails.duration;
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

  /**
   * @param {InputEvent & { target: HTMLInputElement }} e
   */
  startSeeking(e) {
    // Disabling progress updates from the audio
    this.isSeeking = true;
    this.currentTime = +e.target.value;
  },

  /**
   * @param {InputEvent & { target: HTMLInputElement }} e
   */
  commitSeeking(e) {
    this.audio.currentTime = +e.target.value;
    // Enabling progress updates from the audio
    this.isSeeking = false;
  },

  /**
   * @param {Number} amount
   */
  seekRelative(amount) {
    this.audio.currentTime += amount;
  },

  // For x-spread
  self: {
    'x-show.transition': 'isOpen',
    '@archive:toggle-play.window': 'loadFile',
  },
  playButton: {
    '@click': 'togglePlay()',
  },
  backwardButton: {
    '@click': 'seekRelative(-30)',
  },
  forwardButton: {
    '@click': 'seekRelative(30)',
  },
  seekSlider: {
    ':max': 'duration',
    ':value': 'currentTime',
    '@input': 'startSeeking',
    '@change': 'commitSeeking',
  },
});
