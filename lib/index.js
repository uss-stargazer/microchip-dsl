import { getComponentIdsFromStack, } from "./utils.js";
//-------------------------------------------
// Main class
//-------------------------------------------
export default class Microchip {
    entryComponent;
    componentRegistry;
    nullWriting = false; // Part of a hacky hack to get the nOutputs by running the function without any elements doing anythin
    constructor() {
        this.entryComponent = undefined;
        this.componentRegistry = new Map();
    }
    _getState() {
        if (!this.entryComponent) {
            throw new Error("Cannot get state with an undefined entry component");
        }
        return {
            entryComponent: this.entryComponent,
            componentRegistry: this.componentRegistry,
        };
    }
    registerComponent(name, func, style) {
        if (this.componentRegistry.has(name)) {
            throw new Error(`Cannot register the same component twice: ${name} function already registered`);
        }
        // Parse component to state
        const nInputs = func.length;
        this.nullWriting = true;
        const nOutputs = func().length; // Hacky hack to get the n of ouputs by running the function with null
        this.nullWriting = false;
        const componentRegistryInfo = {
            nInputs: nInputs,
            nOutputs: nOutputs,
            state: { components: [], connections: new Set() },
            style: { ...style },
        };
        this.componentRegistry.set(name, componentRegistryInfo);
        // We run the function which should add to the registry object's state at runtime
        func(...Array.from({ length: nInputs }, (_, idx) => {
            return { component: -1, pin: idx }; // Component index -1 signifies chip inputs
        })).forEach((output, idx) => {
            componentRegistryInfo.state.connections.add({
                source: output,
                destinationComponentIndex: -2, // Component index -2 signifies chip outputs
                inputIndex: idx,
            });
        });
        // Create mock method
        return ((...inputs) => {
            const parentComponentId = getComponentIdsFromStack()[1];
            const parentRegistryComponent = this.componentRegistry.get(parentComponentId);
            if (!parentRegistryComponent) {
                throw new Error(`Error finding componentId ${parentComponentId} from error stack parsing`);
            }
            const componentIndex = parentRegistryComponent.state.components.push(name) - 1;
            inputs.forEach((input, idx) => {
                if (!this.nullWriting)
                    parentRegistryComponent.state.connections.add({
                        source: input,
                        destinationComponentIndex: componentIndex,
                        inputIndex: idx,
                    });
            });
            return Array.from({ length: parentRegistryComponent.nOutputs }, (_, idx) => {
                return { component: componentIndex, pin: idx };
            });
        });
    }
    registerGate(name, style) {
        if (this.componentRegistry.has(name)) {
            throw new Error(`Cannot register the same gate twice: ${name}`);
        }
        const componentRegistryInfo = {
            nInputs: 2,
            nOutputs: 1,
            state: { components: [], connections: new Set() }, // Null state
            style: { ...style },
        };
        this.componentRegistry.set(name, componentRegistryInfo);
        // Create mock method
        return (a, b) => {
            const parentComponentId = getComponentIdsFromStack()[1];
            const parentRegistryComponent = this.componentRegistry.get(parentComponentId);
            if (!parentRegistryComponent) {
                throw new Error(`Error finding componentId ${parentComponentId} from error stack parsing`);
            }
            const componentIndex = parentRegistryComponent.state.components.push(name) - 1;
            [a, b].forEach((input, idx) => {
                if (!this.nullWriting)
                    parentRegistryComponent.state.connections.add({
                        source: input,
                        destinationComponentIndex: componentIndex,
                        inputIndex: idx,
                    });
            });
            return [{ component: componentIndex, pin: 0 }];
        };
    }
    setEntryComponent(component) {
        if (!this.componentRegistry.has(component)) {
            throw new Error("Component must be registered before it is set as entry component");
        }
        this.entryComponent = component;
    }
}
