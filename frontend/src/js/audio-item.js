/*!
 * sri sri guru gaurangau jayatah
 */

import Alpine from 'alpinejs';

Alpine.data(
  'audioItem',
  /**
   * An audio item component.
   * @param {PlayerItem} record
   */
  (record) => ({
    record,

    get player() {
      return Alpine.store('player');
    },

    // Detecting if the current file Id is being played at the moment
    get isPlaying() {
      return (
        this.player.current?.fileId === this.record.fileId &&
        this.player.isPlaying
      );
    },

    togglePlay() {
      // Saving the current state because it can change when we set the curent record
      const currentValue = this.isPlaying;
      this.player.current = this.record;
      this.player.isPlaying = !currentValue;
    },
  })
);

/**
 *
 * @param {AudioRecord} record
 * @returns {PlayerItem}
 */
export const toPlayerItem = ({
  fileId,
  title,
  dateForHumans,
  dateUncertain,
  timeOfDay,
  location,
  locationUncertain,
  category,
  percentage,
  soundQualityRating,
  languages,
  otherSpeakers,
  duration,
}) => ({
  fileId,
  title,
  dateForHumans,
  dateUncertain,
  timeOfDay,
  location,
  locationUncertain,
  category,
  percentage,
  soundQualityRating,
  languages,
  otherSpeakers,
  duration,
});
