#!/usr/bin/env node

const HELP = 'Usage: parse-microchip [options] <entry_path> <output_path>';

import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { microchipStateToJson } from '../lib/json.js';

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

const args = process.argv.slice(2);
const { entryPath: entryPath, outputPath: outputPath } = parseArgs(args);

parse(entryPath).then((state) => {
  microchipStateToJson(state, outputPath);
});
