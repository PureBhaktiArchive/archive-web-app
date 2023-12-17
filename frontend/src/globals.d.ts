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

  type Schema = {
    home: Home;
    videos: Video[];
  };

  type DirectusClient = RestClient<Schema>;
}
