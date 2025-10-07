import ErrorStackParser from 'error-stack-parser';

export type Color =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'brown'
  | 'black'
  | 'gray';

// export type LiteralTypes =
//   | 'string'
//   | 'number'
//   | 'bigint'
//   | 'boolean'
//   | 'symbol'
//   | 'undefined'
//   | 'object'
//   | 'function';

// Credit: https://stackoverflow.com/a/52490977
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>;
export type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;
// export type Tuple<
//   T,
//   N extends number,
//   R extends unknown[] = [],
// > = R['length'] extends N ? R : Tuple<T, N, [T, ...R]>;

export function getNthFunctionNameUpStack(n: number): string {
  const functionInfo = ErrorStackParser.parse(new Error())[1 + n]; // So as not to include `getFunctionNamesFromStack`;
  if (!functionInfo.functionName || !functionInfo.fileName)
    throw new Error(
      `The function ${n} functions up the call stack has undefined name ('${functionInfo.functionName}') or file name ('${functionInfo.fileName}')`,
    );
  return functionInfo.functionName;
}

// export function countElementsOfTypeInArray(
//   array: any[], // eslint-disable-line @typescript-eslint/no-explicit-any
//   type: LiteralTypes,
// ): number {
//   let count = 0;
//   for (let i = 0; i < array.length; i++) if (typeof array[i] === type) count++;
//   return count;
// }
