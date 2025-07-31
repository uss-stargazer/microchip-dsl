// Should this be like a .d.ts file or something else just for types?

import * as ErrorStackParser from "error-stack-parser";

export type ComponentIndex = number; // Purely for readability; could just be `number`
export type ComponentPinIndex = number; // Purely for readability

export type ComponentId = string;
// export interface ComponentId {
//   function: string;
//   // file: string;
//   // namespace: string;
// }

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

export function resolveImportToPath(importStr: string): string {
  return import.meta
    .resolve(importStr)
    .replace("file:///", "")
    .replaceAll("/", "\\");
}

export function getComponentIdsFromStack(): ComponentId[] {
  const stackTrace = ErrorStackParser.parse(new Error());
  return stackTrace.map((value) => {
    if (!value.functionName || !value.fileName) {
      throw new Error("Caller function or file name undefined");
    }
    return value.functionName;
    // file: value.fileName.replace("file:///", "").replaceAll("/", "\\"),
  });
}
