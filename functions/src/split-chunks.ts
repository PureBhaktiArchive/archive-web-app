/*!
 * sri sri guru gaurangau jayatah
 */

/**
 * Splits array into chunks
 * Inspired by https://stackoverflow.com/a/44687374/3082178
 * @param list array to split into chunks
 * @param chunkSize maximum size of the chunk
 * @returns array of arrays
 */
export function splitToChunks<T>(list: T[], chunkSize: number) {
  return [...Array(Math.ceil(list.length / chunkSize))].map((_, i) =>
    list.slice(i * chunkSize, i * chunkSize + chunkSize)
  );
}
