/*
 * Declaring types here to access types without importing in JS files according to
 * https://docs.joshuatz.com/cheatsheets/js/jsdoc/#passing-types-around-via-typescript-files
 * Wrapping with `declare global` because we have imports above, according to
 * https://docs.joshuatz.com/cheatsheets/js/jsdoc/#vscode-type-safety-jsdoc---issues
 */
export {};

declare global {
  type ContentDetails = {
    title: string;
    dateForHumans: string;
    dateUncertain: boolean;
    location: string;
    locationUncertain: boolean;
    category: string;
    languages: string[];
    duration: number;
  };

  type AudioRecord = ContentDetails & {
    fileId: number;
    topics: string;
    date?: string;
    year?: number;
    timeOfDay: string | null;
    languageCategory?: string;
    percentage: number;
    otherSpeakers: string[];
    series: string[];
    soundQualityRating: string;
  };

  type PlayerStatusEventDetail = {
    isPlaying: boolean;
  };

  type PlayerToggleEventDetail = {
    fileId: number;
    shouldPlay: boolean;
    contentDetails: ContentDetails;
  };
}
