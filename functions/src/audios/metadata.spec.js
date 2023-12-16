/*!
 * sri sri guru gaurangau jayatah
 */

import { composeFileName, composeMediaMetadata } from './metadata.js';

/** @typedef {import('./content-details.js').ContentDetails} ContentDetails */

describe('File', () => {
  it.each`
    id   | date            | timeOfDay | languages               | title                        | location       | filename
    ${1} | ${'1998-06-22'} | ${'AM'}   | ${['English']}          | ${'Deep moods of Gopi Gita'} | ${'Badger'}    | ${'1998-06-22 AM ENG — Deep moods of Gopi Gita, Badger (#0001).mp3'}
    ${2} | ${'2000-11'}    | ${null}   | ${['English', 'Hindi']} | ${'Kartika Mahima'}          | ${'Vrindavan'} | ${'2000-11 HIN,ENG — Kartika Mahima, Vrindavan (#0002).mp3'}
    ${3} | ${'1991'}       | ${null}   | ${['Hindi']}            | ${'Ragavartma Candrika'}     | ${'Mathura'}   | ${'1991 HIN — Ragavartma Candrika, Mathura (#0003).mp3'}
    ${4} | ${null}         | ${null}   | ${['English']}          | ${'Another lecture'}         | ${null}        | ${'UNDATED ENG — Another lecture (#0004).mp3'}
  `(
    '$id should have file name "$filename"',
    ({ id, date, timeOfDay, languages, title, location, filename }) => {
      /** @type {ContentDetails} */
      const contentDetails = {
        date,
        timeOfDay,
        dateUncertain: false,
        languages,
        title,
        location,
        locationUncertain: false,
        topics: '',
        category: '',
        percentage: 1,
        soundQualityRating: 'Good',
      };

      expect(composeFileName(id, contentDetails)).toBe(filename);
    }
  );

  it.each`
    id     | date            | title
    ${'1'} | ${'1998-06-22'} | ${'Deep moods of Gopi Gita'}
    ${'2'} | ${'2000-11'}    | ${'Kartika Mahima'}
    ${'3'} | ${'1991'}       | ${'Ragavartma Candrika'}
    ${'4'} | ${null}         | ${'Another lecture'}
  `('$id should have proper metadata', ({ id, date, title }) => {
    /** @type {ContentDetails} */
    const contentDetails = {
      date,
      dateUncertain: false,
      timeOfDay: '',
      languages: [],
      title,
      location: '',
      locationUncertain: false,
      topics: '',
      category: '',
      percentage: 1,
      soundQualityRating: 'Good',
    };

    expect(composeMediaMetadata(id, contentDetails)).toEqual({
      'BVNM Archive ID': String(id),
      title: title,
      date: date?.substr(0, 4),
    });
  });
});
