import { type Signal } from './Signal.js';
import { type Color, type Tuple } from './utils.js';

export type ComponentId = number;

// Generic/universal ComponentFunction
export type ComponentFunction<I extends number, O extends number> = (
  ...inputs: Tuple<Signal, I>
) => Tuple<Signal, O>;

// Two edge cases for the more generic ComponentFunction
export type ComponentFunctionSingleOut<I extends number> = (
  ...inputs: Tuple<Signal, I>
) => Signal;
export type ComponentFunctionNoOut<I extends number> = (
  ...inputs: Tuple<Signal, I>
) => void;

export type ComponentFunctionReturn<N extends number> = N extends 0
  ? void
  : N extends 1
    ? Signal
    : Tuple<Signal, N>;
export type ComponentFunction<I extends number, O extends number> = (
  ...inputs: Tuple<Signal, I>
) => ComponentFunctionReturn<O>;

export interface ComponentStyle {
  name: string;
  inputNames: string[];
  outputNames: string[];
  color: Color;
}

/**
 * A *component* is reusable item with inputs, outputs, and an internal state that
 * connects wires between the inputs, internal components, and outputs. This can
 * either be a gate or a chip. A *gate* is a component without internal state
 * to be defined in terms of electrical items (resistors, transistors, capacitors,
 * etc.) at runtime. A *chip* is a custom collection of gates and other chips.
 */
export interface Component {
  nInputs: number;
  nOutputs: number;
  state:
    | {
        components: ComponentId[];
        connections: Set<{
          source: Signal; // Source is a signal; this way it can be changed in the future and it will refect in this object (since its a obj)
          destination: Signal;
        }>;
      }
    | string; // string if gate and the state will be defined at runtime (in fact that is the definition of a gate)
  style: Partial<ComponentStyle>;
}

export type GateComponent = Omit<Component, 'state'> & {
  state: string;
};

export type ChipComponent = Omit<Component, 'state'> & {
  state: Extract<Component['state'], object>;
};

export type ComponentIndex = number;
export type ComponentPinIndex = number;
