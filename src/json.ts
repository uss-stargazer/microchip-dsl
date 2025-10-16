import * as fs from 'fs';
import { MicrochipState } from './microchip.js';

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

export function microchipStateToJsonStr(state: MicrochipState) {
  return JSON.stringify(state, microchipStateReplacer);
}

export function microchipStateFromJsonStr(data: string) {
  return JSON.parse(data, microchipStateReviver);
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
