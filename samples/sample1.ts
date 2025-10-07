import { Microchip, type Signal } from '../src/index.js';

const microchip = new Microchip();

const fancyPants = microchip._registerComponentCore(
  (a: Signal, b: Signal): [Signal, Signal] => {
    return [b, a];
  },
  { name: 'FancyPants' },
);

microchip.setEntryComponent(fancyPants);
export default microchip;
