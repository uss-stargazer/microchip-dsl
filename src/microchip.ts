import { Signal } from './signal.js';
import {
  GateId,
  ComponentId,
  ComponentStyle,
  getFunctionNamesFromStack,
  countElementsOfTypeInArray,
} from './utils.js';

export type ComponentFunction = (...inputs: Signal[]) => Signal[];
export type GateFunction = (a: Signal, b: Signal) => [Signal]; // Subset of component

export interface Component {
  nInputs: number;
  nOutputs: number;
  state: {
    components: ComponentId[];
    connections: Set<{
      source: Signal; // Source is a signal; this way it can be changed in the future and it will refect in this object
      destination: Signal;
    }>;
  } | null; // Null if gate
  style: Partial<ComponentStyle>;
}

export interface MicrochipState {
  entryComponent: ComponentId;
  componentRegistry: Map<ComponentId, Component>;
}

//-------------------------------------------
// Main class
//-------------------------------------------

export class Microchip {
  private entryComponent: ComponentId | undefined;
  private componentRegistry: Map<ComponentId, Component>;
  private nullWriting: { value: boolean } = { value: false }; // Part of a hacky hack to get the nOutputs by running the function without any elements doing anythin

  constructor() {
    this.entryComponent = undefined;
    this.componentRegistry = new Map();
  }

  public _getState(): MicrochipState {
    if (this.entryComponent === undefined) {
      throw new Error('Cannot get state with an undefined entry component');
    }
    return {
      entryComponent: this.entryComponent,
      componentRegistry: this.componentRegistry,
    };
  }

  public registerGate(
    name: GateId,
    style?: Partial<ComponentStyle>,
  ): GateFunction {
    if (this.componentRegistry.has(name)) {
      throw new Error(`Cannot register the same gate twice: ${name}`);
    }

    const componentRegistryInfo: Component = {
      nInputs: 2,
      nOutputs: 1,
      state: null,
      style: { ...style },
    };
    this.componentRegistry.set(name, componentRegistryInfo);

    const componentRegistry = this.componentRegistry;
    const nullWriting = this.nullWriting;

    // Create mock method
    const mockMethod = function (a: Signal, b: Signal): [Signal] {
      let componentIndex = null;
      if (!nullWriting.value) {
        const parentComponentId = Number(getFunctionNamesFromStack(3)[2]);
        const parentRegistryComponent =
          componentRegistry.get(parentComponentId);

        if (!parentRegistryComponent) {
          throw new Error(
            `ComponentId ${parentComponentId} (parent of ${name}) is not registered`,
          );
        }

        componentIndex =
          parentRegistryComponent.state.components.push(name) - 1;

        [a, b].forEach((input: Signal, idx: number) => {
          parentRegistryComponent.state.connections.add({
            source: input,
            destination: { component: componentIndex!, pin: idx },
          });
        });
      }

      return [{ component: componentIndex, pin: 0 }];
    };
    Object.defineProperty(mockMethod, 'name', { value: name });
    return mockMethod;
  }

  public registerComponent<T extends ComponentFunction>(
    func: T,
    style?: Partial<ComponentStyle>,
  ): T {
    const id = countElementsOfTypeInArray(
      [...this.componentRegistry.keys()],
      'number',
    );

    Object.defineProperty(func, 'name', { value: id.toString() });

    // Parse component to state
    const nInputs = func.length;
    this.nullWriting.value = true;
    const nOutputs = func().length; // Hacky hack to get the n of ouputs by running the function with null
    this.nullWriting.value = false;

    const componentRegistryInfo: Component = {
      nInputs: nInputs,
      nOutputs: nOutputs,
      state: { components: [], connections: new Set() },
      style: { ...style },
    };
    this.componentRegistry.set(id, componentRegistryInfo);

    // We run the function which should add to the registry object's state at runtime
    func(
      ...Array.from({ length: nInputs }, (_, idx: number): Signal => {
        return { component: 'input', pin: idx };
      }),
    ).forEach((output: Signal, idx: number) => {
      componentRegistryInfo.state.connections.add({
        source: output,
        destination: { component: 'output', pin: idx },
      });
    });

    const componentRegistry = this.componentRegistry;
    const nullWriting = this.nullWriting;

    // Create mock method
    const mockMethod = function (...inputs: Signal[]): Signal[] {
      let componentIndex = null;
      if (!nullWriting.value) {
        const parentComponentId = Number(getFunctionNamesFromStack(3)[2]);
        const parentRegistryComponent =
          componentRegistry.get(parentComponentId);

        if (!parentRegistryComponent) {
          throw new Error(
            `ComponentId ${parentComponentId} (parent of ${name}) is not registered`,
          );
        }
        componentIndex = parentRegistryComponent.state.components.push(id) - 1;

        inputs.forEach((input: Signal, idx: number) => {
          parentRegistryComponent.state.connections.add({
            source: input,
            destination: { component: componentIndex!, pin: idx },
          });
        });
      }

      return Array.from(
        { length: componentRegistryInfo.nOutputs },
        (_, idx: number): Signal => {
          return { component: componentIndex, pin: idx };
        },
      );
    } as T;
    Object.defineProperty(mockMethod, 'name', { value: id.toString() });
    return mockMethod;
  }

  public setEntryComponent(component: ComponentFunction): void {
    const id = Number(component.name);
    if (!this.componentRegistry.has(id)) {
      throw new Error(
        `Component '${id}' must be registered before it is set as entry component `,
      );
    }
    this.entryComponent = id;
  }
}
