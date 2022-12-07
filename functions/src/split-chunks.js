/*!
 * sri sri guru gaurangau jayatah
 */

/**
 * Splits array into chunks.
 * Inspired by https://stackoverflow.com/a/44687374/3082178
 *
 * @template T
 * @param {T[]}    list       Array to split into chunks.
 * @param {number} chunkSize  Maximum size of the chunk.
 * @returns {T[][]} Array of chunks.
 */
export function splitToChunks(list, chunkSize) {
  return [...Array(Math.ceil(list.length / chunkSize))].map((_, i) =>
    list.slice(i * chunkSize, i * chunkSize + chunkSize)
  );
}
