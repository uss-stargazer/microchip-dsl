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
} from './component.js';
import { nullSignal, Signal } from './signal.js';
import { getNthFunctionNameUpStack, Tuple } from './utils.js';

export interface MicrochipState {
  rootComponent: ComponentId;
  componentRegistry: Map<ComponentId, Component>;
}

export class Microchip {
  private rootComponent: ComponentId | undefined;
  private componentRegistry: Map<ComponentId, Component>;
  private disableModifications: { value: boolean } = { value: false }; // Part of a hacky hack to get the nOutputs by running the function without any elements doing anythin

  constructor() {
    this.rootComponent = undefined;
    this.componentRegistry = new Map();
  }

  public _getState(): MicrochipState {
    if (this.rootComponent === undefined) {
      throw new Error('Cannot get state with an undefined root component');
    }
    return {
      rootComponent: this.rootComponent,
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
  ): (
    ...inputs: Tuple<Signal, I> /* eslint-disable-line no-unused-vars */
  ) => ComponentFunctionReturn<O> {
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
        // Get the third name up (Call stack looks like `mockMethod` <= `packagedFunc` (see all registerChip implementations) <= `chipThatImplementsThisGate`)
        const parentComponentIdStr = getNthFunctionNameUpStack(2);
        const parentComponentId = Number(parentComponentIdStr);
        if (Number.isNaN(parentComponentId)) {
          throw new Error(
            `Cannot find parent ComponentId for ${name} (function name where id was expected: ${parentComponentIdStr})`,
          );
        }
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
  private _registerChipCore<
    I extends number,
    O extends number,
    T extends ComponentFunction<I, O>,
  >(
    nInputs: I,
    nOutputs: O,
    id: ComponentId,
    func: T,
    style?: Partial<ComponentStyle>,
  ): T {
    Object.defineProperty(func, 'name', { value: id.toString() });

    const mockInputs = Array.from(
      { length: nInputs },
      (_, idx: number): Signal => {
        return { component: 'input', pin: idx };
      },
    ) as Tuple<Signal, I>;

    // Parse component to state
    const componentRegistryInfo: ChipComponent = {
      nInputs: nInputs,
      nOutputs: nOutputs,
      state: { components: [], connections: new Set() },
      style: { ...style },
    };
    this.componentRegistry.set(id, componentRegistryInfo);

    // We run the function which should add to the registry object's state at runtime
    func(...mockInputs).forEach((output: Signal, idx: number) => {
      componentRegistryInfo.state.connections.add({
        source: output,
        destination: { component: 'output', pin: idx },
      });
    });

    const componentRegistry = this.componentRegistry;
    const disableModifications = this.disableModifications;

    // Create mock method
    const mockMethod = function (
      ...inputs: Tuple<Signal, I>
    ): Tuple<Signal, O> {
      let componentIndex = null;
      if (!disableModifications.value) {
        // Get the third name up (Call stack looks like `mockMethod` <= `packagedFunction` (see all registerChip implementations) <= `chipThatImplementsThisChip`)
        const parentComponentId = Number(getNthFunctionNameUpStack(2));
        const parentRegistryComponent = componentRegistry.get(
          parentComponentId,
        ) as ChipComponent;
        if (!parentRegistryComponent) {
          throw new Error(
            `ComponentId ${parentComponentId} (parent of ${id}) is not registered`,
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
      ) as Tuple<Signal, O>;
    };

    Object.defineProperty(mockMethod, 'name', { value: id.toString() });
    return mockMethod as T; // Maybe not mature but at this point idc (TODO: better way?)
  }

  /**
   * Register a *chip*, which is a collection of gates and other chips connected to each
   * other. This method only accepts and returns functions of tuples of input/output signals
   * so if you want to return a signle or no signal, it recommended to use
   * `registerChipSingleOut()` or `registerChipNoOut()`.
   *
   * @param func Function with the implementation of the chip.
   * @param style Optional styling
   * @returns Function for implementing the chip in other chips
   */
  public registerChip<
    I extends number,
    O extends number,
    T extends ComponentFunction<I, O>,
  >(func: T, style?: Partial<ComponentStyle>): T {
    // Get nInputs
    const nInputs = func.length;

    // Get nOutputs by running it with mock and no writing
    const mockInputs: Tuple<Signal, I> = new Array(nInputs).fill(
      nullSignal(),
    ) as Tuple<Signal, I>;
    this.disableModifications.value = true;
    const nOutputs = func(...mockInputs).length;
    this.disableModifications.value = false;

    // Get id
    const id = this.componentRegistry.size;
    Object.defineProperty(func, 'name', { value: id.toString() });

    /* Need to package despite being the same because _registerChipCore expects 
       a wrapper function (to support the single and no versions of this method) */
    const packagedFunc: ComponentFunction<I, O> = function (
      ...inputs: Tuple<Signal, I>
    ): Tuple<Signal, O> {
      return func(...inputs);
    };
    const componentCaller = this._registerChipCore(
      nInputs,
      nOutputs,
      id,
      packagedFunc,
      style,
    );
    const unpackagedComponenetCaller: ComponentFunction<I, O> = function (
      ...inputs: Tuple<Signal, I>
    ): Tuple<Signal, O> {
      return componentCaller(...inputs);
    };

    // Forward component name to unpackaged
    Object.defineProperty(unpackagedComponenetCaller, 'name', {
      value: componentCaller.name,
    });

    return unpackagedComponenetCaller as T; // Maybe a better way to do this? (TODO:)
  }

  /**
   * Register component with a single output (this is an alternative to returning a
   * 1-length tuple with the classic `registerComponenent()`). For more about
   * registering components, see `registerComponenent()`.
   *
   * @param func Function with the implementation of the chip
   * @param style Optional styling
   * @returns Function for implementing the chip in other chips
   */
  public registerChipSingleOut<
    I extends number,
    T extends ComponentFunctionSingleOut<I>,
  >(func: T, style?: Partial<ComponentStyle>): T {
    // Get nInputs and nOutputs
    const nInputs = func.length;
    const nOutputs = 1;

    // Get id
    const id = this.componentRegistry.size;
    Object.defineProperty(func, 'name', { value: id.toString() });

    const packagedFunc: ComponentFunction<I, 1> = function (
      ...inputs: Tuple<Signal, I>
    ): Tuple<Signal, 1> {
      return [func(...inputs)];
    };
    const componentCaller = this._registerChipCore(
      nInputs,
      nOutputs,
      id,
      packagedFunc,
      style,
    );
    const unpackagedComponenetCaller: ComponentFunctionSingleOut<I> = function (
      ...inputs: Tuple<Signal, I>
    ): Signal {
      return componentCaller(...inputs)[0];
    };

    // Forward component name to unpackaged
    Object.defineProperty(unpackagedComponenetCaller, 'name', {
      value: componentCaller.name,
    });

    return unpackagedComponenetCaller as T; // Maybe a better way to do this? (TODO:)
  }

  /**
   * Register component with a no output (this is an alternative to returning a
   * empty tuple with the classic `registerComponenent()`). For more about
   * registering components, see `registerComponenent()`.
   *
   * @param func Function with the implementation of the chip
   * @param style Optional styling
   * @returns Function for implementing the chip in other chips
   */
  public registerChipNoOut<
    I extends number,
    T extends ComponentFunctionNoOut<I>,
  >(func: T, style?: Partial<ComponentStyle>): T {
    // Get nInputs and nOutputs
    const nInputs = func.length;
    const nOutputs = 0;

    // Get id and set func name as id
    const id: ComponentId = this.componentRegistry.size;
    Object.defineProperty(func, 'name', { value: id.toString() });

    const packagedFunc: ComponentFunction<I, 0> = function (
      ...inputs: Tuple<Signal, I>
    ): Tuple<Signal, 0> {
      func(...inputs);
      return [];
    };
    const componentCaller = this._registerChipCore(
      nInputs,
      nOutputs,
      id,
      packagedFunc,
      style,
    );
    const unpackagedComponenetCaller: ComponentFunctionNoOut<I> = function (
      ...inputs: Tuple<Signal, I>
    ): void {
      componentCaller(...inputs);
    };

    // Forward component name to unpackaged
    Object.defineProperty(unpackagedComponenetCaller, 'name', {
      value: componentCaller.name,
    });

    return unpackagedComponenetCaller as T; // Maybe a better way to do this? (TODO:)
  }

  /**
   * Assign base component of the entire microchip. Whatever component (chip or
   * gate) *is* the microchip, if you think of the microchip as a single chip.
   *
   * @param component The root component
   */
  public setRootComponent<I extends number, O extends number>(
    component:
      | ComponentFunction<I, O>
      | ComponentFunctionSingleOut<I>
      | ComponentFunctionNoOut<I>,
  ): void {
    const id = Number(component.name);
    if (!this.componentRegistry.has(id)) {
      throw new Error(
        `Component '${id}' must be registered before it is set as root component `,
      );
    }
    this.rootComponent = id;
  }
}
