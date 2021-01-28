/*!
 * sri sri guru gaurangau jayatah
 */

export interface AlgoliaRecord {
  objectID: string;
  title: string;
  topics: string;
  dateISO?: string;
  dateForHumans?: string;
  year?: number;
  timeOfDay: string;
  location: string;
  category: string;
  languages: string[];
  languageCategory?: string;
  percentage: number;
  soundQualityRating: string;
  duration: number | null;
}
