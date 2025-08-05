// Should this be like a .d.ts file or something else just for types?
import ErrorStackParser from 'error-stack-parser';
export function getFunctionNamesFromStack(nLastIds) {
    const stackTrace = ErrorStackParser.parse(new Error());
    const stackTraceSlice = stackTrace.slice(0, nLastIds);
    return stackTraceSlice.map((value) => {
        if (!value.functionName || !value.fileName) {
            throw new Error('Caller function or file name undefined');
        }
        return value.functionName;
    });
}
export function countElementsOfTypeInArray(array, // eslint-disable-line @typescript-eslint/no-explicit-any
type) {
    let count = 0;
    for (let i = 0; i < array.length; i++)
        if (typeof array[i] === type)
            count++;
    return count;
}
//# sourceMappingURL=utils.js.map