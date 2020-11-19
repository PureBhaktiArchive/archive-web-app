/*!
 * sri sri guru gaurangau jayatah
 */

import algoliasearch from 'algoliasearch';
import * as functions from 'firebase-functions';
import { DateTime } from 'luxon';
import { parsePseudoISODate, Precision } from './dates';
import { getAllRows } from './sheets';

interface IRow {
  ID: string;
  Title: string;
  Topics: string;
  Date: string;
  Time: string;
  Location: string;
  Category: string;
  Languages: string;
  'Srila Gurudeva Timing': number;
  'Sound Quality Rating': string;
  'Series Name': string;
  'Position In Series': number;
}

interface IRecord {
  objectID: string;
  title: string;
  topics: string;
  dateISO?: string;
  dateForHumans?: string;
  year?: number;
  time: string;
  location: string;
  category: string;
  languages: string[];
  percentage: number;
  soundQualityRating: string;
  seriesName: string;
  positionInSeries: number;
}

const getFormatOptions = (precision: Precision): Intl.DateTimeFormatOptions =>
  precision === 'day'
    ? DateTime.DATE_FULL
    : precision === 'month'
    ? {
        year: 'numeric',
        month: 'long',
      }
    : { year: 'numeric' };

function getDateAttributes(
  date: string
): Pick<IRecord, 'dateForHumans' | 'dateISO' | 'year'> | null {
  const parsedDate = parsePseudoISODate(date);
  return {
    dateISO: parsedDate?.iso,
    /**
     * Formatting date for free-text search according to precision.
     * - Full date: April 22, 1996
     * - Month: April 1996
     * - Year: 1996
     */
    dateForHumans: parsedDate?.date.toLocaleString(
      getFormatOptions(parsedDate.precision)
    ),
    year: parsedDate?.date.year,
  };
}

export default functions.pubsub.topic('reindex').onPublish(async () => {
  const rows = await getAllRows<IRow>(
    functions.config().spreadsheet.id,
    'Final For Archive'
  );
  const records = rows.map<IRecord>((row) => ({
    objectID: row.ID,
    title: row.Title,
    topics: row.Topics,
    ...getDateAttributes(row.Date),
    time: row.Time,
    location: row.Location,
    category: row.Category,
    languages: row.Languages?.split(',').map((language) => language.trim()),
    percentage: row['Srila Gurudeva Timing'],
    soundQualityRating: row['Sound Quality Rating'],
    seriesName: row['Series Name'],
    positionInSeries: row['Position In Series'],
  }));

  const client = algoliasearch(
    functions.config().algolia.appid,
    functions.config().algolia.apikey
  );
  const index = client.initIndex(functions.config().algolia.index);
  await index.replaceAllObjects(records);
  console.log('Indexing has been successfully queued.');
});
