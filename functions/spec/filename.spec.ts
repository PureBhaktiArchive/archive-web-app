/*!
 * sri sri guru gaurangau jayatah
 */

import { ContentDetails } from '../src/ContentDetails';
import { composeFileName } from '../src/filename';

describe('Filename', () => {
  it.each`
    id   | date            | timeOfDay | languages          | title                        | location       | filename
    ${1} | ${'1998-06-22'} | ${'AM'}   | ${'English'}       | ${'Deep moods of Gopi Gita'} | ${'Badger'}    | ${'1998-06-22 AM ENG — Deep moods of Gopi Gita, Badger (#0001).mp3'}
    ${2} | ${'2000-11'}    | ${null}   | ${'English,Hindi'} | ${'Kartika Mahima'}          | ${'Vrindavan'} | ${'2000-11 HIN,ENG — Kartika Mahima, Vrindavan (#0002).mp3'}
    ${3} | ${'1991'}       | ${null}   | ${'Hindi'}         | ${'Ragavartma Candrika'}     | ${'Mathura'}   | ${'1991 HIN — Ragavartma Candrika, Mathura (#0003).mp3'}
    ${4} | ${null}         | ${null}   | ${'English'}       | ${'Another lecture'}         | ${null}        | ${'UNDATED ENG — Another lecture (#0004).mp3'}
  `(
    'for $id should be "$filename"',
    ({ id, date, timeOfDay, languages, title, location, filename }) => {
      const contentDetails: ContentDetails = {
        date,
        timeOfDay,
        dateUncertain: false,
        languages,
        title,
        location,
        locationUncertain: false,
        topics: '',
        topicsReady: false,
        category: '',
        percentage: 1,
        soundQualityRating: 'Good',
      };

      expect(composeFileName(id, contentDetails)).toBe(filename);
    }
  );
});
