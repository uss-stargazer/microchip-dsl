#!/usr/bin/env node

const USAGE = "parse-microchip [options] <entry_path> <output_path>";
const HELP = `Usage: ${USAGE}`;

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

function parseArgs(args) {
  if (args.includes("--help") || args.includes("-h")) {
    process.stdout.write(HELP);
    process.exit(0);
  }
  if (args.length !== 2) {
    process.stderr.write("Invalid args");
    process.exit(1);
  }
  return {
    entryPath: path.resolve(process.cwd(), args[0]),
    outputPath: path.resolve(process.cwd(), args[0]),
  };
}

async function parse(entryPath) {
  const entry = await import(pathToFileURL(entryPath).href);
  // if (!(entry.default instanceof Microchip)) {
  //   throw new Error(
  //     `Default export of entry point must be an instance of Microchip: is type ${typeof entry.default}`
  //   );
  // }
  return entry.default._getState();
}

const args = process.argv.slice(2);
const { entryPath: entryPath, outputPath: outputPath } = parseArgs(args);

const state = await parse(entryPath);
console.log(state);

for (let [key, value] of state.componentRegistry) {
  console.log(`${key}:`);
  console.log(`\tcomponents: ${value.state.components}`);
  console.log(`\tconnections:`);
  for (let connection of value.state.connections) {
    console.log("\t\t%O", connection.source);
    console.log("\t\t%O\n", connection.destination);
  }
}
// fs.writeFile(outputPath, JSON.stringify(state, null, 2), (err) => {
//   if (err) throw err;
// });

process.exit(0);
