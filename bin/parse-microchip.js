#!/usr/bin/env node

const HELP = 'Usage: parse-microchip [options] <entry_path> <output_path>';

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

function parseArgs(args) {
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(HELP);
    process.exit(0);
  }
  if (args.length !== 2) {
    process.stderr.write('Invalid args');
    process.exit(1);
  }
  return {
    entryPath: path.resolve(process.cwd(), args[0]),
    outputPath: path.resolve(process.cwd(), args[1]),
  };
}

async function parse(entryPath) {
  const entry = await import(pathToFileURL(entryPath).href);
  return entry.default._getState();
}

// parital credit: https://stackoverflow.com/a/56150320 (also contains reviver)
function microchipStateReplacer(key, value) {
  if (value instanceof Map) {
    if (key === 'componentRegistry') {
      for (const component of value.values()) {
        if (typeof component.state != "string") {
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

const args = process.argv.slice(2);
const { entryPath: entryPath, outputPath: outputPath } = parseArgs(args);

parse(entryPath).then((state) => {
  // console.dir(state, { depth: null, colors: true });
  fs.writeFile(
    outputPath,
    JSON.stringify(state, microchipStateReplacer, '\t'),
    (err) => {
      if (err) throw err;
    },
  );
  // process.exit(0);
});
