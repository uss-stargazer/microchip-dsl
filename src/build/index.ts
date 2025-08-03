import { MicrochipState } from "../index.js";
import parse from "./parse.js";

export default async function build(entryFile: string) {
  const state: MicrochipState = await parse(entryFile);
  console.log(state);
}
