import fs from "node:fs";
import Microchip, { Component, MicrochipState } from "../index.js";

// interface IntermediateMicrochipState {
//   entryComponent: string;
//   componentRegistry: [string, Component][];
// }

export function writeStateJSON(state: MicrochipState, file: string) {
  const jsonString = JSON.stringify(state, null, 2);
  fs.writeFile(file, jsonString, (err) => {
    if (err) throw err;
  });
}

// export function parseStateJSON(file: string): MicrochipState {
//   fs.readFile(file, (err, data: NonSharedBuffer) => {
//     if (err) throw err;
//     // Way to do async?
//   });
//   return {}
// }

export default async function parse(
  entryFile: string
): Promise<MicrochipState> {
  const entry = await import(entryFile);
  if (!(entry.default instanceof Microchip)) {
    throw new Error(
      `Default export of entry point must be an instance of Microchip: is type ${typeof entry.default}`
    );
  }
  return (entry.default as Microchip)._getState();
}
