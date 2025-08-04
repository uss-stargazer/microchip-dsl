import assert from "node:assert";
import { describe, it } from "node:test";
// import Microchip, { MicrochipState } from "./index.js";

// const results: Map<string, MicrochipState> = new Map([
//   [
//     "sample1",
//     {
//       entryComponent: "main",
//       componentRegistry: new Map([
//         [
//           "main",
//           {
//             nInputs: 2,
//             nOutputs: 2,
//             state: {
//               components: [],
//               connections: new Set([
//                 {
//                   source: { component: "input", pin: 0 },
//                   destination: { component: "output", pin: 1 },
//                 },
//                 {
//                   source: { component: "input", pin: 1 },
//                   destination: { component: "output", pin: 0 },
//                 },
//               ]),
//             },
//             style: { name: "FancyPants" },
//           },
//         ],
//       ]),
//     },
//   ],
//   [
//     "sample2",
//     {
//       entryComponent: "main",
//       componentRegistry: new Map([
//         [
//           "main",
//           {
//             nInputs: 2,
//             nOutputs: 2,
//             state: {
//               components: [],
//               connections: new Set([
//                 {
//                   source: { component: "input", pin: 0 },
//                   destination: { component: "output", pin: 1 },
//                 },
//                 {
//                   source: { component: "input", pin: 1 },
//                   destination: { component: "output", pin: 0 },
//                 },
//               ]),
//             },
//             style: { name: "FancyPants" },
//           },
//         ],
//       ]),
//     },
//   ],
// ]);

describe("Microchip class", async () => {
  // results.forEach(async (expectedState: MicrochipState, sample: string) => {
  //   const sampleImport = await import(`../samples/${sample}.ts`);
  //   it(`should pass ${sample}`, () => {
  //     const microchip = sampleImport.default;
  //     if (!(microchip instanceof Microchip)) {
  //       assert.fail();
  //     }
  //     assert.deepStrictEqual(microchip._getState(), expectedState);
  //   });
  // });
  it("should fail", () => {
    assert.fail();
  });
});
