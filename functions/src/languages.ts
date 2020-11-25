/*!
 * sri sri guru gaurangau jayatah
 */

export const parseLanguages = (text: string | null): string[] =>
  (text?.trim() || null)?.split(',')?.map((language) => language.trim()) || [];

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

  // console.debug(languages, flags);
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
