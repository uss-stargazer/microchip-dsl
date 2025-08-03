import { MicrochipState } from "../index.js";
import parse from "./parse.js";

async function build(entryFile: string) {
  const state: MicrochipState = await parse(entryFile);
  console.log(state);
}

const args = process.argv.slice(2);
if (args.length !== 1) {
  process.stderr.write("Invalid args");
  process.exit(1);
}
const entryFile = args[0];
build(entryFile);
