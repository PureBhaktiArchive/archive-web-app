/*!
 * sri sri guru gaurangau jayatah
 */

import { splitToChunks } from './split-chunks';

describe('Splitting array into chunks', () => {
  test('evenly', () => {
    const sourceArray = [1, 2, 3, 4, 5, 6];
    const chunks = splitToChunks(sourceArray, 2);
    expect(chunks).toHaveLength(3);
    expect(chunks[0]).toEqual([1, 2]);
    expect(chunks[1]).toEqual([3, 4]);
    expect(chunks[2]).toEqual([5, 6]);
  });

  test('unevenly', () => {
    const sourceArray = [1, 2, 3, 4, 5];
    const chunks = splitToChunks(sourceArray, 3);
    expect(chunks).toHaveLength(2);
    expect(chunks[0]).toEqual([1, 2, 3]);
    expect(chunks[1]).toEqual([4, 5]);
  });

  test('into one', () => {
    const sourceArray = [1, 2, 3, 4, 5, 6];
    const chunks = splitToChunks(sourceArray, 10);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toEqual(sourceArray);
  });
});
