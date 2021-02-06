/*!
 * sri sri guru gaurangau jayatah
 */

import iso6392 from 'iso-639-2';

export const parseLanguages = (text: string | null): string[] =>
  (text?.trim() || null)?.split(',')?.map((language) => language.trim()) || [];

const languagesOrder = ['Hindi', 'English', 'Bengali'].reverse();

const languageToISO = iso6392.sort((a, b) => a.name.length - b.name.length);

export const abbreviateLanguages = (languages: string[]): string | null =>
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

export const categorizeLanguages = (languages: string[]): string | null => {
  enum Language {
    None = 0,
    English = 1 << 0,
    Hindi = 1 << 1,
    Bengali = 1 << 2,
    Other = 1 << 3,
  }
  const flags = languages.reduce(
    (previous, current) =>
      previous | (Language[current as keyof typeof Language] || Language.Other),
    Language.None
  );

  if (flags & Language.Other) return 'O';

  const categories = {
    [Language.None]: null,
    [Language.Hindi]: 'H',
    [Language.English]: 'E',
    [Language.Bengali]: 'B',
    [Language.English | Language.Hindi]: 'EH',
    [Language.English | Language.Bengali]: 'EB',
    [Language.Hindi | Language.Bengali]: 'HB',
    [Language.English | Language.Hindi | Language.Bengali]: 'EHB',
  };
  return categories[flags];
};
