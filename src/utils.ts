// Should this be like a .d.ts file or something else just for types?

import ErrorStackParser from 'error-stack-parser';

export type ComponentIndex = number; // Purely for readability
export type ComponentPinIndex = number; // Purely for readability

export type ComponentId = string;

export interface ComponentStyle {
  name: string;
  inputNames: string[];
  outputNames: string[];
  color:
    | 'red'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'blue'
    | 'purple'
    | 'brown'
    | 'black'
    | 'gray';
}

export function getFunctionNamesFromStack(nLastIds: number): string[] {
  const stackTrace = ErrorStackParser.parse(new Error());
  const stackTraceSlice = stackTrace.slice(0, nLastIds);
  return stackTraceSlice.map((value) => {
    if (!value.functionName || !value.fileName) {
      throw new Error('Caller function or file name undefined');
    }
    return value.functionName;
  });
}
