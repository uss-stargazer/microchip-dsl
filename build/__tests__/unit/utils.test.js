import { describe, it, expect, test } from 'vitest';
import { countElementsOfTypeInArray, getFunctionNamesFromStack, } from '../../src/utils.js';
function funcD(n) {
    return getFunctionNamesFromStack(n);
}
function funcC(n) {
    return funcD(n);
}
function funcB(n) {
    return funcC(n);
}
function funcA(n) {
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
        function () { },
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
    test.each([
        ['string', 3],
        ['number', 3],
        ['bigint', 3],
        ['boolean', 3],
        ['symbol', 1],
        ['undefined', 1],
        ['object', 5],
        ['function', 1],
    ])('should count %s', (literal, expectedCount) => {
        expect(countElementsOfTypeInArray(testArray, literal)).toBe(expectedCount);
    });
});
//# sourceMappingURL=utils.test.js.map