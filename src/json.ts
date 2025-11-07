import * as fs from 'fs';
import { MicrochipState } from './microchip.js';
import { Component } from './component.js';

// parital credit: https://stackoverflow.com/a/56150320 (for replacer and reviver)

function microchipStateReplacer(key: any, value: any): any {
  if (value instanceof Map) {
    if (key === 'componentRegistry') {
      for (const component of value.values()) {
        if (typeof component.state != 'string') {
          component.state.connections = {
            dataType: 'Set',
            value: [...component.state.connections],
          };
        }
      }
    }
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

function microchipStateReviver(key: any, value: any): any {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      if (key === 'componentRegistry') {
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars */
        for (const [_, component] of value.value) {
          if (
            typeof component.state != 'string' &&
            component.state.connections.dataType === 'Set'
          ) {
            component.state.connections = new Set(
              component.state.connections.value,
            );
          }
        }
      }
      return new Map(value.value);
    }
  }
  return value;
}

export function microchipStateToJsonStr(state: MicrochipState): string {
  return JSON.stringify(state, microchipStateReplacer);
}

export function microchipStateFromJsonStr(data: string): MicrochipState {
  const microchipState = JSON.parse(data, microchipStateReviver);
  if (
    !(
      typeof microchipState.rootComponent === 'number' &&
      microchipState.componentRegistry instanceof Map &&
      [
        ...(
          microchipState.componentRegistry as Map<number, Component>
        ).entries(),
      ].every(
        (entry) =>
          typeof entry[0] === 'number' &&
          typeof entry[1].nInputs === 'number' &&
          typeof entry[1].nOutputs === 'number' &&
          (typeof entry[1].state === 'string' ||
            (typeof entry[1].state.components === 'object' &&
              entry[1].state.components.every((id) => typeof id === 'number') &&
              entry[1].state.connections instanceof Set &&
              [...entry[1].state.connections.values()].every((connection) =>
                [connection.source, connection.destination].every(
                  (signal) =>
                    typeof signal === 'object' &&
                    (typeof signal.component === 'number' ||
                      signal.component === null ||
                      signal.component === 'input' ||
                      signal.component === 'output') &&
                    (typeof signal.pin === 'number' || signal.pin === null),
                ),
              ))) &&
          typeof entry[1].style === 'object',
      )
    )
  ) {
    throw new Error('Object does not extend MicrochipState interface');
  }
  return microchipState;
}

export function microchipStateToJson(
  state: MicrochipState,
  outputPath: string,
): void {
  fs.writeFile(outputPath, microchipStateToJsonStr(state), (err) => {
    if (err) throw err;
  });
}

export function microchipStateFromJson(inputPath: string): MicrochipState {
  const data = fs.readFileSync(inputPath);
  return microchipStateFromJsonStr(data.toString());
}
