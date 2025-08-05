import { Microchip, Signal } from '../src/index.js';

const microchip = new Microchip();

const fancyPants = microchip.registerComponent(
  (a: Signal, b: Signal): [Signal, Signal] => {
    return [b, a];
  },
  { name: 'FancyPants' },
);

microchip.setEntryComponent(fancyPants);
export default microchip;
// Don't need this: componentdId could just be a number and setting entry could pass in function (setEntryComponent could just consult a map between ids and function pointers)
