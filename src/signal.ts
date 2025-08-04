import { ComponentIndex, ComponentPinIndex } from './utils.js';

/**
 * The base object for digital signals. Signal cans have one source and multiple
 * destinations. A source can be the output pin of any component. Destinations can
 * be any number of input pins on any component, including the source's. It's helpful
 * to think of a Signal as a set of wires that have a single source.
 *
 * A signal without a source can exist; it represents an always-zero signal.
 */
export interface Signal {
  component: ComponentIndex | 'input' | 'output' | null;
  pin: ComponentPinIndex | null; // Either the input or output pin index, depending on context
}

export function nullSignal(): Signal {
  return { component: null, pin: null };
}

export function copySignal(from: Signal, to: Signal): void {
  to.component = from.component;
  to.pin = from.pin;
}
