/*!
 * sri sri guru gaurangau jayatah
 */

import { Howl } from 'howler';

class Player {
  constructor() {
    /** @type {Map<string, Howl>} */
    this.sounds = new Map();
    /** @type {string} */
    this.fileId = null;
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

  /**
   * Gets a cached howl object from the cache or constructs a new one
   * @param {string} fileId File ID to get
   * @returns Howl object for the file ID
   */
  getSound(fileId) {
    if (this.sounds.has(fileId)) return this.sounds.get(fileId);

    const sound = new Howl({
      src: `https://${process.env.STORAGE_BUCKET}.storage.googleapis.com/${fileId}.mp3`,
      html5: true,
      autoplay: false,
      onplay: () => this.switchPlayButton(fileId, true),
      onpause: () => this.switchPlayButton(fileId, false),
      onstop: () => this.switchPlayButton(fileId, false),
      onend: () => this.switchPlayButton(fileId, false),
    });

    this.sounds.set(fileId, sound);

    return sound;
  }

  /**
   * Plays the provided file or resumes play of the current file
   * @param {string} fileId Optional file ID to play, plays the current file if not specified
   */
  play(fileId) {
    if (fileId) {
      if (fileId !== this.fileId) this.pause();
      this.fileId = fileId;
    }

    const sound = this.getSound(this.fileId);

    //       onplay: function () {
    //         // Display the duration.
    //         duration.innerHTML = self.formatTime(Math.round(sound.duration()));

    //         // Start upating the progress of the track.
    //         requestAnimationFrame(self.step.bind(self));

    //         // Start the wave animation if we have already loaded
    //         wave.container.style.display = 'block';
    //         bar.style.display = 'none';
    //         pauseBtn.style.display = 'block';
    //       },
    //       onload: function () {
    //         // Start the wave animation.
    //         wave.container.style.display = 'block';
    //         bar.style.display = 'none';
    //         loading.style.display = 'none';
    //       },
    //       onend: function () {
    //         // Stop the wave animation.
    //         wave.container.style.display = 'none';
    //         bar.style.display = 'block';
    //         self.skip('next');
    //       },
    //       onpause: function () {
    //         // Stop the wave animation.
    //         wave.container.style.display = 'none';
    //         bar.style.display = 'block';
    //       },
    //       onstop: function () {
    //         // Stop the wave animation.
    //         wave.container.style.display = 'none';
    //         bar.style.display = 'block';
    //       },
    //       onseek: function () {
    //         // Start upating the progress of the track.
    //         requestAnimationFrame(self.step.bind(self));
    //       },
    //     });
    //   }

    //   // Begin playing the sound.
    //   sound.play();

    //   // Update the track display.
    //   track.innerHTML = index + 1 + '. ' + data.title;

    //   // Show the pause button.
    //   if (sound.state() === 'loaded') {
    //     playBtn.style.display = 'none';
    //     pauseBtn.style.display = 'block';
    //   } else {
    //     loading.style.display = 'block';
    //     playBtn.style.display = 'none';
    //     pauseBtn.style.display = 'none';
    //   }

    //   // Keep track of the index we are currently playing.
    //   self.index = index;
  }
  /**
   * Pause the currently playing track.
   */
  pause() {
    // var self = this;
    // // Get the Howl we want to manipulate.
    // var sound = self.playlist[self.index].howl;
    // // Puase the sound.
    // sound.pause();
    // // Show the play button.
    // playBtn.style.display = 'block';
    // pauseBtn.style.display = 'none';
  }

  /**
   * Skip to a specific track based on its playlist index.
   * @param  {Number} index Index in the playlist.
   */
  // skipTo(index) {
  // var self = this;
  // // Stop the current track.
  // if (self.playlist[self.index].howl) {
  //   self.playlist[self.index].howl.stop();
  // }
  // // Reset progress.
  // progress.style.width = '0%';
  // // Play the new track.
  // self.play(index);
  // }
  /**
   * Set the volume and update the volume slider display.
   * @param  {Number} val Volume between 0 and 1.
   */
  // volume(val) {
  // var self = this;
  // // Update the global volume (affecting all Howls).
  // Howler.volume(val);
  // // Update the display on the slider.
  // var barWidth = (val * 90) / 100;
  // barFull.style.width = barWidth * 100 + '%';
  // sliderBtn.style.left =
  //   window.innerWidth * barWidth + window.innerWidth * 0.05 - 25 + 'px';
  // }

  /**
   * Seek to a new position in the currently playing track.
   * @param  {Number} per Percentage through the song to skip.
   */
  // seek(per) {
  // var self = this;
  // // Get the Howl we want to manipulate.
  // var sound = self.playlist[self.index].howl;
  // // Convert the percent into a seek position.
  // if (sound.playing()) {
  //   sound.seek(sound.duration() * per);
  // }
  // }

  /**
   * The step called within requestAnimationFrame to update the playback position.
   */
  step() {
    // var self = this;
    // // Get the Howl we want to manipulate.
    // var sound = self.playlist[self.index].howl;
    // // Determine our current seek position.
    // var seek = sound.seek() || 0;
    // timer.innerHTML = self.formatTime(Math.round(seek));
    // progress.style.width = ((seek / sound.duration()) * 100 || 0) + '%';
    // // If the sound is still playing, continue stepping.
    // if (sound.playing()) {
    //   requestAnimationFrame(self.step.bind(self));
    // }
  }
  /**
   * Toggle the volume display on/off.
   */
  toggleVolume() {
    // var self = this;
    // var display = volume.style.display === 'block' ? 'none' : 'block';
    // setTimeout(
    //   function () {
    //     volume.style.display = display;
    //   },
    //   display === 'block' ? 0 : 500
    // );
    // volume.className = display === 'block' ? 'fadein' : 'fadeout';
  }

  /**
   * Format the time from seconds to M:SS.
   * @param  {Number} secs Seconds to format.
   * @return {String}      Formatted time.
   */
  formatTime(secs) {
    var minutes = Math.floor(secs / 60) || 0;
    var seconds = secs - minutes * 60 || 0;

    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }
}

export const player = new Player();

// Bind our player controls.

document
  .getElementById('play-button')
  .addEventListener('click', () => player.play());

document
  .getElementById('pause-button')
  .addEventListener('click', () => player.pause());

// waveform.addEventListener('click', function (event) {
//   player.seek(event.clientX / window.innerWidth);
// });
// volumeBtn.addEventListener('click', function () {
//   player.toggleVolume();
// });
// volume.addEventListener('click', function () {
//   player.toggleVolume();
// });

// // Setup the event listeners to enable dragging of volume slider.
// barEmpty.addEventListener('click', function (event) {
//   var per = event.layerX / parseFloat(barEmpty.scrollWidth);
//   player.volume(per);
// });
// sliderBtn.addEventListener('mousedown', function () {
//   window.sliderDown = true;
// });
// sliderBtn.addEventListener('touchstart', function () {
//   window.sliderDown = true;
// });
// volume.addEventListener('mouseup', function () {
//   window.sliderDown = false;
// });
// volume.addEventListener('touchend', function () {
//   window.sliderDown = false;
// });

// var move = function (event) {
//   if (window.sliderDown) {
//     var x = event.clientX || event.touches[0].clientX;
//     var startX = window.innerWidth * 0.05;
//     var layerX = x - startX;
//     var per = Math.min(
//       1,
//       Math.max(0, layerX / parseFloat(barEmpty.scrollWidth))
//     );
//     player.volume(per);
//   }
// };

// volume.addEventListener('mousemove', move);
// volume.addEventListener('touchmove', move);

window.togglePlay = function (/** @type {HTMLButtonElement} */ button) {
  const fileId = button.closest('article').dataset.fileId;
  player.togglePlay(fileId);
};
