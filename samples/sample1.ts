import { Microchip, type Signal } from '../lib/index.js';

const microchip = new Microchip();

const fancyPants = microchip.registerComponent(
  (a: Signal, b: Signal): [Signal, Signal] => {
    return [b, a];
  },
  { name: 'FancyPants' },
);

microchip.setEntryComponent(fancyPants);
export default microchip;
