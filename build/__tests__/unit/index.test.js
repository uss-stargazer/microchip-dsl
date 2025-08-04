import { describe, expect, test } from 'vitest';
import Microchip from '../../src/index.js';
describe('Microchip class', async () => {
    const defaultGates = [
        [
            'nand',
            {
                isGate: true,
                nInputs: 2,
                nOutputs: 1,
                state: null,
                style: {},
            },
        ],
        [
            'and',
            {
                isGate: true,
                nInputs: 2,
                nOutputs: 1,
                state: null,
                style: {},
            },
        ],
        [
            'or',
            {
                isGate: true,
                nInputs: 2,
                nOutputs: 1,
                state: null,
                style: {},
            },
        ],
        [
            'nor',
            {
                isGate: true,
                nInputs: 2,
                nOutputs: 1,
                state: null,
                style: {},
            },
        ],
    ];
    test.each([
        [
            'sample1',
            {
                entryComponent: 'main',
                componentRegistry: new Map([
                    [
                        'main',
                        {
                            isGate: false,
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
                entryComponent: 'oboo',
                componentRegistry: new Map([
                    [
                        'oboo',
                        {
                            isGate: false,
                            nInputs: 0,
                            nOutputs: 0,
                            state: {
                                components: [],
                                connections: new Set(),
                            },
                            style: {},
                        },
                    ],
                    ...defaultGates,
                ]),
            },
        ],
        [
            'sample3',
            {
                entryComponent: 'main',
                componentRegistry: new Map([
                    [
                        'main',
                        {
                            isGate: false,
                            nInputs: 2,
                            nOutputs: 1,
                            state: {
                                components: ['nor', 'xor', 'or'],
                                connections: new Set([
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
                    [
                        'xor',
                        {
                            isGate: false,
                            nInputs: 2,
                            nOutputs: 1,
                            state: {
                                components: ['nand', 'or', 'and'],
                                connections: new Set([
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
                    ...defaultGates,
                ]),
            },
        ],
        [
            'sample4',
            {
                entryComponent: 'wack',
                componentRegistry: new Map([
                    [
                        'wack',
                        {
                            isGate: false,
                            nInputs: 2,
                            nOutputs: 2,
                            state: {
                                components: ['xor', 'srLatch'],
                                connections: new Set([
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
                    [
                        'xor',
                        {
                            isGate: false,
                            nInputs: 2,
                            nOutputs: 1,
                            state: {
                                components: ['nand', 'or', 'and'],
                                connections: new Set([
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
                        'srLatch',
                        {
                            isGate: false,
                            nInputs: 2,
                            nOutputs: 2,
                            state: {
                                components: ['nand', 'nand'],
                                connections: new Set([
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
                            style: {},
                        },
                    ],
                    ...defaultGates.slice(0, 3), // Exclude nor gate
                ]),
            },
        ],
    ])('should pass %s', async (sample, expectedState) => {
        const sampleImport = await import(`../../samples/${sample}.ts`);
        const microchip = sampleImport.default;
        expect(microchip).toBeInstanceOf(Microchip);
        const actualState = microchip._getState();
        expect(actualState.entryComponent).toEqual(expectedState.entryComponent);
        expect(actualState.componentRegistry.size).toBe(expectedState.componentRegistry.size);
        for (const key of expectedState.componentRegistry.keys()) {
            expect(actualState.componentRegistry.has(key)).toBe(true);
            expect(actualState.componentRegistry.get(key)).toEqual(expectedState.componentRegistry.get(key));
        }
    });
});
//# sourceMappingURL=index.test.js.map