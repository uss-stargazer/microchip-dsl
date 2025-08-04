import Signal from "./signal.js";
import {
  ComponentId,
  ComponentStyle,
  getComponentIdsFromStack,
} from "./utils.js";

type ComponentFunction = (...inputs: Signal[]) => Signal[];

export interface Component {
  nInputs: number;
  nOutputs: number;
  state: {
    components: ComponentId[];
    connections: Set<{
      source: Signal; // Source is a signal; this way it can be changed in the future and it will refect in this object
      destination: Signal;
    }>;
  };
  style: Partial<ComponentStyle>;
}

type GateId = "nand" | "and" | "or" | "nor";
type GateFunction = (a: Signal, b: Signal) => [Signal];

export interface MicrochipState {
  entryComponent: ComponentId;
  componentRegistry: Map<ComponentId, Component>;
}

//-------------------------------------------
// Main class
//-------------------------------------------

export default class Microchip {
  private entryComponent: ComponentId | undefined;
  private componentRegistry: Map<ComponentId, Component>;
  private nullWriting: boolean = false; // Part of a hacky hack to get the nOutputs by running the function without any elements doing anythin

  constructor() {
    this.entryComponent = undefined;
    this.componentRegistry = new Map();
  }

  public _getState(): MicrochipState {
    if (!this.entryComponent) {
      throw new Error("Cannot get state with an undefined entry component");
    }
    return {
      entryComponent: this.entryComponent,
      componentRegistry: this.componentRegistry,
    };
  }

  public registerGate(
    name: GateId,
    style?: Partial<ComponentStyle>
  ): GateFunction {
    if (this.componentRegistry.has(name)) {
      throw new Error(`Cannot register the same gate twice: ${name}`);
    }

    const componentRegistryInfo: Component = {
      nInputs: 2,
      nOutputs: 1,
      state: { components: [], connections: new Set() }, // Null state
      style: { ...style },
    };
    this.componentRegistry.set(name, componentRegistryInfo);

    const componentRegistry = this.componentRegistry;
    const nullWriting = this.nullWriting;

    // Create mock method
    const mockMethod = function (a: Signal, b: Signal): [Signal] {
      const parentComponentId = getComponentIdsFromStack(2)[1];
      const parentRegistryComponent = componentRegistry.get(parentComponentId);
      if (!parentRegistryComponent) {
        throw new Error(
          `Error finding componentId ${parentComponentId} from error stack parsing`
        );
      }

      const componentIndex = !nullWriting
        ? parentRegistryComponent.state.components.push(name) - 1
        : null;

      [a, b].forEach((input: Signal, idx: number) => {
        if (!nullWriting)
          parentRegistryComponent.state.connections.add({
            source: input,
            destination: { component: componentIndex!, pin: idx },
          });
      });

      return [{ component: componentIndex, pin: 0 }];
    };
    Object.defineProperty(mockMethod, "name", { value: name });
    return mockMethod;
  }

  public registerComponent<T extends ComponentFunction>(
    name: ComponentId,
    func: T,
    style?: Partial<ComponentStyle>
  ): T {
    if (this.componentRegistry.has(name)) {
      throw new Error(
        `Cannot register the same component twice: ${name} function already registered`
      );
    }

    Object.defineProperty(func, "name", { value: name });

    // Parse component to state
    const nInputs = func.length;
    this.nullWriting = true;
    const nOutputs = func().length; // Hacky hack to get the n of ouputs by running the function with null
    this.nullWriting = false;

    const componentRegistryInfo: Component = {
      nInputs: nInputs,
      nOutputs: nOutputs,
      state: { components: [], connections: new Set() },
      style: { ...style },
    };
    this.componentRegistry.set(name, componentRegistryInfo);
    // We run the function which should add to the registry object's state at runtime
    func(
      ...Array.from({ length: nInputs }, (_, idx: number): Signal => {
        return { component: "input", pin: idx };
      })
    ).forEach((output: Signal, idx: number) => {
      componentRegistryInfo.state.connections.add({
        source: output,
        destination: { component: "output", pin: idx },
      });
    });

    const componentRegistry = this.componentRegistry;
    const nullWriting = this.nullWriting;

    // Create mock method
    const mockMethod = function (...inputs: Signal[]): Signal[] {
      const parentComponentId = getComponentIdsFromStack(2)[1];
      const parentRegistryComponent = componentRegistry.get(parentComponentId);
      if (!parentRegistryComponent) {
        throw new Error(
          `Error finding parent component '${parentComponentId}'`
        );
      }
      const componentIndex = !nullWriting
        ? parentRegistryComponent.state.components.push(name) - 1
        : null;

      inputs.forEach((input: Signal, idx: number) => {
        if (!nullWriting)
          parentRegistryComponent.state.connections.add({
            source: input,
            destination: { component: componentIndex!, pin: idx },
          });
      });

      return Array.from(
        { length: parentRegistryComponent.nOutputs },
        (_, idx: number): Signal => {
          return { component: componentIndex, pin: idx };
        }
      );
    } as T;
    Object.defineProperty(mockMethod, "name", { value: name });
    return mockMethod;
  }

  public setEntryComponent(component: ComponentId) {
    if (!this.componentRegistry.has(component)) {
      throw new Error(
        "Component must be registered before it is set as entry component"
      );
    }
    this.entryComponent = component;
  }
}
