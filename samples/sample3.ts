import { Microchip, type Signal, nullSignal } from '../src/index.js';

const microchip = new Microchip();
const nand = microchip.registerGate('nand', 2, 1);
const and = microchip.registerGate('and', 2, 1);
const or = microchip.registerGate('or', 2, 1);
const nor = microchip.registerGate('nor', 2, 1);

const xor = microchip.registerComponentSingleOut(
  (a: Signal, b: Signal): Signal => {
    return and(nand(a, b), or(a, b));
  },
);

const main = microchip.registerComponentSingleOut(
  (a: Signal, b: Signal): Signal => {
    const x = xor(nor(a, b), b);
    return or(x, nullSignal());
  },
);

microchip.setEntryComponent(main);
export default microchip;
