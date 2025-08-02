import { ComponentIndex, ComponentPinIndex } from "./utils";

/**
 * The base object for digital signals. Signal cans have one source and multiple
 * destinations. A source can be the output pin of any component. Destinations can
 * be any number of input pins on any component, including the source's. It's helpful
 * to think of a Signal as a set of wires that have a single source.
 *
 * A signal without a source can exist; it represents an always-zero signal.
 */
export interface SignalBase {
  component: ComponentIndex | null;
  pin: ComponentPinIndex | null; // Either the input or output pin index, depending on context
}

type Signal = [SignalBase];
export default Signal;

export function nullSignal(): Signal {
  return [{ component: null, pin: null }];
}

export function copySignal(from: Signal, to: Signal) {
  to[0].component = from[0].component;
  to[0].pin = from[0].pin;
}
