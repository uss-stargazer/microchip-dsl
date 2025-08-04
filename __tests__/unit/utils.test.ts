import { describe, it, expect } from 'vitest';
import { getFunctionNamesFromStack } from '../../src/utils.js';

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
  'getComponentIdsFromStack',
  'funcD',
  'funcC',
  'funcB',
  'funcA',
];

describe('getComponentIdsFromStack', () => {
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
