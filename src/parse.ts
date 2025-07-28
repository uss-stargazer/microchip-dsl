import ErrorStackParser from "error-stack-parser";
import * as ts from "typescript";

export const TEST_SETTINGS = {
  overrideParseCheck: false,
};

//-------------------------------------------
// Types and interfaces
//-------------------------------------------

export type ComponentFunction = (
  ...inputs: Signal[]
) => void | Signal | Signal[];

export interface ComponentId {
  function: string;
  file: string;
  // namespace: string;
}

export type ComponentIndex = keyof IntermediateState["components"]; // Purely for readability; could just be `number`
export type ComponentPinIndex = number; // Purely for readability

export interface SignalPoint {
  component: ComponentIndex;
  pin: ComponentPinIndex; // Either the input or output pin index, depending on context
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
export class Signal {
  private source?: SignalPoint;
  private destinations: SignalPoint[] = [];

  public _setSource(source: SignalPoint): Signal {
    this.source = source;
    return this;
  }

  public _addDestination(destination: SignalPoint): Signal {
    this.destinations.push(destination);
    return this;
  }

  /**
   * Sets the source component of this signal to the source compononet of `ref`
   * @param ref Signal to copy source from
   */
  public setSourceSignal(ref: Signal): Signal {
    this.source = ref.source;
    return this;
  }
}

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

function rootInputSignal(inputIndex: ComponentPinIndex): SignalPoint {
  return { component: -1, pin: inputIndex, containingComponent: -1 };
}

//-------------------------------------------
// Utility functions---
//-------------------------------------------

export function resolveImportToPath(importStr: string): string {
  return import.meta
    .resolve(importStr)
    .replace("file:///", "")
    .replaceAll("/", "\\");
}

export function getCallerInfo(): {
  callerId: ComponentId;
  callerParentId: ComponentId;
} {
  var stackTrace = ErrorStackParser.parse(new Error());
  if (!TEST_SETTINGS.overrideParseCheck) {
    const parseStackIndex = stackTrace.findIndex(
      (value) =>
        value.functionName === parse.name &&
        value.fileName === import.meta.filename
    );
    if (parseStackIndex === -1)
      throw new Error(
        "Caller function is not called during parsing and cannot be mapped to componentId"
      );
  }
  const [caller, callerParent] = [2, 3].map((idx) => {
    if (!stackTrace[idx].functionName || !stackTrace[idx].fileName) {
      throw new Error("Caller function or file name undefined");
    }
    return {
      function: stackTrace[idx].functionName,
      file: stackTrace[idx].fileName
        .replace("file:///", "")
        .replaceAll("/", "\\"),
    };
  });
  return { callerId: caller, callerParentId: callerParent };
}

//-------------------------------------------
// Programming interface
//-------------------------------------------

export const intermediateState: IntermediateState = {
  signals: [],
  components: [],
  componentRegistry: new Map(),
};

export function registerSignal(): Signal {
  const s = new Signal();
  intermediateState.signals.push(s);
  return s;
}

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
export function registerComponent(info: {
  inputs: Signal[];
  outputs: Signal[];
  style?: Partial<ComponentStyle>;
}) {
  const { callerId: componentId, callerParentId: parentComponentId } =
    getCallerInfo();

  if (!intermediateState.componentRegistry.has(parentComponentId))
    throw new Error("Parent component is not registered");

  // If not already registered, register
  if (!intermediateState.componentRegistry.has(componentId)) {
    intermediateState.componentRegistry.set(componentId, {
      nInputs: info.inputs.length,
      nOutputs: info.outputs.length,
      style: info.style ?? {},
    });
  } else {
    const currentComponentInfo: Omit<Component, "state"> = {
      nInputs: info.inputs.length,
      nOutputs: info.outputs.length,
      style: info.style ?? {},
    };
    if (
      currentComponentInfo !==
      intermediateState.componentRegistry.get(componentId)!
    )
      throw new Error(
        `Metadata and internals of '${componentId.function}' in file '${componentId.file}' must be remain constant`
      );
  }

  // // Create new instance of component
  // const componentInstance: ComponentIndex =
  //   intermediateState.components.push({
  //     self: componentId,
  //     parent: parentComponentId,
  //   }) - 1;

  // // Annotate inputs and outputs
  // info.inputs.forEach((input: Signal, idx: number) => {
  //   input._addDestination({
  //     component: componentInstance,
  //     pin: idx,
  //     containingComponent: ,
  //   });
  // });

  // if the parent of the function is parse() from parse.ts
}

//-------------------------------------------
// Main parse function
//-------------------------------------------

export async function parse(entryPath: string): Promise<MicrochipState> {
  // Scanning the code is running the code, which depends on the lib's functions which all write to `intermediateScanState`
  const sourceEntry = await import(entryPath);
  if (typeof sourceEntry.default !== "function")
    throw Error("Default export of entry point is not a function");
  const microchipInputs: Signal[] = Array.from(
    { length: sourceEntry.default.length },
    (_, idx: number) => {
      const s = new Signal()._setSource(rootInputSignal(idx));
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
