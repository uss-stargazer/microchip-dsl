import Microchip from "../../src";
import Signal from "../../src/signal";
import { nullSignal } from "../../src/signal";
import { nand, and, or, nor } from "../../src/gates";

const microchip = new Microchip();

const xor = microchip.registerComponent<(a: Signal, b: Signal) => [Signal]>(
  "xor",
  (a: Signal, b: Signal): [Signal] => {
    return and(...nand(a, b), ...or(a, b));
  }
);

const main = microchip.registerComponent(
  "main",
  (a: Signal, b: Signal): [Signal] => {
    return or(...xor(...nor(a, b), b), nullSignal());
  }
);

microchip.setEntryComponent("main");
export default microchip;
