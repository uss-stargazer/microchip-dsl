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

// Credit: https://stackoverflow.com/a/52490977
export type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>;
