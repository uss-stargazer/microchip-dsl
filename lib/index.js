import * as Parse from "./parse.js";
export { Signal } from "./parse.js";
export function registerSignal() {
    const s = new Parse.Signal();
    Parse.intermediateState.signals.push(s);
    return s;
}
/**
 * This function must be called before any internals of the chip are applied.
 *
 * @param inputs
 * @param outputs
 * @param style
 *
 * @returns
 * n modified input signals
 *
 * @example
 * function xor(in1: Signal, in2: Signal): Signal {
 *    const out = registerSignal();
 *    registerChip({
 *      inputs: [in1, in2],
 *      outputs: [out],
 *      style: { name: "XOR Gate" }
 *    });
 *
 *    return and(or(in1, in2), nand(in1, in2));
 * }
 */
export function registerComponent(info) {
    const { callerId: componentId, callerParentId: parentComponentId } = Parse.getCallerInfo();
    if (!Parse.intermediateState.componentRegistry.has(parentComponentId))
        throw new Error("Parent component is not registered");
    // If not already registered, register
    if (!Parse.intermediateState.componentRegistry.has(componentId)) {
        Parse.intermediateState.componentRegistry.set(componentId, {
            nInputs: info.inputs.length,
            nOutputs: info.outputs.length,
            style: info.style,
        });
    }
    else {
        const currentComponentInfo = {
            nInputs: info.inputs.length,
            nOutputs: info.outputs.length,
            style: info.style,
        };
        if (currentComponentInfo !==
            Parse.intermediateState.componentRegistry.get(componentId))
            throw new Error(`Metadata and internals of '${componentId.function}' in file '${componentId.file}' must be remain constant`);
    }
    // Create new instance of component
    const componentInstance = Parse.intermediateState.components.push({
        self: componentId,
        parent: parentComponentId,
    }) - 1;
    // Annotate inputs and outputs
    info.inputs.forEach((input, idx) => {
        input._addDestination({
            component: componentInstance,
            pin: idx,
            containingComponent,
        });
    });
    // if the parent of the function is parse() from parse.ts
}
export function not(a) {
    "use strict";
    // Add to component registry
    if (!Parse.intermediateState.componentRegistry.has(not))
        Parse.intermediateState.componentRegistry.set(not, {
            nInputs: 1,
            nOutputs: 1,
            style: {},
        });
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
export function nand(a, b) {
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
export function and(a, b) {
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
export function or(a, b) {
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
export function nor(a, b) {
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
