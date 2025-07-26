import { Signal } from ".";
type ComponentId = string;
interface IntermediateState {
    signals: Signal[];
    components: {
        self: ComponentId;
        parent: ComponentId;
    }[];
    componentRegistry: Map<ComponentId, Omit<Component, "state">>;
}
interface ComponentStyle {
    name: string;
    inputNames: string[];
    outputNames: string[];
    color: "red" | "orange" | "yellow" | "green" | "blue" | "purple" | "brown" | "black" | "gray";
}
interface Component {
    nInputs: number;
    nOutputs: number;
    state: {
        components: ComponentId[];
        connections: {
            sourceComponentIndex: number;
            outputIndex: number;
            destinationComponentIndex: number;
            inputIndex: number;
        }[];
    };
    style: Partial<ComponentStyle>;
}
interface MicrochipState {
    entryComponent: ComponentId;
    componentRegistry: Map<ComponentId, Component>;
}
export declare const intermediateState: IntermediateState;
export default function parse(entryPath: string): Promise<MicrochipState>;
export {};
//# sourceMappingURL=parse.d.ts.map