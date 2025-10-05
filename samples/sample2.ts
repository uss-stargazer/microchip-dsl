import { Microchip } from '../lib/index.js';

const microchip = new Microchip();
microchip.registerGate('nand');
microchip.registerGate('and');
microchip.registerGate('or');
microchip.registerGate('nor');

const oboo = microchip.registerComponent((): [] => {
  return [];
});

microchip.setEntryComponent(oboo);
export default microchip;
