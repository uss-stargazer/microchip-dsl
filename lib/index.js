"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signal = void 0;
exports.registerSignal = registerSignal;
exports.not = not;
exports.nand = nand;
exports.and = and;
exports.or = or;
exports.nor = nor;
exports.registerChip = registerChip;
const parse_1 = require("./parse");
/**
 * The base object for digital signals. Signal cans have one source and multiple
 * destinations. A source can be the output pin of any component. Destinations can
 * be any number of input pins on any component, including the source's. It's helpful
 * to think of a Signal as a set of wires that have a single source.
 *
 * A signal without a source can exist; it represents an always-zero signal.
 */
class Signal {
    sourceComponent;
    destinationComponents = [];
    _setSourceComponent(source) {
        this.sourceComponent = source;
        return this;
    }
    _addDestinationComponent(destination) {
        this.destinationComponents.push(destination);
        return this;
    }
    /**
     * Sets the source component of this signal to the source compononet of `ref`
     * @param ref Signal to copy source from
     */
    setSourceSignal(ref) {
        this.sourceComponent = ref.sourceComponent;
        return this;
    }
}
exports.Signal = Signal;
function registerSignal() {
    const s = new Signal();
    parse_1.intermediateState.signals.push(s);
    return s;
}
// ---------------------------------------------
// nand, and, or, nor gate functions
// ---------------------------------------------
function not(a) {
    "use strict";
    // Add to component registry
    if (!parse_1.intermediateState.componentRegistry.has(not))
        parse_1.intermediateState.componentRegistry.set(not, {
            nInputs: 1,
            nOutputs: 1,
            style: {},
        });
    // Add specific instance to components array
    const componentIndex = parse_1.intermediateState.components.length;
    parse_1.intermediateState.components.push({
        self: not,
        parent: not.caller,
    });
    // Annotate input signal
    a._addDestinationComponent({ componentIndex: componentIndex, inputIndex: 0 });
    // Create and annotate return signal
    const s = new Signal();
    s._setSourceComponent({ componentIndex: componentIndex, outputIndex: 0 });
    parse_1.intermediateState.signals.push(s);
    return s;
}
function nand(a, b) {
    "use strict";
    // Add to component registry
    if (!parse_1.intermediateState.componentRegistry.has(nand))
        parse_1.intermediateState.componentRegistry.set(nand, {
            nInputs: 2,
            nOutputs: 1,
            style: {},
        });
    // Add specific instance to components array
    const componentIndex = parse_1.intermediateState.components.length;
    parse_1.intermediateState.components.push({
        self: nand,
        parent: nand.caller,
    });
    // Annotate input signals
    a._addDestinationComponent({ componentIndex: componentIndex, inputIndex: 0 });
    b._addDestinationComponent({ componentIndex: componentIndex, inputIndex: 1 });
    // Create and annotate return signal
    const s = new Signal();
    s._setSourceComponent({ componentIndex: componentIndex, outputIndex: 0 });
    parse_1.intermediateState.signals.push(s);
    return s;
}
function and(a, b) {
    "use strict";
    // Add to component registry
    if (!parse_1.intermediateState.componentRegistry.has(and))
        parse_1.intermediateState.componentRegistry.set(and, {
            nInputs: 2,
            nOutputs: 1,
            style: {},
        });
    // Add specific instance to components array
    const componentIndex = parse_1.intermediateState.components.length;
    parse_1.intermediateState.components.push({
        self: and,
        parent: and.caller,
    });
    // Annotate input signals
    a._addDestinationComponent({ componentIndex: componentIndex, inputIndex: 0 });
    b._addDestinationComponent({ componentIndex: componentIndex, inputIndex: 1 });
    // Create and annotate return signal
    const s = new Signal();
    s._setSourceComponent({ componentIndex: componentIndex, outputIndex: 0 });
    parse_1.intermediateState.signals.push(s);
    return s;
}
function or(a, b) {
    "use strict";
    // Add to component registry
    if (!parse_1.intermediateState.componentRegistry.has(or))
        parse_1.intermediateState.componentRegistry.set(or, {
            nInputs: 2,
            nOutputs: 1,
            style: {},
        });
    // Add specific instance to components array
    const componentIndex = parse_1.intermediateState.components.length;
}
parse_1.intermediateState.components.push({
    self: or,
    parent: or.caller,
});
// Annotate input signals
a._addDestinationComponent({ componentIndex: componentIndex, inputIndex: 0 });
b._addDestinationComponent({ componentIndex: componentIndex, inputIndex: 1 });
// Create and annotate return signal
const s = new Signal();
s._setSourceComponent({ componentIndex: componentIndex, outputIndex: 0 });
parse_1.intermediateState.signals.push(s);
return s;
function nor(a, b) {
    "use strict";
    // Add to component registry
    if (!parse_1.intermediateState.componentRegistry.has(nor))
        parse_1.intermediateState.componentRegistry.set(nor, {
            nInputs: 2,
            nOutputs: 1,
            style: {},
        });
    // Add specific instance to components array
    const componentIndex = parse_1.intermediateState.components.length;
    parse_1.intermediateState.components.push({
        self: nor,
        parent: nor.caller,
    });
    // Annotate input signals
    a._addDestinationComponent({ componentIndex: componentIndex, inputIndex: 0 });
    b._addDestinationComponent({ componentIndex: componentIndex, inputIndex: 1 });
    // Create and annotate return signal
    const s = new Signal();
    s._setSourceComponent({ componentIndex: componentIndex, outputIndex: 0 });
    parse_1.intermediateState.signals.push(s);
    return s;
}
// ---------------------------------------------
// registerChip function
// ---------------------------------------------
function registerChip(info) {
    // TODO later
}
