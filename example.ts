import { Microchip, type Signal } from './lib/index.js';

const microchip = new Microchip();

const and = microchip.registerGate('and', 2, 1);
const nand = microchip.registerGate('nand', 2, 1);
const or = microchip.registerGate('or', 2, 1);

const main = microchip.registerChipSingleOut((a: Signal, b: Signal): Signal => {
  return and(or(a, and(b, b)), nand(b, a));
});

microchip.setEntryComponent(main);
export default microchip;
