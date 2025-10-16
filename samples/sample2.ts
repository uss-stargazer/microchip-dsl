import { Microchip } from '../src/index.js';

const microchip = new Microchip();
microchip.registerGate('nand', 2, 1);
microchip.registerGate('and', 2, 1);
microchip.registerGate('or', 2, 1);
microchip.registerGate('nor', 2, 1);

const oboo = microchip.registerChip((): [] => {
  return [];
});

microchip.setRootComponent(oboo);
export default microchip;
