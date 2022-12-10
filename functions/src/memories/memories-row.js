/*!
 * sri sri guru gaurangau jayatah
 */

export {};

/**
 * @prettierignore because jsdoc plugin corrupts properties in double quotes with apostrophe: https://github.com/homer0/packages/issues/58
 * @typedef {{
 *   'Sr No': number;
 *   'Program name': string;
 *   Seniority: number | null;
 *   "Speaker's name": string;
 *   "Speaker's country": string;
 *   'Guru Initials': string;
 *   "Speaker's Intro": string;
 *   Host: string;
 *   'Date of memory (yyyy/mm/dd)': number; // Serial number, based on the number of days since December 30, 1899.
 *   Language: string;
 *   'YouTube link': string;
 *   'Duration (of the final edited video)': number; // Duration is stored as fraction of 1, where 1 corresponds to 24h
 *   Topics: string;
 *   VideoId: string;
 *   'Ready for Launch': boolean;
 * }} MemoriesRow
 */
