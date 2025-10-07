import {
  ChipComponent,
  Component,
  ComponentFunction,
  ComponentFunctionNoOut,
  ComponentFunctionReturn,
  ComponentFunctionSingleOut,
  ComponentId,
  ComponentStyle,
  GateComponent,
} from './Component.js';
import { nullSignal, Signal } from './Signal.js';
import { getFunctionNamesFromStack, Tuple } from './utils.js';

enum ComponentFunctionOutputType {
  TUPLE,
  SINGLE,
  NONE,
}

export interface MicrochipState {
  entryComponent: ComponentId;
  componentRegistry: Map<ComponentId, Component>;
}

export class Microchip {
  private entryComponent: ComponentId | undefined;
  private componentRegistry: Map<ComponentId, Component>;
  private disableModifications: { value: boolean } = { value: false }; // Part of a hacky hack to get the nOutputs by running the function without any elements doing anythin

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

  /**
   * Register a gate component. Common gates are `and`, `nand`, `or`, `nor`, and
   * `xor`, though they don't necessarily have to be for boolean logic.
   *
   * More rigorously, a gate is a component that has implementation/behavior defined
   * at runtime. To convince yourself of this, recall that an `and` gate, for instance,
   * can have be configured in several different ways to achieve the desired behavior:
   * using transistors or using diodes or CMOS or NMOS, etc.
   *
   * @param name Name of the gate; must be unique
   * @param nInputs Number of input pins
   * @param nOutputs Number of output pins
   * @param style Optional styling
   * @returns Function for implementing the gate
   */
  public registerGate<I extends number, O extends number>(
    name: string,
    nInputs: I,
    nOutputs: O,
    style?: Partial<ComponentStyle>,
  ): (...inputs: Tuple<Signal, I>) => ComponentFunctionReturn<O> {
    this.componentRegistry.forEach((value: Component) => {
      if (value.state == name) {
        throw new Error(`Cannot register the same gate twice: ${name}`);
      }
    });

    const id = this.componentRegistry.size;

    const componentRegistryInfo: GateComponent = {
      nInputs: nInputs,
      nOutputs: nOutputs,
      state: name,
      style: { ...style },
    };
    this.componentRegistry.set(id, componentRegistryInfo);

    const componentRegistry = this.componentRegistry;
    const disableModifications = this.disableModifications;

    // Create mock method
    const mockMethod = function (
      ...inputs: Tuple<Signal, I>
    ): ComponentFunctionReturn<O> {
      let componentIndex = null;
      if (!disableModifications.value) {
        // Get the third name up (Call stack looks like `mockMethod` <= `chipThatImplementsThisGate`)
        const parentComponentId = Number(getFunctionNamesFromStack(2)[1]);
        const parentRegistryComponent = componentRegistry.get(
          parentComponentId,
        ) as ChipComponent;

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

      switch (nOutputs) {
        case 0:
          return null;
        case 1:
          return {
            component: componentIndex,
            pin: 0,
          } as Signal as ComponentFunctionReturn<O>;
        default:
          return Array.from(
            { length: componentRegistryInfo.nOutputs },
            (_, idx: number): Signal => {
              return { component: componentIndex, pin: idx };
            },
          ) as Tuple<Signal, O> as ComponentFunctionReturn<O>;
      }
    };

    Object.defineProperty(mockMethod, 'name', { value: name });
    return mockMethod;
  }

  // General implementation of registering a component, i.e. the core
  public _registerComponentCore<
    I extends number,
    O extends number,
    T extends ComponentFunction<I, O>,
  >(
    func: ComponentFunction<I, O>,
    style?: Partial<ComponentStyle>,
  ): ComponentFunction<I, O> {
    // const id = this.componentRegistry.size;
    // Object.defineProperty(func, 'name', { value: id.toString() });

    // const nInputs = func.length;
    // const mockInputs = Array.from(
    //   { length: nInputs },
    //   (_, idx: number): Signal => {
    //     return { component: 'input', pin: idx };
    //   },
    // ) as Tuple<Signal, I>;

    // // Parse component to state
    // this.disableModifications.value = true;
    // const funcOutput = func(...mockInputs); // Hacky hack to get the n of ouputs by running the function with mock
    // this.disableModifications.value = false;
    // const nOutputs = funcOutput.length;
    // const componentRegistryInfo: ChipComponent = {
    //   nInputs: nInputs,
    //   nOutputs: nOutputs,
    //   state: { components: [], connections: new Set() },
    //   style: { ...style },
    // };
    // this.componentRegistry.set(id, componentRegistryInfo);

    // // We run the function which should add to the registry object's state at runtime
    // func(...mockInputs).forEach((output: Signal, idx: number) => {
    //   componentRegistryInfo.state.connections.add({
    //     source: output,
    //     destination: { component: 'output', pin: idx },
    //   });
    // });

    // const componentRegistry = this.componentRegistry;
    // const disableModifications = this.disableModifications;

    // // Create mock method
    // const mockMethod = function (
    //   ...inputs: Tuple<Signal, I>
    // ): Tuple<Signal, O> {
    //   let componentIndex = null;
    //   if (!disableModifications.value) {
    //     // Get the third name up (Call stack looks like `mockMethod` <= `packagedFunction` (see all implementations) <= `chipThatImplementsThisChip`)
    //     const parentComponentId = Number(getFunctionNamesFromStack(3)[2]);
    //     const parentRegistryComponent = componentRegistry.get(
    //       parentComponentId,
    //     ) as ChipComponent;
    //     if (!parentRegistryComponent) {
    //       throw new Error(
    //         `ComponentId ${parentComponentId} (parent of ${name}) is not registered`,
    //       );
    //     }
    //     componentIndex = parentRegistryComponent.state.components.push(id) - 1;
    //     inputs.forEach((input: Signal, idx: number) => {
    //       parentRegistryComponent.state.connections.add({
    //         source: input,
    //         destination: { component: componentIndex!, pin: idx },
    //       });
    //     });
    //   }
    //   return Array.from(
    //     { length: componentRegistryInfo.nOutputs },
    //     (_, idx: number): Signal => {
    //       return { component: componentIndex, pin: idx };
    //     },
    //   ) as Tuple<Signal, O>;
    // };

    // Object.defineProperty(mockMethod, 'name', { value: id.toString() });
    // return mockMethod; // Maybe not mature but at this point idc (TODO: better way?)
    return null;
  }

  /**
   * Register a *chip*, which is a collection of gates and other chips connected to each
   * other. This method only accepts and returns functions of tuples of input/output signals
   * so if you want to return a signle or no signal, it recommended to use
   * `registerComponentSingleOut()` or `registerComponentNoOut()`.
   *
   * @param func Function with the implementation of the chip.
   * @param style Optional styling
   * @returns Function for implementing the chip in other chips
   */
  public registerComponent<
    I extends number,
    O extends number,
    T extends ComponentFunction<I, O>,
  >(func: T, style?: Partial<ComponentStyle>): T {
    console.log('HELLO: ', func.length);
    /* Need to package despite being the same because _registerComponentCore expects 
    a wrapper function (to support the single and no versions of this method) */
    const packagedFunc: ComponentFunction<I, O> = (
      ...inputs: Tuple<Signal, I>
    ): Tuple<Signal, O> => {
      return func(...inputs);
    };
    console.log('WORLD: ', packagedFunc.length);
    const componentCaller = this._registerComponentCore(packagedFunc, style);
    let unpackagedComponenetCaller: ComponentFunction<I, O> = componentCaller;

    return unpackagedComponenetCaller as T; // Maybe a better way to do this? (TODO:)
  }

  // /**
  //  * Register component with a single output (this is an alternative to returning a
  //  * 1-length tuple with the classic `registerComponenent()`). For more about
  //  * registering components, see `registerComponenent()`.
  //  *
  //  * @param func Function with the implementation of the chip
  //  * @param style Optional styling
  //  * @returns Function for implementing the chip in other chips
  //  */
  // public registerComponentSingleOut<
  //   I extends number,
  //   T extends ComponentFunctionSingleOut<I>,
  // >(func: T, style?: Partial<ComponentStyle>): T {
  //   const packagedFunc: ComponentFunction<I, 1> = (
  //     ...inputs: Tuple<Signal, I>
  //   ): Tuple<Signal, 1> => {
  //     return [func(...inputs)];
  //   };
  //   const componentCaller = this.registerComponent(packagedFunc, style);
  //   let unpackagedComponenetCaller: ComponentFunctionSingleOut<I> = (
  //     ...inputs: Tuple<Signal, I>
  //   ): Signal => {
  //     return componentCaller(...inputs)[0];
  //   };

  //   return unpackagedComponenetCaller as T; // Maybe a better way to do this? (TODO:)
  // }

  // /**
  //  * Register component with a no output (this is an alternative to returning a
  //  * empty tuple with the classic `registerComponenent()`). For more about
  //  * registering components, see `registerComponenent()`.
  //  *
  //  * @param func Function with the implementation of the chip
  //  * @param style Optional styling
  //  * @returns Function for implementing the chip in other chips
  //  */
  // public registerComponentNoOut<
  //   I extends number,
  //   T extends ComponentFunctionNoOut<I>,
  // >(func: T, style?: Partial<ComponentStyle>): T {
  //   const packagedFunc: ComponentFunction<I, 0> = (
  //     ...inputs: Tuple<Signal, I>
  //   ): Tuple<Signal, 0> => {
  //     func(...inputs);
  //     return [];
  //   };
  //   const componentCaller = this.registerComponent(packagedFunc, style);
  //   let unpackagedComponenetCaller: ComponentFunctionNoOut<I> = (
  //     ...inputs: Tuple<Signal, I>
  //   ): void => {
  //     componentCaller(...inputs);
  //   };

  //   return unpackagedComponenetCaller as T; // Maybe a better way to do this? (TODO:)
  // }

  public setEntryComponent<I extends number, O extends number>(
    component:
      | ComponentFunction<I, O>
      | ComponentFunctionSingleOut<I>
      | ComponentFunctionNoOut<I>,
  ): void {
    const id = Number(component.name);
    if (!this.componentRegistry.has(id)) {
      throw new Error(
        `Component '${id}' must be registered before it is set as entry component `,
      );
    }
    this.entryComponent = id;
  }
}
