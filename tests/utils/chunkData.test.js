import { expect, test, vi } from 'vitest';
import { chunkData } from '../../utils/chunkData.js';

test('can chunk data', async () => {
  const data1 = chunkData([1,2,3,4,5,6,7,8], 3, 2);
  expect(data1).toStrictEqual([
    [
      [1,2],
      [3,4],
      [5,6]
    ],
    [
      [7],
      [8],
      []
    ]
  ]);

  const data2 = chunkData([1], 3, 2);
  expect(data2).toStrictEqual([
    [
      [1]
    ],
  ]);

  const data3 = chunkData([1,2], 3, 2);
  expect(data3).toStrictEqual([
    [
      [1],
      [2],
      []
    ],
  ]);
});
