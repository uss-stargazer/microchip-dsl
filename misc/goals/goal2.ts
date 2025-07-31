import Microchip from "../../src_old";
import { Signal, registerSignal } from "../../src_old";
import { and, nand, nor, or } from "../../src_old";

const microchip = new Microchip();
microchip.registerComponents(xor, main);
microchip.setEntryComponent(main);

function xor(a: Signal, b: Signal): Signal {
  return and(nand(a, b), or(a, b));
}

function main(a: Signal, b: Signal): Signal {
  return or(xor(nor(a, b), b), registerSignal());
}

export default microchip;
