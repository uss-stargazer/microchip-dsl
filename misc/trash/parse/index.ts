import * as ErrorStackParser from "error-stack-parser";
import * as ts from "typescript";

import * from "../../src/parse"

export function registerSignal(): Signal {
  const s = new Signal();
  Parse.intermediateState.signals.push(s);
  return s;
}

function resolveImportToPath(importStr: string): string {
  const tsConfigObject = ts.readConfigFile(
    "tsconfig.json",
    ts.sys.readFile
  ).config;
  const resolvedFilePath = ts.resolveModuleName(
    importStr,
    __filename,
    tsConfigObject.compilerOptions,
    ts.sys
  ).resolvedModule?.resolvedFileName;
  if (!resolvedFilePath)
    throw new Error(`Could not resolve module '${importStr}'`);
  return resolvedFilePath;
}

function getCallerInfo(): {
  callerId: Parse.ComponentId;
  callerParentId: Parse.ComponentId;
} {
  var stackTrace = ErrorStackParser.parse(new Error());
  const parseStackIndex = stackTrace.findIndex(
    (value) =>
      value.functionName === Parse.parse.name &&
      value.fileName === resolveImportToPath("./parse")
  );
  if (parseStackIndex === -1)
    throw new Error(
      "Caller function is not called during parsing and cannot be mapped to componentId"
    );
  const [caller, callerParent] = [0, 1].map((idx) => {
    if (!stackTrace[idx].functionName || !stackTrace[idx].fileName) {
      throw new Error(
        `Caller function or file name undefined:\n${stackTrace[idx]}`
      );
    }
    return {
      function: stackTrace[idx].functionName,
      file: stackTrace[idx].fileName,
    };
  });
  return { callerId: caller, callerParentId: callerParent };
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
  style: Partial<Parse.ComponentStyle>;
}) {
  const { callerId: componentId, callerParentId: parentComponentId } =
    getCallerInfo();

  if (!Parse.intermediateState.componentRegistry.has(parentComponentId))
    throw new Error("Parent component is not registered");

  // If not already registered, register
  if (!Parse.intermediateState.componentRegistry.has(componentId)) {
    Parse.intermediateState.componentRegistry.set(componentId, {
      nInputs: info.inputs.length,
      nOutputs: info.outputs.length,
      style: info.style,
    });
  } else {
    const currentComponentInfo: Omit<Parse.Component, "state"> = {
      nInputs: info.inputs.length,
      nOutputs: info.outputs.length,
      style: info.style,
    };
    if (
      currentComponentInfo !==
      Parse.intermediateState.componentRegistry.get(componentId)!
    )
      throw new Error(
        `Metadata and internals of '${componentId.function}' in file '${componentId.file}' must be remain constant`
      );
  }

  // Create new instance of component
  const componentInstance: ComponentIndex =
    Parse.intermediateState.components.push({
      self: componentId,
      parent: parentComponentId,
    }) - 1;

  // Annotate inputs and outputs
  info.inputs.forEach((input: Signal) => {
    input._addDestinationComponent({
      component: componentInstance,
      containingComponent,
    });
  });

  // if the parent of the function is parse() from parse.ts
}

export function not(a: Signal): Signal {
  "use strict";
  // Add to component registry
  if (!Parse.intermediateState.componentRegistry.has(not))
    Parse.intermediateState.componentRegistry.set(not, {
      nInputs: 1,
      nOutputs: 1,
      style: {},
    });
  // Add specific instance to components array
  const componentIndex = Parse.intermediateState.components.length;
  Parse.intermediateState.components.push({
    self: not,
    parent: not.caller,
  });
  // Annotate input signal
  a._addDestinationComponent({ componentIndex: componentIndex, inputIndex: 0 });
  // Create and annotate return signal
  const s = new Signal();
  s._setSourceComponent({ componentIndex: componentIndex, outputIndex: 0 });
  Parse.intermediateState.signals.push(s);
  return s;
}

export function nand(a: Signal, b: Signal): Signal {
  "use strict";
  // Add to component registry
  if (!Parse.intermediateState.componentRegistry.has(nand))
    Parse.intermediateState.componentRegistry.set(nand, {
      nInputs: 2,
      nOutputs: 1,
      style: {},
    });
  // Add specific instance to components array
  const componentIndex = Parse.intermediateState.components.length;
  Parse.intermediateState.components.push({
    self: nand,
    parent: nand.caller,
  });
  // Annotate input signals
  a._addDestinationComponent({ componentIndex: componentIndex, inputIndex: 0 });
  b._addDestinationComponent({ componentIndex: componentIndex, inputIndex: 1 });
  // Create and annotate return signal
  const s = new Signal();
  s._setSourceComponent({ componentIndex: componentIndex, outputIndex: 0 });
  Parse.intermediateState.signals.push(s);
  return s;
}

export function and(a: Signal, b: Signal): Signal {
  "use strict";
  // Add to component registry
  if (!Parse.intermediateState.componentRegistry.has(and))
    Parse.intermediateState.componentRegistry.set(and, {
      nInputs: 2,
      nOutputs: 1,
      style: {},
    });
  // Add specific instance to components array
  const componentIndex = Parse.intermediateState.components.length;
  Parse.intermediateState.components.push({
    self: and,
    parent: and.caller,
  });
  // Annotate input signals
  a._addDestinationComponent({ componentIndex: componentIndex, inputIndex: 0 });
  b._addDestinationComponent({ componentIndex: componentIndex, inputIndex: 1 });
  // Create and annotate return signal
  const s = new Signal();
  s._setSourceComponent({ componentIndex: componentIndex, outputIndex: 0 });
  Parse.intermediateState.signals.push(s);
  return s;
}

export function or(a: Signal, b: Signal): Signal {
  "use strict";
  // Add to component registry
  if (!Parse.intermediateState.componentRegistry.has(or))
    Parse.intermediateState.componentRegistry.set(or, {
      nInputs: 2,
      nOutputs: 1,
      style: {},
    });
  // Add specific instance to components array
  const componentIndex = Parse.intermediateState.components.length;
  Parse.intermediateState.components.push({
    self: or,
    parent: or.caller,
  });
  // Annotate input signals
  a._addDestinationComponent({ componentIndex: componentIndex, inputIndex: 0 });
  b._addDestinationComponent({ componentIndex: componentIndex, inputIndex: 1 });
  // Create and annotate return signal
  const s = new Signal();
  s._setSourceComponent({ componentIndex: componentIndex, outputIndex: 0 });
  Parse.intermediateState.signals.push(s);
  return s;
}

export function nor(a: Signal, b: Signal): Signal {
  "use strict";
  // Add to component registry
  if (!Parse.intermediateState.componentRegistry.has(nor))
    Parse.intermediateState.componentRegistry.set(nor, {
      nInputs: 2,
      nOutputs: 1,
      style: {},
    });
  // Add specific instance to components array
  const componentIndex = Parse.intermediateState.components.length;
  Parse.intermediateState.components.push({
    self: nor,
    parent: nor.caller,
  });
  // Annotate input signals
  a._addDestinationComponent({ componentIndex: componentIndex, inputIndex: 0 });
  b._addDestinationComponent({ componentIndex: componentIndex, inputIndex: 1 });
  // Create and annotate return signal
  const s = new Signal();
  s._setSourceComponent({ componentIndex: componentIndex, outputIndex: 0 });
  Parse.intermediateState.signals.push(s);
  return s;
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
