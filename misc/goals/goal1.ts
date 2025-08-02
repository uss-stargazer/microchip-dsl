import Microchip from "../../src";
import Signal from "../../src/signal";
import { nullSignal, copySignal } from "../../src/signal";
import { nand, and, or } from "../../src/gates";

Microchip.prototype["afd"] = function (): string {
  return `Hello from ${this.name}!`;
};

const chip = new Microchip();
chip.registerComponents(nand, and, or, srLatch, xor, wack);

function srLatch(s: [Signal], r: [Signal]): [Signal, Signal] {
  const q = nullSignal();
  const qNot = nullSignal();

  copySignal(chip["nand"](s, qNot), q);
  copySignal(chip["nand"](r, q), qNot);

  return [...q, ...qNot];
}

function xor(a: [Signal], b: [Signal]): [Signal] {
  return and(chip["nand"](a, b), or(a, b));
}

function wack(a: [Signal], b: [Signal]): [Signal, Signal] {
  return srLatch(xor(a, b), nullSignal());
}

export default wack;
