import { RestClient } from '@directus/sdk';

/**
 * Declaring types here to access types without importing in JS files according to
 * https://docs.joshuatz.com/cheatsheets/js/jsdoc/#passing-types-around-via-typescript-files
 *
 * Wrapping with `declare global` because we have imports above, according to
 * https://docs.joshuatz.com/cheatsheets/js/jsdoc/#vscode-type-safety-jsdoc---issues
 *
 * Using a plain *.ts file instead of an ambient declaration file in order to enforce type checks here.
 * There is no check in *.d.ts if `skipLibCheck` is `true`. See https://stackoverflow.com/q/71700154/3082178
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

  interface Audio {
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
  }

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

  /**
   * An object containing all information required for the audio player functionality.
   */
  type PlayerItem = Pick<
    Audio,
    | 'fileId'
    | 'title'
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
    dateForHumans: string;
  };

  interface Serie {
    id: number;
    status: 'published' | 'draft' | 'archived';
    title: string;
    sort: number;
    audios: SerieAudio[];
  }

  interface SerieAudio {
    id: number;
    series_id: number;
    audios_id: Audio;
    sort: number;
  }

  /**
   * @see https://docs.directus.io/guides/sdk/types.html
   */
  interface DirectusSchema {
    home: Home;
    videos: Video[];
    audios: Audio[];
    series: Serie[];
    series_audios: SerieAudio[];
  }

  type EleventyGlobalData = {
    home: Home;
    audios: Audio[];
    series: Serie[];
    directus: RestClient<DirectusSchema>;
  };
}
