import Microchip, { nullSignal, copySignal } from '../src/index.js';
const microchip = new Microchip();
const nand = microchip.registerGate('nand');
const and = microchip.registerGate('and');
const or = microchip.registerGate('or');
const srLatch = microchip.registerComponent('srLatch', (s, r) => {
  const q = nullSignal();
  const qNot = nullSignal();
  copySignal(...nand(s, qNot), q);
  copySignal(...nand(q, r), qNot);
  return [q, qNot];
});
const xor = microchip.registerComponent('xor', (a, b) => {
  return and(...nand(a, b), ...or(a, b));
});
microchip.registerComponent('wack', (a, b) => {
  return srLatch(...xor(a, b), nullSignal());
});
microchip.setEntryComponent('wack');
export default microchip;
//# sourceMappingURL=sample4.js.map
