import * as ErrorStackParser from "error-stack-parser";

import Signal from "./signal";
import {
  Component,
  ComponentId,
  ComponentStyle,
  getComponentIdsFromStack,
} from "./utils";

// Ignore this; only for testing purposes
export const TEST_SETTINGS = {
  overrideParseCheck: false,
};

type ComponentFunction = (...inputs: Signal[]) => void | Signal | Signal[];
interface ComponentInfo {
  function: ComponentFunction;
  style?: Partial<ComponentStyle>;
}

//-------------------------------------------
// Main class
//-------------------------------------------

export default class Microchip {
  private entryComponent: ComponentId;
  private componentRegistry: Map<ComponentId, Component>;

  private nullWriting: boolean = false; // Part of a hacky hack to get the nOutputs by running the function without any elements doing anythin

  public __getState(): {
    entryComponent: ComponentId;
    componentRegistry: Map<ComponentId, Component>;
  } {
    return {
      entryComponent: this.entryComponent,
      componentRegistry: this.componentRegistry,
    };
  }

  public components: Map<ComponentFunction, ComponentFunction>;

  /**
   * This method parses individual components to `state` and adds a "decorated" method to this class
   */
  public registerComponents(...funcs: ComponentInfo[]) {
    funcs.forEach((component: ComponentInfo) => {
      if (this.componentRegistry.has(component.function.name)) {
        throw new Error(
          `Cannot register the same component twice: ${component.function.name} function already registered`
        );
      }

      // Parse component to state
      const nInputs = component.function.length;

      // Hacky hack to get the n of ouputs by running the function with null
      this.nullWriting = true;
      const nOutputs = component.function();
      this.nullWriting = false;

      const componentRegistryInfo: Component = {
        nInputs: nInputs,
        nOutputs: 0, // Default output n until we can determine size of output array
        state: { components: [], connections: new Set() },
        style: { ...component.style },
      };
      this.componentRegistry.set(
        component.function.name,
        componentRegistryInfo
      );
      // We run the function which should add to the registry object's state at runtime
      const output = component.function(
        ...Array.from({ length: nInputs }, (): Signal => {
          return { component: -1, pin: -1 };
        })
      );

      // Create mock method
      this.components.set(
        component.function,
        (...inputs: Signal[]): void | Signal | Signal[] => {
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

          inputs.forEach((signal: Signal, idx: number) => {
            if (!this.nullWriting)
              parentRegistryComponent.state.connections.add({
                sourceComponentIndex: signal.component,
                outputIndex: signal.pin,
                destinationComponentIndex: componentIndex,
                inputIndex: idx,
              });
          });
        }
      );
    });
  }

  /**
   *
   */
  public setEntryComponent(component: ComponentFunction) {}
}
