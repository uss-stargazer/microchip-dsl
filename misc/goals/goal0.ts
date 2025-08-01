import Microchip from "../../src";
import Signal from "../../src/signal";

const microchip = new Microchip();
microchip.registerComponents(main);
microchip.setEntryComponent(main);

function main(a: [Signal], b: [Signal]): [Signal, Signal] {
  return [...b, ...a];
}

export default microchip;
