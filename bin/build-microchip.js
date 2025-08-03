#!/usr/bin/env node

/**
 * The scripts for actually building and updating the ui for the project.
 */

import build from "../lib/build/index.js";

const USAGE = "build-microchip [options] <entry_path>";
const HELP = `Usage: ${USAGE}`;

const args = process.argv.slice(2);
var entryFile = null;
args.forEach((arg) => {
  switch (arg) {
    case "--help":
    case "-h":
      process.stdout.write(HELP);
      process.exit(0);

    default:
      if (!entryFile) {
        entryFile = arg;
      } else {
        process.stderr.write(`Invalid args.\nUsage: ${USAGE}`);
        process.exit(1);
      }
  }
});

build(entryFile);
