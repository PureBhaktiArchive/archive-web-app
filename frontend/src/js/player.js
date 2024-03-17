/*!
 * sri sri guru gaurangau jayatah
 */

import Alpine from 'alpinejs';
import { formatDurationForHumans } from './duration';

/**
 * Audio player component
 * It can be pre-populated with a file ID and content details using appropriate data attributes
 * Decalring this intermediate function to avoid type inference as Record<string, any>
 * @param {AudioRecord | AudioRecord[]} records
 */
const player = (records) => ({
  isSeeking: false,
  currentTime: 0,
  volume: 0,
  /** @type {number} */
  previousVolume: null,

  audio: new Audio(),

  get store() {
    return Alpine.store('player');
  },

  /**
   * This getter is used in the template for convenience
   */
  get record() {
    return this.store.current;
  },

  get downloadURL() {
    return `${import.meta.env.STORAGE_BASE_URL}/${
      this.store.current?.fileId
    }.mp3`;
  },

  get feedbackURL() {
    return import.meta.env.FEEDBACK_FORM_AUDIOS + this.store.current?.fileId;
  },

  get durationForHumans() {
    return this.store.current?.duration !== undefined
      ? formatDurationForHumans(this.store.current.duration)
      : '?';
  },

  get currentTimeForHumans() {
    return formatDurationForHumans(
      this.currentTime,
      this.store.current.duration
    );
  },

  init() {
    // As WebKit browsers do not provide any pseudo-element for range progress,
    // we have to use the ::before pseudo-element to improvise the progress.
    this.$watch('currentTime', () => {
      this.$refs.seekSlider.style.setProperty(
        '--progress',
        (this.currentTime / this.store.current.duration).toString()
      );
    });
    this.$watch('volume', (/** @type {Number} */ value) => {
      this.audio.volume = value;
      this.$refs.volumeSlider.style.setProperty('--progress', this.volume);
    });

    this.audio.addEventListener('durationchange', () => {
      if (Number.isFinite(this.audio.duration))
        this.store.current.duration = this.audio.duration;
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
      const index = this.store.list.findIndex(
        (x) => x.fileId === this.store.current.fileId
      );
      if (index >= 0 && index < this.store.list.length - 1)
        this.store.current = this.store.list.at(index + 1);
      else this.store.isPlaying = false;
    });

    // Triggering all updates for the volume slider
    this.$nextTick(() => (this.volume = 1));

    if (records && typeof records === 'object')
      // Coalescing a single value to an array
      this.store.list = records instanceof Array ? records : [records];

    if (this.store.list.length === 1)
      this.$nextTick(() => void (this.store.current = this.store.list.at(0)));

    // Loading a new audio on the record change
    this.$watch('store.current?.fileId', () => {
      if (!this.store.current) {
        this.store.isPlaying = false;
        // This is to prevent further events from the audio object
        delete this.audio.src;
        return;
      }

      this.audio.src = this.downloadURL;
      // After changing `src`, the playback does not continue, so we need to trigger it explicitly
      if (this.store.isPlaying) this.audio.play();
    });

    this.$watch('store.isPlaying', () => {
      if (!this.store.current) return;
      if (this.store.isPlaying) this.audio.play();
      else this.audio.pause();
    });
  },

  /**
   * Toggles the playing state from the play button
   */
  togglePlay() {
    if (!this.store.current) return;
    this.store.isPlaying = !this.store.isPlaying;
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
Alpine.store('player', {
  list: [],
  current: null,
  isPlaying: false,
});
