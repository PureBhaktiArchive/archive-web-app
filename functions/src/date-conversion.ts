/*!
 * sri sri guru gaurangau jayatah
 */

import { DateTime, Settings } from 'luxon';

const daysBetweenEpochs = 25569; // Number of days between December 30th 1899 and January 1st 1970
const secondsInDay = 86400; // 24 * 60 * 60

export function fromSerialDate(
  serialDate: number,
  timezone: string = Settings.defaultZoneName
): DateTime {
  try {
    // Calculating timestamp as if the source date was specified in UTC,
    // then setting the time zone as specified but keeping local time the same
    return DateTime.fromSeconds((serialDate - daysBetweenEpochs) * secondsInDay)
      .setZone('utc')
      .setZone(timezone, { keepLocalTime: true });
  } catch (error) {
    console.error(`Value "${serialDate}" caused error`, error);
    throw error;
  }
}

/**
 * Converts particular date/time into Excel/Sheets serial date value.
 * Because Excel/Sheets do not track the time zone, the local time of @datetime is converted.
 * @param datetime Luxon date/time object
 */
export function toSerialDate(datetime: DateTime): number {
  // Setting the time zone to UTC but keeping local time the same,
  // then calculating the serial date as if the timestamp was specified in UTC
  return (
    datetime.setZone('utc', { keepLocalTime: true }).toSeconds() /
      secondsInDay +
    daysBetweenEpochs
  );
}