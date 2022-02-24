/*!
 * sri sri guru gaurangau jayatah
 */

export interface MemoriesAlgoliaRecord {
  objectID: string;
  programName: string;
  seniority: number | null;
  speakerName: string;
  speakerCountry: string;
  speakerIntro: string;
  hostName: string;
  date: number; // Unix Timestamp
  dateForHumans: string;
  language: string;
  videoId: string;
  duration: number;
  topics: string;
  gurus: {
    abbreviation: string;
    fullName: string | null;
  }[];
}
