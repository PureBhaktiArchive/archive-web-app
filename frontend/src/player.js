/*!
 * sri sri guru gaurangau jayatah
 */

import { Howl } from 'howler';

window.player = () => ({
  open: false,
  /** @type {string} */ fileId: null,
  metadata: {
    /** @type {string} */ title: null,
    /** @type {string} */ date: null,
    /** @type {string} */ location: null,
    /** @type {string} */ category: null,
    /** @type {string[]} */ languages: null,
  },
  /** @type {Howl} */ howl: null,

  $dispatch: null,

  init() {
    this.$watch('fileId', () => this.changeFile());
  },

  changeFile() {
    console.log('Current file ID changed to', this.fileId);
    if (this.howl) {
      this.howl.stop();
      this.howl.unload();
    }

    this.howl = new Howl({
      src: `https://${process.env.STORAGE_BUCKET}.storage.googleapis.com/${this.fileId}.mp3`,
      html5: true,
      autoplay: true,
    });
    // .on('play', () => this.switchPlayButton(this.fileId, true))
    // .on('pause', () => this.switchPlayButton(this.fileId, false))
    // .on('stop', () => this.switchPlayButton(this.fileId, false))
    // .once('end', () => this.switchPlayButton(this.fileId, false))
  },

  togglePlay() {
    console.log('Toggled');
    if (!this.fileId) return;

    if (this.howl && this.howl.playing()) {
      this.pause();
      return;
    }

    this.open = true;
  },

  // For x-spread
  self: {
    'x-show.transition': 'open',
    '@archive:toggle-play.window'({ detail }) {
      this.fileId = detail.fileId;
      this.metadata = detail.metadata;
      this.open = true;
    },
  },
  playButton: {
    '@click': 'togglePlay($dispatch)',
  },
  backwardButton: {},
  forwardButton: {},
});
