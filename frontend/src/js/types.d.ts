/*
 * Declaring types here to access types without importing in JS files according to
 * https://docs.joshuatz.com/cheatsheets/js/jsdoc/#passing-types-around-via-typescript-files
 * Wrapping with `declare global` because we have imports above, according to
 * https://docs.joshuatz.com/cheatsheets/js/jsdoc/#vscode-type-safety-jsdoc---issues
 */
export {};

declare global {
  type PlayerStatusEventDetail = {
    isPlaying: boolean;
  };

  type PlayerToggleEventDetail = {
    fileId: number;
    shouldPlay: boolean;
    contentDetails: ContentDetails;
  };
}
