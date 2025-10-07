import { describe, expect, test } from 'vitest';

import { Microchip, MicrochipState } from '../../src/Microchip.js';
import { Signal } from '../../src/Signal.js';
import { type Component, type ComponentId } from '../../src/Component.js';

describe('Microchip class', async () => {
  const defaultGates: [ComponentId, Component][] = [
    [
      0,
      {
        nInputs: 2,
        nOutputs: 1,
        state: 'nand',
        style: {},
      },
    ],
    [
      1,
      {
        nInputs: 2,
        nOutputs: 1,
        state: 'and',
        style: {},
      },
    ],
    [
      2,
      {
        nInputs: 2,
        nOutputs: 1,
        state: 'or',
        style: {},
      },
    ],
    [
      3,
      {
        nInputs: 2,
        nOutputs: 1,
        state: 'nor',
        style: {},
      },
    ],
  ];

  test.each<[string, MicrochipState]>([
    [
      'sample1',
      {
        entryComponent: 0,
        componentRegistry: new Map([
          [
            0,
            {
              nInputs: 2,
              nOutputs: 2,
              state: {
                components: [],
                connections: new Set([
                  {
                    source: { component: 'input', pin: 0 },
                    destination: { component: 'output', pin: 1 },
                  },
                  {
                    source: { component: 'input', pin: 1 },
                    destination: { component: 'output', pin: 0 },
                  },
                ]),
              },
              style: { name: 'FancyPants' },
            },
          ],
        ]),
      },
    ],
    [
      'sample2',
      {
        entryComponent: 4,
        componentRegistry: new Map([
          ...defaultGates,
          [
            4,
            {
              nInputs: 0,
              nOutputs: 0,
              state: {
                components: [],
                connections: new Set(),
              },
              style: {},
            },
          ],
        ]),
      },
    ],
    [
      'sample3',
      {
        entryComponent: 5,
        componentRegistry: new Map([
          ...defaultGates,
          [
            4,
            {
              nInputs: 2,
              nOutputs: 1,
              state: {
                components: [1, 2, 0],
                connections: new Set<{
                  source: Signal;
                  destination: Signal;
                }>([
                  {
                    source: { component: 'input', pin: 0 },
                    destination: { component: 0, pin: 0 },
                  },
                  {
                    source: { component: 'input', pin: 1 },
                    destination: { component: 0, pin: 1 },
                  },
                  {
                    source: { component: 'input', pin: 0 },
                    destination: { component: 1, pin: 0 },
                  },
                  {
                    source: { component: 'input', pin: 1 },
                    destination: { component: 1, pin: 1 },
                  },
                  {
                    source: { component: 0, pin: 0 },
                    destination: { component: 2, pin: 0 },
                  },
                  {
                    source: { component: 1, pin: 0 },
                    destination: { component: 2, pin: 1 },
                  },
                  {
                    source: { component: 2, pin: 0 },
                    destination: { component: 'output', pin: 0 },
                  },
                ]),
              },
              style: {},
            },
          ],

          [
            5,
            {
              nInputs: 2,
              nOutputs: 1,
              state: {
                components: [3, 4, 2],
                connections: new Set<{
                  source: Signal;
                  destination: Signal;
                }>([
                  {
                    source: { component: 'input', pin: 0 },
                    destination: { component: 0, pin: 0 },
                  },
                  {
                    source: { component: 'input', pin: 1 },
                    destination: { component: 0, pin: 1 },
                  },
                  {
                    source: { component: 0, pin: 0 },
                    destination: { component: 1, pin: 0 },
                  },
                  {
                    source: { component: 'input', pin: 1 },
                    destination: { component: 1, pin: 1 },
                  },
                  {
                    source: { component: 1, pin: 0 },
                    destination: { component: 2, pin: 0 },
                  },
                  {
                    source: { component: null, pin: null },
                    destination: { component: 2, pin: 1 },
                  },
                  {
                    source: { component: 2, pin: 0 },
                    destination: { component: 'output', pin: 0 },
                  },
                ]),
              },
              style: {},
            },
          ],
        ]),
      },
    ],
    [
      'sample4',
      {
        entryComponent: 6,
        componentRegistry: new Map([
          ...defaultGates.slice(0, 3), // Exclude nor gate
          [
            4,
            {
              nInputs: 2,
              nOutputs: 2,
              state: {
                components: [1, 1],
                connections: new Set<{
                  source: Signal;
                  destination: Signal;
                }>([
                  {
                    source: { component: 'input', pin: 0 },
                    destination: { component: 0, pin: 0 },
                  },
                  {
                    source: { component: 'input', pin: 1 },
                    destination: { component: 1, pin: 1 },
                  },

                  {
                    source: { component: 0, pin: 0 },
                    destination: { component: 1, pin: 0 },
                  },
                  {
                    source: { component: 1, pin: 0 },
                    destination: { component: 0, pin: 1 },
                  },
                  {
                    source: { component: 0, pin: 0 },
                    destination: { component: 'output', pin: 0 },
                  },
                  {
                    source: { component: 1, pin: 0 },
                    destination: { component: 'output', pin: 1 },
                  },
                ]),
              },
              style: {
                name: 'SR Latch',
                inputNames: ['Set', 'Reset'],
                outputNames: ['Q', '~Q'],
              },
            },
          ],
          [
            5,
            {
              nInputs: 2,
              nOutputs: 1,
              state: {
                components: [1, 2, 0],
                connections: new Set<{
                  source: Signal;
                  destination: Signal;
                }>([
                  {
                    source: { component: 'input', pin: 0 },
                    destination: { component: 0, pin: 0 },
                  },
                  {
                    source: { component: 'input', pin: 1 },
                    destination: { component: 0, pin: 1 },
                  },
                  {
                    source: { component: 'input', pin: 0 },
                    destination: { component: 1, pin: 0 },
                  },
                  {
                    source: { component: 'input', pin: 1 },
                    destination: { component: 1, pin: 1 },
                  },
                  {
                    source: { component: 0, pin: 0 },
                    destination: { component: 2, pin: 0 },
                  },
                  {
                    source: { component: 1, pin: 0 },
                    destination: { component: 2, pin: 1 },
                  },
                  {
                    source: { component: 2, pin: 0 },
                    destination: { component: 'output', pin: 0 },
                  },
                ]),
              },
              style: {},
            },
          ],

          [
            6,
            {
              nInputs: 2,
              nOutputs: 2,
              state: {
                components: [5, 4],
                connections: new Set<{
                  source: Signal;
                  destination: Signal;
                }>([
                  {
                    source: { component: 'input', pin: 0 },
                    destination: { component: 0, pin: 0 },
                  },
                  {
                    source: { component: 'input', pin: 1 },
                    destination: { component: 0, pin: 1 },
                  },
                  {
                    source: { component: 0, pin: 0 },
                    destination: { component: 1, pin: 0 },
                  },
                  {
                    source: { component: null, pin: null },
                    destination: { component: 1, pin: 1 },
                  },
                  {
                    source: { component: 1, pin: 0 },
                    destination: { component: 'output', pin: 0 },
                  },
                  {
                    source: { component: 1, pin: 1 },
                    destination: { component: 'output', pin: 1 },
                  },
                ]),
              },
              style: {},
            },
          ],
        ]),
      },
    ],
  ])(
    'should pass %s',
    async (sample: string, expectedState: MicrochipState) => {
      const sampleImport = await import(`../../samples/${sample}.ts`);
      const microchip = sampleImport.default;
      expect(microchip).toBeInstanceOf(Microchip);
      const actualState = microchip._getState();
      expect(actualState.entryComponent).toEqual(expectedState.entryComponent);
      expect(actualState.componentRegistry.size).toBe(
        expectedState.componentRegistry.size,
      );
      for (const key of expectedState.componentRegistry.keys()) {
        expect(actualState.componentRegistry.has(key)).toBe(true);
        expect(actualState.componentRegistry.get(key)).toEqual(
          expectedState.componentRegistry.get(key),
        );
      }
    },
  );
});
