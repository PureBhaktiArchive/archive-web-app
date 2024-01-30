import { RestClient } from '@directus/sdk';

/**
 * Declaring types here to access types without importing in JS files according to
 * https://docs.joshuatz.com/cheatsheets/js/jsdoc/#passing-types-around-via-typescript-files
 * Wrapping with `declare global` because we have imports above, according to
 * https://docs.joshuatz.com/cheatsheets/js/jsdoc/#vscode-type-safety-jsdoc---issues
 */

declare global {
  type Video = {
    url: string;
    language: 'en' | 'hi';
    vertical: boolean;
  };

  type Home = {
    english_video: Video;
    hindi_video: Video;
    short_video: Video;
  };

  type Audio = {
    id: number;
    fileId: number; // Including this manually because Directus does not include query aliases in the field types. See https://github.com/directus/directus/blob/c45cd69dd723e0a536cab537aff117d5861868e7/sdk/src/types/query.ts#L69-L73
    status: 'active' | 'inactive';
    title: string;
    topics: string;
    date: string;
    dateUncertain: boolean;
    timeOfDay: string;
    location: string;
    locationUncertain: boolean;
    category: string;
    percentage: number;
    soundQualityRating: string;
    languages: string[];
    otherSpeakers?: string[];
    duration: number;
  };

  type AudioForSearch = Pick<
    Audio,
    | 'title'
    | 'topics'
    | 'date'
    | 'dateUncertain'
    | 'timeOfDay'
    | 'location'
    | 'locationUncertain'
    | 'category'
    | 'percentage'
    | 'soundQualityRating'
    | 'languages'
    | 'otherSpeakers'
    | 'duration'
  > & {
    objectID: string;
    fileId: number;
    dateForHumans: string;
    year: number;
    languageCategory: string;
  };

  type DirectusSchema = {
    home: Home;
    videos: Video[];
    audios: Audio[];
  };

  type DirectusClient = RestClient<DirectusSchema>;

  type EleventyGlobalData = {
    home: Home;
    audios: Audio[];
    directus: DirectusClient;
  };
}
