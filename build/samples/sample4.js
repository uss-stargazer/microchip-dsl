import Microchip, { nullSignal, copySignal } from '../src/index.js';
const microchip = new Microchip();
const nand = microchip.registerGate('nand');
const and = microchip.registerGate('and');
const or = microchip.registerGate('or');
const srLatch = microchip.registerComponent((s, r) => {
    const q = nullSignal();
    const qNot = nullSignal();
    copySignal(...nand(s, qNot), q);
    copySignal(...nand(q, r), qNot);
    return [q, qNot];
}, { name: 'SR Latch', inputNames: ['Set', 'Reset'], outputNames: ['Q', '~Q'] });
const xor = microchip.registerComponent((a, b) => {
    return and(...nand(a, b), ...or(a, b));
});
const wack = microchip.registerComponent((a, b) => {
    return srLatch(...xor(a, b), nullSignal());
});
microchip.setEntryComponent(wack);
export default microchip;
//# sourceMappingURL=sample4.js.map