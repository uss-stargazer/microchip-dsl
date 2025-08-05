import { getFunctionNamesFromStack, countElementsOfTypeInArray, } from './utils.js';
export * from './signal.js';
//-------------------------------------------
// Main class
//-------------------------------------------
export default class Microchip {
    entryComponent;
    componentRegistry;
    nullWriting = { value: false }; // Part of a hacky hack to get the nOutputs by running the function without any elements doing anythin
    constructor() {
        this.entryComponent = undefined;
        this.componentRegistry = new Map();
    }
    _getState() {
        if (this.entryComponent === undefined) {
            throw new Error('Cannot get state with an undefined entry component');
        }
        return {
            entryComponent: this.entryComponent,
            componentRegistry: this.componentRegistry,
        };
    }
    registerGate(name, style) {
        if (this.componentRegistry.has(name)) {
            throw new Error(`Cannot register the same gate twice: ${name}`);
        }
        const componentRegistryInfo = {
            nInputs: 2,
            nOutputs: 1,
            state: null,
            style: { ...style },
        };
        this.componentRegistry.set(name, componentRegistryInfo);
        const componentRegistry = this.componentRegistry;
        const nullWriting = this.nullWriting;
        // Create mock method
        const mockMethod = function (a, b) {
            let componentIndex = null;
            if (!nullWriting.value) {
                const parentComponentId = Number(getFunctionNamesFromStack(3)[2]);
                const parentRegistryComponent = componentRegistry.get(parentComponentId);
                if (!parentRegistryComponent) {
                    throw new Error(`ComponentId ${parentComponentId} (parent of ${name}) is not registered`);
                }
                componentIndex =
                    parentRegistryComponent.state.components.push(name) - 1;
                [a, b].forEach((input, idx) => {
                    parentRegistryComponent.state.connections.add({
                        source: input,
                        destination: { component: componentIndex, pin: idx },
                    });
                });
            }
            return [{ component: componentIndex, pin: 0 }];
        };
        Object.defineProperty(mockMethod, 'name', { value: name });
        return mockMethod;
    }
    registerComponent(func, style) {
        const id = countElementsOfTypeInArray([...this.componentRegistry.keys()], 'number');
        Object.defineProperty(func, 'name', { value: id.toString() });
        // Parse component to state
        const nInputs = func.length;
        this.nullWriting.value = true;
        const nOutputs = func().length; // Hacky hack to get the n of ouputs by running the function with null
        this.nullWriting.value = false;
        const componentRegistryInfo = {
            nInputs: nInputs,
            nOutputs: nOutputs,
            state: { components: [], connections: new Set() },
            style: { ...style },
        };
        this.componentRegistry.set(id, componentRegistryInfo);
        // We run the function which should add to the registry object's state at runtime
        func(...Array.from({ length: nInputs }, (_, idx) => {
            return { component: 'input', pin: idx };
        })).forEach((output, idx) => {
            componentRegistryInfo.state.connections.add({
                source: output,
                destination: { component: 'output', pin: idx },
            });
        });
        const componentRegistry = this.componentRegistry;
        const nullWriting = this.nullWriting;
        // Create mock method
        const mockMethod = function (...inputs) {
            let componentIndex = null;
            if (!nullWriting.value) {
                const parentComponentId = Number(getFunctionNamesFromStack(3)[2]);
                const parentRegistryComponent = componentRegistry.get(parentComponentId);
                if (!parentRegistryComponent) {
                    throw new Error(`ComponentId ${parentComponentId} (parent of ${name}) is not registered`);
                }
                componentIndex = parentRegistryComponent.state.components.push(id) - 1;
                inputs.forEach((input, idx) => {
                    parentRegistryComponent.state.connections.add({
                        source: input,
                        destination: { component: componentIndex, pin: idx },
                    });
                });
            }
            return Array.from({ length: componentRegistryInfo.nOutputs }, (_, idx) => {
                return { component: componentIndex, pin: idx };
            });
        };
        Object.defineProperty(mockMethod, 'name', { value: id.toString() });
        return mockMethod;
    }
    setEntryComponent(component) {
        const id = Number(component.name);
        if (!this.componentRegistry.has(id)) {
            throw new Error(`Component '${id}' must be registered before it is set as entry component `);
        }
        this.entryComponent = id;
    }
}
//# sourceMappingURL=index.js.map