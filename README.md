Microchip Domain Specific Language (DSL)
========================================

A library to create JSON representations of nested electrical circuits in JavaScript/TypeScript.

Example Usage
-------------

```typescript
import { Microchip } from 'microchip-dsl';
import { Signal } from 'microchip-dsl/signal';

const microchip = new Microchip();

const and = microchip.registerGate('and', 2, 1);
const nand = microchip.registerGate('nand', 2, 1);
const or = microchip.registerGate('or', 2, 1);

const main = microchip.registerChipSingleOut((a: Signal, b: Signal): Signal => {
  return and(or(a, and(b, b)), nand(b, a));
});

microchip.setRootComponent(main);
export default microchip;
```