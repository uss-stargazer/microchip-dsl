import Microchip from "../src/index.js";
import Signal, { nullSignal, copySignal } from "../src/signal.js";

const microchip = new Microchip();
const nand = microchip.registerGate("nand");
const and = microchip.registerGate("and");
const or = microchip.registerGate("or");

const srLatch = microchip.registerComponent(
  "srLatch",
  (s: Signal, r: Signal): [Signal, Signal] => {
    const q = nullSignal();
    const qNot = nullSignal();

    copySignal(...nand(s, qNot), q);
    copySignal(...nand(r, q), qNot);

    return [q, qNot];
  }
);

const xor = microchip.registerComponent(
  "xor",
  (a: Signal, b: Signal): [Signal] => {
    return and(...nand(a, b), ...or(a, b));
  }
);

microchip.registerComponent(
  "wack",
  (a: Signal, b: Signal): [Signal, Signal] => {
    return srLatch(...xor(a, b), nullSignal());
  }
);

microchip.setEntryComponent("wack");
export default microchip;
