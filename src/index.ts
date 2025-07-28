import * as Parse from "./parse.js";

export { Signal } from "./parse.js";

export function not(a: Parse.Signal): Parse.Signal {
  const notComponentId: Parse.ComponentId = {
    function: "not",
    file: import.meta.filename,
  };

  // Add to component registry
  if (!Parse.intermediateState.componentRegistry.has(notComponentId)) {
    Parse.intermediateState.componentRegistry.set(notComponentId, {
      nInputs: 1,
      nOutputs: 1,
      style: {},
    });
  }

  // Add specific instance to components array
  const componentIndex = Parse.intermediateState.components.length;
  Parse.intermediateState.components.push({
    self: not,
    parent: not.caller,
  });
  // Annotate input Parse.signal
  a._addDestinationComponent({ componentIndex: componentIndex, inputIndex: 0 });
  // Create and annotate return Parse.signal
  const s = new Parse.Signal();
  s._setSourceComponent({ componentIndex: componentIndex, outputIndex: 0 });
  Parse.intermediateState.Parse.signals.push(s);
  return s;
}

export function nand(a: Parse.Signal, b: Parse.Signal): Parse.Signal {
  "use strict";
  // Add to component registry
  if (!Parse.intermediateState.componentRegistry.has(nand))
    Parse.intermediateState.componentRegistry.set(nand, {
      nInputs: 2,
      nOutputs: 1,
      style: {},
    });
  // Add specific instance to components array
  const componentIndex = Parse.intermediateState.components.length;
  Parse.intermediateState.components.push({
    self: nand,
    parent: nand.caller,
  });
  // Annotate input Parse.signals
  a._addDestinationComponent({ componentIndex: componentIndex, inputIndex: 0 });
  b._addDestinationComponent({ componentIndex: componentIndex, inputIndex: 1 });
  // Create and annotate return Parse.signal
  const s = new Parse.Signal();
  s._setSourceComponent({ componentIndex: componentIndex, outputIndex: 0 });
  Parse.intermediateState.Parse.signals.push(s);
  return s;
}

export function and(a: Parse.Signal, b: Parse.Signal): Parse.Signal {
  "use strict";
  // Add to component registry
  if (!Parse.intermediateState.componentRegistry.has(and))
    Parse.intermediateState.componentRegistry.set(and, {
      nInputs: 2,
      nOutputs: 1,
      style: {},
    });
  // Add specific instance to components array
  const componentIndex = Parse.intermediateState.components.length;
  Parse.intermediateState.components.push({
    self: and,
    parent: and.caller,
  });
  // Annotate input Parse.signals
  a._addDestinationComponent({ componentIndex: componentIndex, inputIndex: 0 });
  b._addDestinationComponent({ componentIndex: componentIndex, inputIndex: 1 });
  // Create and annotate return Parse.signal
  const s = new Parse.Signal();
  s._setSourceComponent({ componentIndex: componentIndex, outputIndex: 0 });
  Parse.intermediateState.Parse.signals.push(s);
  return s;
}

export function or(a: Parse.Signal, b: Parse.Signal): Parse.Signal {
  "use strict";
  // Add to component registry
  if (!Parse.intermediateState.componentRegistry.has(or))
    Parse.intermediateState.componentRegistry.set(or, {
      nInputs: 2,
      nOutputs: 1,
      style: {},
    });
  // Add specific instance to components array
  const componentIndex = Parse.intermediateState.components.length;
  Parse.intermediateState.components.push({
    self: or,
    parent: or.caller,
  });
  // Annotate input Parse.signals
  a._addDestinationComponent({ componentIndex: componentIndex, inputIndex: 0 });
  b._addDestinationComponent({ componentIndex: componentIndex, inputIndex: 1 });
  // Create and annotate return Parse.signal
  const s = new Parse.Signal();
  s._setSourceComponent({ componentIndex: componentIndex, outputIndex: 0 });
  Parse.intermediateState.Parse.signals.push(s);
  return s;
}

export function nor(a: Parse.Signal, b: Parse.Signal): Parse.Signal {
  "use strict";
  // Add to component registry
  if (!Parse.intermediateState.componentRegistry.has(nor))
    Parse.intermediateState.componentRegistry.set(nor, {
      nInputs: 2,
      nOutputs: 1,
      style: {},
    });
  // Add specific instance to components array
  const componentIndex = Parse.intermediateState.components.length;
  Parse.intermediateState.components.push({
    self: nor,
    parent: nor.caller,
  });
  // Annotate input Parse.signals
  a._addDestinationComponent({ componentIndex: componentIndex, inputIndex: 0 });
  b._addDestinationComponent({ componentIndex: componentIndex, inputIndex: 1 });
  // Create and annotate return Parse.signal
  const s = new Parse.Signal();
  s._setSourceComponent({ componentIndex: componentIndex, outputIndex: 0 });
  Parse.intermediateState.Parse.signals.push(s);
  return s;
}
