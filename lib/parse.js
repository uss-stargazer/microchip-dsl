import ErrorStackParser from "error-stack-parser";
/**
 * The base object for digital signals. Signal cans have one source and multiple
 * destinations. A source can be the output pin of any component. Destinations can
 * be any number of input pins on any component, including the source's. It's helpful
 * to think of a Signal as a set of wires that have a single source.
 *
 * A signal without a source can exist; it represents an always-zero signal.
 */
export class Signal {
    source;
    destinations = [];
    _setSource(source) {
        this.source = source;
        return this;
    }
    _addDestination(destination) {
        this.destinations.push(destination);
        return this;
    }
    /**
     * Sets the source component of this signal to the source compononet of `ref`
     * @param ref Signal to copy source from
     */
    setSourceSignal(ref) {
        this.source = ref.source;
        return this;
    }
}
export const intermediateState = {
    signals: [],
    components: [],
    componentRegistry: new Map(),
};
function rootInputSignal(inputIndex) {
    return { component: -1, pin: inputIndex, containingComponent: -1 };
}
//-------------------------------------------
// Utility functions---
//-------------------------------------------
// export function resolveImportToPath(importStr: string): string {
//   const tsConfigObject = ts.readConfigFile(
//     "tsconfig.json",
//     ts.sys.readFile
//   ).config;
//   const resolvedFilePath = ts.resolveModuleName(
//     importStr,
//     __filename,
//     tsConfigObject.compilerOptions,
//     ts.sys
//   ).resolvedModule?.resolvedFileName;
//   if (!resolvedFilePath)
//     throw new Error(`Could not resolve module '${importStr}'`);
//   return resolvedFilePath;
// }
export function getCallerInfo() {
    var stackTrace = ErrorStackParser.parse(new Error());
    const parseStackIndex = stackTrace.findIndex((value) => value.functionName === parse.name && value.fileName === __filename);
    if (parseStackIndex === -1)
        throw new Error("Caller function is not called during parsing and cannot be mapped to componentId");
    const [caller, callerParent] = [0, 1].map((idx) => {
        if (!stackTrace[idx].functionName || !stackTrace[idx].fileName) {
            throw new Error(`Caller function or file name undefined:\n${stackTrace[idx]}`);
        }
        return {
            function: stackTrace[idx].functionName,
            file: stackTrace[idx].fileName,
        };
    });
    return { callerId: caller, callerParentId: callerParent };
}
//-------------------------------------------
// Main parse function-
//-------------------------------------------
export async function parse(entryPath) {
    // Scanning the code is running the code, which depends on the lib's functions which all write to `intermediateScanState`
    const sourceEntry = await import(entryPath);
    if (typeof sourceEntry.default !== "function")
        throw Error("Default export of entry point is not a function");
    const microchipInputs = Array.from({ length: sourceEntry.default.length }, (_, idx) => {
        const s = new Signal()._setSource(rootInputSignal(idx));
        intermediateState.signals.push(s);
        return s;
    });
    const microchipOutputs = sourceEntry.default(microchipInputs); // Running the code will write to `intermediateScanState`
    const microchipState = {
        entryComponent: sourceEntry.default,
        componentRegistry: new Map(),
    };
    return microchipState;
}
