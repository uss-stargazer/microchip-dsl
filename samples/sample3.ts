import { Microchip, type Signal, nullSignal } from '../lib/index.js';

const microchip = new Microchip();
const nand = microchip.registerGate('nand');
const and = microchip.registerGate('and');
const or = microchip.registerGate('or');
const nor = microchip.registerGate('nor');

const xor = microchip.registerComponent((a: Signal, b: Signal): [Signal] => {
  return and(...nand(a, b), ...or(a, b));
});

const main = microchip.registerComponent((a: Signal, b: Signal): [Signal] => {
  return or(...xor(...nor(a, b), b), nullSignal());
});

microchip.setEntryComponent(main);
export default microchip;
