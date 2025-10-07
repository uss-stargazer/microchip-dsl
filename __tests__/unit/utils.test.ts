import { describe, it, expect } from 'vitest';
import { getNthFunctionNameUpStack } from '../../src/utils.js';

function funcD(n: number): string {
  return getNthFunctionNameUpStack(n);
}
function funcC(n: number): string {
  return funcD(n);
}
function funcB(n: number): string {
  return funcC(n);
}
function funcA(n: number): string {
  return funcB(n);
}
const expectedIds = ['funcD', 'funcC', 'funcB', 'funcA'];

describe('getNthFunctionNameUpStack', () => {
  it('should return expected results', () => {
    for (let i = 0; i < expectedIds.length; i++) {
      expect(funcA(i)).toStrictEqual(expectedIds[i]);
    }
  });
  it('should err if id in range is undefined', () => {
    expect(() => funcA(4)).toThrowError(); // 4 is this function, which is unnamed
    expect(() => getNthFunctionNameUpStack(1000)).toThrowError();
  });
});
