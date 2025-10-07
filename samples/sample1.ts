import { Microchip, type Signal } from '../src/index.js';

const microchip = new Microchip();

const fancyPants = microchip.registerChip(
  (a: Signal, b: Signal): [Signal, Signal] => {
    return [b, a];
  },
  { name: 'FancyPants' },
);

microchip.setEntryComponent(fancyPants);
export default microchip;
