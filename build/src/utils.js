// Should this be like a .d.ts file or something else just for types?
import ErrorStackParser from 'error-stack-parser';
export function getComponentIdsFromStack(nLastIds) {
    const stackTrace = ErrorStackParser.parse(new Error());
    const stackTraceSlice = stackTrace.slice(0, nLastIds);
    return stackTraceSlice.map((value) => {
        if (!value.functionName || !value.fileName) {
            throw new Error('Caller function or file name undefined');
        }
        return value.functionName;
    });
}
//# sourceMappingURL=utils.js.map