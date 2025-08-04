import Microchip from "../src/index.js";
import Signal from "../src/signal.js";

const microchip = new Microchip();

const main = microchip.registerComponent(
  "main", // Don't need this: componentdId could just be a number and setting entry could pass in function (setEntryComponent could just consult a map between ids and function pointers)
  (a: Signal, b: Signal): [Signal, Signal] => {
    return [b, a];
  },
  { name: "FancyPants" }
);

microchip.setEntryComponent("main");
export default microchip;
