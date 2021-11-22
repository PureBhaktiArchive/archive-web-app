/*!
 * sri sri guru gaurangau jayatah
 */

export interface MemoriesRow {
  'Sr No': number;
  'Program name': string;
  "Speaker's name": string;
  "Speaker's country": string;
  "Speaker's Intro": string;
  Host: string;
  // Serial number, based on the number of days since December 30, 1899.
  'Date of memory (yyyy/mm/dd)': number;
  Language: string;
  'YouTube link': string;
  // Duration is stored as fraction of 1, where 1 corresponds to 24h
  'Duration (of the final edited video)': number;
  Topics: string;
  VideoId: string;
  'Ready for Launch': boolean;
}
