import Signal from "./signal";
import { ComponentId, ComponentStyle, ComponentIndex } from "./utils";

export interface IntermediateState {
  signals: Signal[];
  components: { self: ComponentId; parent: ComponentIndex }[];
  componentRegistry: Map<ComponentId, Omit<Component, "state">>;
}

export interface Component {
  nInputs: number;
  nOutputs: number;
  state: {
    components: ComponentId[];
    connections: Set<{
      sourceComponentIndex: number | null; // Null represents an input of the component this interface represents
      outputIndex: number;
      destinationComponentIndex: number | null; // Null represents an ouput of the component this interface represents
      inputIndex: number;
    }>;
  };
  style: Partial<ComponentStyle>;
}

export interface MicrochipState {
  entryComponent: ComponentId;
  componentRegistry: Map<ComponentId, Component>;
}
