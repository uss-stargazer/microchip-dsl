import { describe, it, expect } from 'vitest';
import { getComponentIdsFromStack } from '../../src/utils.js';
function funcD(n) {
    return getComponentIdsFromStack(n);
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
        expect(() => getComponentIdsFromStack(1000)).toThrowError();
    });
});
//# sourceMappingURL=utils.test.js.map