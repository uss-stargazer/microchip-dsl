import Microchip, { nullSignal } from '../src/index.js';
const microchip = new Microchip();
const nand = microchip.registerGate('nand');
const and = microchip.registerGate('and');
const or = microchip.registerGate('or');
const nor = microchip.registerGate('nor');
const xor = microchip.registerComponent('xor', (a, b) => {
    return and(...nand(a, b), ...or(a, b));
});
microchip.registerComponent('main', (a, b) => {
    return or(...xor(...nor(a, b), b), nullSignal());
});
microchip.setEntryComponent('main');
export default microchip;
//# sourceMappingURL=sample3.js.map