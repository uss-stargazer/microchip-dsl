import {
  Microchip,
  type Signal,
  nullSignal,
  copySignal,
} from '../src/index.js';

const microchip = new Microchip();
const nand = microchip.registerGate('nand', 2, 1);
const and = microchip.registerGate('and', 2, 1);
const or = microchip.registerGate('or', 2, 1);

const srLatch = microchip.registerChip(
  (s: Signal, r: Signal): [Signal, Signal] => {
    const q = nullSignal();
    const qNot = nullSignal();
    copySignal(nand(s, qNot), q);
    copySignal(nand(q, r), qNot);
    return [q, qNot];
  },
  { name: 'SR Latch', inputNames: ['Set', 'Reset'], outputNames: ['Q', '~Q'] },
);

const xor = microchip.registerChipSingleOut((a: Signal, b: Signal): Signal => {
  return and(nand(a, b), or(a, b));
});

const wack = microchip.registerChip(
  (a: Signal, b: Signal): [Signal, Signal] => {
    return srLatch(xor(a, b), nullSignal());
  },
);

microchip.setRootComponent(wack);
export default microchip;
