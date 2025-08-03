export declare const TEST_SETTINGS: {
    overrideParseCheck: boolean;
};
export type ComponentFunction = (...inputs: Signal[]) => void | Signal | Signal[];
export interface ComponentId {
    function: string;
    file: string;
}
export type ComponentIndex = keyof IntermediateState["components"];
export type ComponentPinIndex = number;
export interface SignalPoint {
    component: ComponentIndex;
    pin: ComponentPinIndex;
    containingComponent: ComponentIndex;
}
/**
 * The base object for digital signals. Signal cans have one source and multiple
 * destinations. A source can be the output pin of any component. Destinations can
 * be any number of input pins on any component, including the source's. It's helpful
 * to think of a Signal as a set of wires that have a single source.
 *
 * A signal without a source can exist; it represents an always-zero signal.
 */
export declare class Signal {
    private source?;
    private destinations;
    _setSource(source: SignalPoint): Signal;
    _addDestination(destination: SignalPoint): Signal;
    /**
     * Sets the source component of this signal to the source compononet of `ref`
     * @param ref Signal to copy source from
     */
    setSourceSignal(ref: Signal): Signal;
}
export interface IntermediateState {
    signals: Signal[];
    components: {
        self: ComponentId;
        parent: ComponentIndex;
    }[];
    componentRegistry: Map<ComponentId, Omit<Component, "state">>;
}
export interface ComponentStyle {
    name: string;
    inputNames: string[];
    outputNames: string[];
    color: "red" | "orange" | "yellow" | "green" | "blue" | "purple" | "brown" | "black" | "gray";
}
export interface Component {
    nInputs: number;
    nOutputs: number;
    state: {
        components: ComponentId[];
        connections: Set<{
            sourceComponentIndex: number | null;
            outputIndex: number;
            destinationComponentIndex: number | null;
            inputIndex: number;
        }>;
    };
    style: Partial<ComponentStyle>;
}
export interface MicrochipState {
    entryComponent: ComponentId;
    componentRegistry: Map<ComponentId, Component>;
}
export declare function resolveImportToPath(importStr: string): string;
export declare function getCallerInfo(): {
    callerId: ComponentId;
    callerParentId: ComponentId;
};
export declare const intermediateState: IntermediateState;
export declare function registerSignal(): Signal;
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
    inputs: Signal[];
    outputs: Signal[];
    style?: Partial<ComponentStyle>;
}): void;
export declare function parse(entryPath: string): Promise<MicrochipState>;
//# sourceMappingURL=parse.d.ts.map