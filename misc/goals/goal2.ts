import Microchip from "../../src";
import Signal from "../../src/signal";
import { nullSignal } from "../../src/signal";
import { and, nand, nor, or } from "../../src/gates";

const microchip = new Microchip();
microchip.registerComponents(nand, and, or, nor, xor, main);
microchip.setEntryComponent(main);

function xor(a: [Signal], b: [Signal]): [Signal] {
  return and(nand(a, b), or(a, b));
}

function main(a: [Signal], b: [Signal]): [Signal] {
  return or(xor(nor(a, b), b), nullSignal());
}

export default microchip;
