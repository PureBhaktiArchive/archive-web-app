/*!
 * sri sri guru gaurangau jayatah
 */

import { iso6392 } from 'iso-639-2';

const languagesOrder = ['Hindi', 'English', 'Bengali'].reverse();

const languageToISO = iso6392.sort((a, b) => a.name.length - b.name.length);

/**
 * @param {string[]} languages
 * @returns {string | null}
 */
export const abbreviateLanguages = (languages) =>
  languages
    .sort((a, b) => -(languagesOrder.indexOf(a) - languagesOrder.indexOf(b)))
    .map((language) =>
      languageToISO
        .find((info) =>
          info.name.toLowerCase().startsWith(language.toLowerCase())
        )
        ?.iso6392B?.toUpperCase()
    )
    .filter(Boolean)
    .join(',') || null;
