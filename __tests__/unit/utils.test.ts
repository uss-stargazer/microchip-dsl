import { describe, it, expect, test } from 'vitest';
import {
  countElementsOfTypeInArray,
  getFunctionNamesFromStack,
  LiteralTypes,
} from '../../src/utils.js';

function funcD(n: number): string[] {
  return getFunctionNamesFromStack(n);
}
function funcC(n: number): string[] {
  return funcD(n);
}
function funcB(n: number): string[] {
  return funcC(n);
}
function funcA(n: number): string[] {
  return funcB(n);
}
const expectedIds = [
  'getFunctionNamesFromStack',
  'funcD',
  'funcC',
  'funcB',
  'funcA',
];

describe('getFunctionNamesFromStack', () => {
  it('should return expected results', () => {
    for (let i = 0; i < 6; i++) {
      expect(funcA(i)).toStrictEqual(expectedIds.slice(0, i));
    }
  });
  it('should err if id in range is undefined', () => {
    expect(() => funcA(6)).toThrowError();
    expect(() => getFunctionNamesFromStack(1000)).toThrowError();
  });
});

describe('countElementsOfTypeInArray', () => {
  const testArray = [
    function (): void {},
    'cat',
    'cat',
    95,
    undefined,
    7729n,
    535n,
    false,
    58,
    507n,
    { x: 1, y: 2 },
    82,
    false,
    [1, 2, 3],
    { x: 1, y: 2 },
    true,
    Symbol(),
    { x: 1, y: 2 },
    'banana',
    [1, 2, 3],
  ];
  test.each<[LiteralTypes, number]>([
    ['string', 3],
    ['number', 3],
    ['bigint', 3],
    ['boolean', 3],
    ['symbol', 1],
    ['undefined', 1],
    ['object', 5],
    ['function', 1],
  ])('should count %s', (literal: LiteralTypes, expectedCount: number) => {
    expect(countElementsOfTypeInArray(testArray, literal)).toBe(expectedCount);
  });
});
