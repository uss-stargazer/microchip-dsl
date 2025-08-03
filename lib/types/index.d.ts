import Signal from "./signal.js";
import { ComponentId, ComponentStyle } from "./utils.js";
type ComponentFunction = (...inputs: Signal[]) => Signal[];
export interface Component {
    nInputs: number;
    nOutputs: number;
    state: {
        components: ComponentId[];
        connections: Set<{
            source: Signal;
            destinationComponentIndex: number;
            inputIndex: number;
        }>;
    };
    style: Partial<ComponentStyle>;
}
type GateId = "nand" | "and" | "or" | "nor";
type GateFunction = (a: Signal, b: Signal) => [Signal];
export interface MicrochipState {
    entryComponent: ComponentId;
    componentRegistry: Map<ComponentId, Component>;
}
export default class Microchip {
    private entryComponent;
    private componentRegistry;
    private nullWriting;
    constructor();
    _getState(): MicrochipState;
    registerComponent<T extends ComponentFunction>(name: ComponentId, func: T, style?: Partial<ComponentStyle>): T;
    registerGate(name: GateId, style?: Partial<ComponentStyle>): GateFunction;
    setEntryComponent(component: ComponentId): void;
}
export {};
//# sourceMappingURL=index.d.ts.map