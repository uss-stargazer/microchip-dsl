interface SignalSource {
    componentIndex: number;
    outputIndex: number;
}
interface SignalDestination {
    componentIndex: number;
    inputIndex: number;
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
    private sourceComponent?;
    private destinationComponents;
    _setSourceComponent(source: SignalSource): Signal;
    _addDestinationComponent(destination: SignalDestination): Signal;
    /**
     * Sets the source component of this signal to the source compononet of `ref`
     * @param ref Signal to copy source from
     */
    setSourceSignal(ref: Signal): Signal;
}
export declare function registerSignal(): Signal;
export declare function not(a: Signal): Signal;
export declare function nand(a: Signal, b: Signal): Signal;
export declare function and(a: Signal, b: Signal): Signal;
export declare function or(a: Signal, b: Signal): Signal;
export declare function nor(a: Signal, b: Signal): Signal;
export declare function registerChip(info: any): void;
export {};
//# sourceMappingURL=index.d.ts.map