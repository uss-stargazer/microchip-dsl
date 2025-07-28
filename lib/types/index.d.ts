import * as Parse from "./parse.js";
export { Signal } from "./parse.js";
export declare function registerSignal(): Parse.Signal;
/**
 * This function must be called before any internals of the chip are applied.
 *
 * @param inputs
 * @param outputs
 * @param style
 *
 * @returns
 * n modified input signals
 *
 * @example
 * function xor(in1: Signal, in2: Signal): Signal {
 *    const out = registerSignal();
 *    registerChip({
 *      inputs: [in1, in2],
 *      outputs: [out],
 *      style: { name: "XOR Gate" }
 *    });
 *
 *    return and(or(in1, in2), nand(in1, in2));
 * }
 */
export declare function registerComponent(info: {
    inputs: Parse.Signal[];
    outputs: Parse.Signal[];
    style: Partial<Parse.ComponentStyle>;
}): void;
export declare function not(a: Parse.Signal): Parse.Signal;
export declare function nand(a: Parse.Signal, b: Parse.Signal): Parse.Signal;
export declare function and(a: Parse.Signal, b: Parse.Signal): Parse.Signal;
export declare function or(a: Parse.Signal, b: Parse.Signal): Parse.Signal;
export declare function nor(a: Parse.Signal, b: Parse.Signal): Parse.Signal;
//# sourceMappingURL=index.d.ts.map