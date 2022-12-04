/*!
 * sri sri guru gaurangau jayatah
 */

export interface AudiosAlgoliaRecord {
  objectID: string;
  title: string;
  topics: string;
  topicsReady: boolean;
  dateISO?: string;
  dateForHumans?: string;
  year?: number;
  dateUncertain: boolean | null;
  timeOfDay: string | null;
  location: string | null;
  locationUncertain: boolean | null;
  category: string;
  languages: string[];
  languageCategory?: string;
  percentage: number;
  soundQualityRating: string;
  duration: number;
}
