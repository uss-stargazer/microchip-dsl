"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intermediateState = void 0;
exports.default = parse;
const _1 = require(".");
// Each function called within a chip is only executed if its parent (the chip function) has not been registered
exports.intermediateState = {
    signals: [],
    components: [],
    componentRegistry: new Map(),
};
async function parse(entryPath) {
    // Scanning the code is running the code, which depends on the lib's functions which all write to `intermediateScanState`
    const sourceEntry = await import(entryPath);
    if (typeof sourceEntry.default !== "function")
        throw Error("Default export of entry point is not a function");
    const microchipInputs = Array.from({ length: sourceEntry.default.length }, () => new _1.Signal());
    const microchipOutputs = sourceEntry.default(microchipInputs); // Running the code will write to `intermediateScanState`
    const microchipState = {
        entryComponent: sourceEntry.default,
        componentRegistry: new Map(),
    };
    return microchipState;
}
parse.length;
