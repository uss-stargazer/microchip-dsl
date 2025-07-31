import { describe, it } from "node:test";
import assert from "node:assert";

import * as Target from "./parse.ts";

Target.TEST_SETTINGS.overrideParseCheck = true;

describe("Code parsing mechanism", () => {
  describe("Chip tracing mechanism", () => {
    it("should resolve import paths", () => {
      assert.strictEqual(
        Target.resolveImportToPath("../misc/goals/goal0.ts"),
        "C:\\Users\\steve\\repos\\microchip\\misc\\goals\\goal0.ts"
      );
    });

    it("should get the file name", () => {
      assert.strictEqual(
        import.meta.filename,
        "C:\\Users\\steve\\repos\\microchip\\src\\parse.test.ts"
      );
    });

    it("should parse stack for function and file names", () => {
      var callerId: Target.ComponentId = { file: "", function: "" };
      var callerParentId: Target.ComponentId = { file: "", function: "" };
      function c() {
        const info = Target.getCallerInfo();
        callerId = info.callerId;
        callerParentId = info.callerParentId;
      }
      function b() {
        c();
      }
      function a() {
        b();
      }
      a();
      assert.deepStrictEqual(callerId, {
        function: "b",
        file: import.meta.filename,
      });
      assert.deepStrictEqual(callerParentId, {
        function: "a",
        file: import.meta.filename,
      });
    });

    it("should throw error when `parse()` is not in stack trace", () => {
      Target.TEST_SETTINGS.overrideParseCheck = false;
      assert.throws(() => Target.getCallerInfo());
      Target.TEST_SETTINGS.overrideParseCheck = true;
    });
  });

  describe("Registering new components", () => {
    function sampleChip(a: Target.Signal, b: Target.Signal): Target.Signal {
      const out = Target.registerSignal();
      Target.registerComponent({
        inputs: [a, b],
        outputs: [out],
        style: {
          name: "Sample chip",
          inputNames: ["inputA", "inputB"],
          outputNames: ["LonelyOut"],
          color: "purple",
        },
      });
      return out;
    }
    function containerChip() {
      const out = sampleChip(new Target.Signal(), new Target.Signal());
      Target.registerComponent({
        inputs: [],
        outputs: [out],
      });
      return out;
    }
    const sampleChipId: Target.ComponentId = {
      function: "sampleChip",
      file: import.meta.filename,
    };
    const sampleChipComponent: Omit<Target.Component, "state"> = {
      nInputs: 2,
      nOutputs: 1,
      style: {
        name: "Sample chip",
        inputNames: ["inputA", "inputB"],
        outputNames: ["LonelyOut"],
        color: "purple",
      },
    };
    const containerChipId: Target.ComponentId = {
      function: "containerChip",
      file: import.meta.filename,
    };
    const containerChipComponent: Omit<Target.Component, "state"> = {
      nInputs: 0,
      nOutputs: 1,
      style: {},
    };

    it("should add nested components to registry", () => {
      Target.intermediateState.componentRegistry = new Map();
      Target.intermediateState.signals = [];
      containerChip();
      if (
        !Target.intermediateState.componentRegistry.has(sampleChipId) ||
        Target.intermediateState.componentRegistry.get(sampleChipId) !==
          sampleChipComponent ||
        !Target.intermediateState.componentRegistry.has(containerChipId) ||
        Target.intermediateState.componentRegistry.get(containerChipId) !==
          containerChipComponent
      ) {
        assert.fail();
      }
    });

    it("should not modify registry if already there", () => {
      Target.intermediateState.componentRegistry = new Map();
      Target.intermediateState.signals = [];
      Target.intermediateState.componentRegistry
        .set(sampleChipId, sampleChipComponent)
        .set(containerChipId, containerChipComponent);
      containerChip();
      if (
        Target.intermediateState.componentRegistry.size != 2 ||
        !Target.intermediateState.componentRegistry.has(sampleChipId) ||
        Target.intermediateState.componentRegistry.get(sampleChipId) !==
          sampleChipComponent
      ) {
        assert.fail();
      }
    });

    it("should throw error if encounters different implementation in registry", () => {
      Target.intermediateState.componentRegistry = new Map();
      Target.intermediateState.signals = [];
      Target.intermediateState.componentRegistry.set(sampleChipId, {
        nInputs: 2,
        nOutputs: 1,
        style: {
          name: "Sample chip",
          inputNames: ["inputA", "inputB"],
          outputNames: ["HappyOut"],
          color: "purple",
        },
      });
      assert.throws(containerChip);
    });
  });

  describe("Intermediate parsing" () => {
    
  })

  it("should return correct results", async () => {
    const state = await Target.parse("@/misc/goals/goal0.ts");
    const mainComponentId: Target.ComponentId = {
      function: "main",
      file: "C:\\Users\\steve\\repos\\microchip\\misc\\goals\\goal0.ts",
    };
    const expectedState: Target.MicrochipState = {
      entryComponent: mainComponentId,
      componentRegistry: new Map([
        [
          mainComponentId,
          {
            nInputs: 2,
            nOutputs: 2,
            state: {
              components: [],
              connections: new Set([
                {
                  sourceComponentIndex: null,
                  outputIndex: 0,
                  destinationComponentIndex: null,
                  inputIndex: 1,
                },
                {
                  sourceComponentIndex: null,
                  outputIndex: 1,
                  destinationComponentIndex: null,
                  inputIndex: 0,
                },
              ]),
            },
            style: {
              name: "The very cool Mr. Fox",
              inputNames: ["Joe ;D", "(￣y▽￣)╭ Ohohoho....."],
              outputNames: ["(┬┬﹏┬┬)", "Johnny"],
              color: "blue",
            },
          },
        ],
      ]),
    };
    assert.strictEqual(state, expectedState);
  });
});
