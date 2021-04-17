/*!
 * sri sri guru gaurangau jayatah
 */

export interface AlgoliaRecord {
  objectID: string;
  title: string;
  topics: string;
  topicsReady: boolean;
  dateISO?: string;
  dateForHumans?: string;
  year?: number;
  dateUncertain: boolean;
  timeOfDay: string;
  location: string;
  locationUncertain: boolean;
  category: string;
  languages: string[];
  languageCategory?: string;
  percentage: number;
  soundQualityRating: string;
  duration: number | null;
}
