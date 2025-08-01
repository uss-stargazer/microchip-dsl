import * as ErrorStackParser from "error-stack-parser";

import Signal from "./signal";
import { ComponentId, ComponentStyle, getComponentIdsFromStack } from "./utils";

// Ignore this; only for testing purposes
export const TEST_SETTINGS = {
  overrideParseCheck: false,
};

type ComponentFunction = (...inputs: [Signal][]) => Signal[];

export interface Component {
  nInputs: number;
  nOutputs: number;
  state: {
    components: ComponentId[];
    connections: Set<{
      source: Signal; // Source is a signal; this way it can be changed in the future and it will refect in this object
      destinationComponentIndex: number;
      inputIndex: number;
    }>;
  };
  style: Partial<ComponentStyle>;
}

//-------------------------------------------
// Main class
//-------------------------------------------

export default class Microchip {
  private entryComponent: ComponentId | undefined;
  private componentRegistry: Map<ComponentId, Component>;

  private nullWriting: boolean = false; // Part of a hacky hack to get the nOutputs by running the function without any elements doing anythin

  public __getState(): {
    entryComponent: ComponentId;
    componentRegistry: Map<ComponentId, Component>;
  } {
    if (!this.entryComponent) {
      throw new Error("Entry component must be defined");
    }
    return {
      entryComponent: this.entryComponent,
      componentRegistry: this.componentRegistry,
    };
  }

  public components: Map<ComponentFunction, ComponentFunction>;

  constructor() {
    this.entryComponent = undefined;
    this.componentRegistry = new Map();
    this.components = new Map();
  }

  /**
   * This method parses individual components to `state` and adds a "decorated" method to this class
   */
  public registerComponents(...funcs: ComponentFunction[]) {
    funcs.forEach((component: ComponentFunction) => {
      if (this.componentRegistry.has(component.name)) {
        throw new Error(
          `Cannot register the same component twice: ${component.name} function already registered`
        );
      }

      // Parse component to state
      const nInputs = component.length;
      this.nullWriting = true;
      const nOutputs = component().length; // Hacky hack to get the n of ouputs by running the function with null
      this.nullWriting = false;

      const componentRegistryInfo: Component = {
        nInputs: nInputs,
        nOutputs: nOutputs,
        state: { components: [], connections: new Set() },
        style: {}, // Style will be added when running the function
      };
      this.componentRegistry.set(component.name, componentRegistryInfo);
      // We run the function which should add to the registry object's state at runtime
      component(
        ...Array.from({ length: nInputs }, (_, idx: number): [Signal] => {
          return [{ component: -1, pin: idx }]; // Component index -1 signifies chip inputs
        })
      ).forEach((output: Signal, idx: number) => {
        componentRegistryInfo.state.connections.add({
          source: output,
          destinationComponentIndex: -2, // Component index -2 signifies chip outputs
          inputIndex: idx,
        });
      });

      // Create mock method
      this.components.set(component, (...inputs: [Signal][]): Signal[] => {
        const parentComponentId = getComponentIdsFromStack()[1];
        const parentRegistryComponent =
          this.componentRegistry.get(parentComponentId);
        if (!parentRegistryComponent) {
          throw new Error(
            `Error finding componentId ${parentComponentId} from error stack parsing`
          );
        }
        const componentIndex =
          parentRegistryComponent.state.components.push() - 1;

        inputs.forEach((input: [Signal], idx: number) => {
          if (!this.nullWriting)
            parentRegistryComponent.state.connections.add({
              source: input[0],
              destinationComponentIndex: componentIndex,
              inputIndex: idx,
            });
        });

        return Array.from(
          { length: parentRegistryComponent.nOutputs },
          (_, idx: number): Signal => {
            return { component: componentIndex, pin: idx };
          }
        );
      });
    });
  }

  /**
   * Set
   */
  public setEntryComponent(component: ComponentFunction) {
    if (!this.componentRegistry.has(component.name)) {
      throw new Error(
        "Component must be registered before it is set as entry component"
      );
    }
    this.entryComponent = component.name;
  }

  public setComponentStyle(style: Partial<ComponentStyle>) {
    if (!this.nullWriting) {
      const parentComponentId = getComponentIdsFromStack()[1];
      const parentRegistryComponent =
        this.componentRegistry.get(parentComponentId);
      if (!parentRegistryComponent) {
        throw new Error(
          `Style set: Error finding componentId ${parentComponentId} from error stack parsing`
        );
      }
      parentRegistryComponent.style = style;
    }
  }
}
