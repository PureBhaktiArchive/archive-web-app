/*!
 * sri sri guru gaurangau jayatah
 */

import Alpine from 'alpinejs';
import { formatDurationForHumans } from './duration';

/**
 * Audio player component
 * It can be pre-populated with a file ID and content details using appropriate data attributes
 * Decalring this intermediate function to avoid type inference as Record<string, any>
 * @param {AudioRecord} record
 */
const player = (record) => ({
  isOpen: false,
  isPlaying: false,
  isSeeking: false,
  duration: 0,
  currentTime: 0,
  volume: 0,
  /** @type {number} */
  previousVolume: null,

  /** @type {AudioRecord} */
  record: null,
  audio: new Audio(),

  get downloadURL() {
    return `${import.meta.env.STORAGE_BASE_URL}/${this.record?.fileId}.mp3`;
  },

  get feedbackURL() {
    return import.meta.env.FEEDBACK_FORM_AUDIOS + this.record?.fileId;
  },

  get durationForHumans() {
    return this.duration !== undefined
      ? formatDurationForHumans(this.duration)
      : '?';
  },

  get currentTimeForHumans() {
    return formatDurationForHumans(this.currentTime, this.duration);
  },

  init() {
    this.$watch('isPlaying', (value) => {
      // Storing the currently played file id in the global store for audio items
      // Cannot use null for single-value stores: https://github.com/alpinejs/alpine/discussions/3204
      Alpine.store('activeFileId', value ? this.record.fileId : NaN);
    });

    // As WebKit browsers do not provide any pseudo-element for range progress,
    // we have to use the ::before pseudo-element to improvise the progress.
    this.$watch('currentTime', () => {
      this.$refs.seekSlider.style.setProperty(
        '--progress',
        (this.currentTime / this.duration).toString()
      );
    });
    this.$watch('volume', (/** @type {Number} */ value) => {
      this.audio.volume = value;
      this.$refs.volumeSlider.style.setProperty('--progress', this.volume);
    });

    this.audio.addEventListener('durationchange', () => {
      if (Number.isFinite(this.audio.duration))
        this.duration = this.audio.duration;
    });

    this.audio.addEventListener('progress', () => {
      this.$refs.seekSlider.style.setProperty(
        '--buffered',
        // Finding the last buffered range which begins before the current time
        (
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
        ).toString()
      );
    });

    this.audio.addEventListener('timeupdate', () => {
      if (this.isSeeking) return;
      this.currentTime = this.audio.currentTime;
    });

    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
    });

    // Triggering all updates for the volume slider
    this.$nextTick(() => (this.volume = 1));

    // These values can be pre-rendered in the HTML in case of static pages
    // Initializing the player with these values
    if (record) this.loadFile(record, false);

    window.addEventListener(
      'archive:toggle-play',
      /**
       * Handles `archive:toggle-play` event from audio items on the page
       * @param {CustomEvent<PlayerToggleEventDetail>} $event
       */
      ({ detail: { record, shouldPlay } }) => this.loadFile(record, shouldPlay)
    );
  },

  /**
   * Loads a new file into the player
   * @param {AudioRecord} record Audio record details to initialise the UI
   * @param {boolean} [shouldPlay] Whether to start playback or not
   * @returns {void}
   */
  loadFile(record, shouldPlay) {
    if (record.fileId === this.record?.fileId) {
      this.togglePlay(shouldPlay);
      return;
    }

    // Turning off playback to send event to the previously played audio item
    if (this.record && this.isPlaying) this.togglePlay(false);

    this.record = record;
    this.duration = record.duration;
    this.isOpen = true;

    this.audio.src = this.downloadURL;
    // After changing `src`, the playback does not continue, so we need to trigger it explicitly
    this.togglePlay(shouldPlay);
  },

  /**
   * Toggles the playing state, or sets it to the passed value
   * @param {boolean} value Optional state: playing or not
   */
  togglePlay(value) {
    if (!this.record) return;

    value = value ?? !this.isPlaying;
    if (value === this.isPlaying) return;

    this.isPlaying = value;
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
   * @param {Event & { currentTarget: HTMLElement }} e
   */
  seekRelative(e) {
    const element = e.currentTarget;
    this.audio.currentTime += +element.dataset.seekAmount;
  },

  /**
   * @param {InputEvent & { target: HTMLInputElement }} e
   */
  setVolume(e) {
    this.volume = +e.target.value / +e.target.max;
  },

  commitVolume() {
    if (this.volume > 0) this.previousVolume = this.volume;
  },

  toggleMute() {
    if (this.volume > 0) this.volume = 0;
    else this.volume = this.previousVolume || 1;
  },

  get isMuted() {
    return !(this.volume > 0);
  },
});

Alpine.data('player', player);
