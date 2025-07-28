import { registerSignal, registerChip, Signal } from "../../src";

function main(a: Signal, b: Signal): [Signal, Signal] {
  registerChip({
    style: {
      name: "The very cool Mr. Fox",
      inputNames: ["Joe ;D", "(￣y▽￣)╭ Ohohoho....."],
      outputNames: ["(┬┬﹏┬┬)", "Johnny"],
      color: "blue",
    },
  });
  return [b, a];
}

export default main;
