import { ComponentIndex, ComponentPinIndex } from "./utils";

/**
 * The base object for digital signals. Signal cans have one source and multiple
 * destinations. A source can be the output pin of any component. Destinations can
 * be any number of input pins on any component, including the source's. It's helpful
 * to think of a Signal as a set of wires that have a single source.
 *
 * A signal without a source can exist; it represents an always-zero signal.
 */
export default interface Signal {
  component: ComponentIndex;
  pin: ComponentPinIndex; // Either the input or output pin index, depending on context
}
