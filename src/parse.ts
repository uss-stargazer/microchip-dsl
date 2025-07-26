import { Signal } from ".";

type ComponentFunction = (...inputs: Signal[]) => void | Signal | Signal[];

export interface ComponentId {
  function: string;
  file: string;
  // namespace: string;
}

type ComponentIndex = keyof IntermediateState["components"]; // Purely for readability; could just be `number`
type ComponentPinIndex = number; // Purely for readability

export interface IntermediateState {
  signals: Signal[];
  components: { self: ComponentId; parent: ComponentIndex }[];
  componentRegistry: Map<ComponentId, Omit<Component, "state">>;
}

export interface ComponentStyle {
  name: string;
  inputNames: string[];
  outputNames: string[];
  color:
    | "red"
    | "orange"
    | "yellow"
    | "green"
    | "blue"
    | "purple"
    | "brown"
    | "black"
    | "gray";
}

export interface Component {
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

// Each function called within a chip is only executed if its parent (the chip function) has not been registered
export const intermediateState: IntermediateState = {
  signals: [],
  components: [],
  componentRegistry: new Map(),
};

export async function parse(entryPath: string): Promise<MicrochipState> {
  // Scanning the code is running the code, which depends on the lib's functions which all write to `intermediateScanState`
  const sourceEntry = await import(entryPath);
  if (typeof sourceEntry.default !== "function")
    throw Error("Default export of entry point is not a function");
  const microchipInputs: Signal[] = Array.from(
    { length: sourceEntry.default.length },
    () => {
      const s = new Signal()._setSource(null);
      intermediateState.signals.push(s);
      return s;
    }
  );
  const microchipOutputs = sourceEntry.default(microchipInputs); // Running the code will write to `intermediateScanState`

  const microchipState: MicrochipState = {
    entryComponent: sourceEntry.default,
    componentRegistry: new Map<ComponentId, Component>(),
  };

  return microchipState;
}
