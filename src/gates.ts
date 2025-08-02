import Signal from "./signal";

export function nand(a: Signal, b: Signal): [Signal] {
  return [[{ component: -10, pin: -10 }]]; // Return doesn't matter
}

export function and(a: Signal, b: Signal): [Signal] {
  return [[{ component: -10, pin: -10 }]]; // Return doesn't matter
}

export function or(a: Signal, b: Signal): [Signal] {
  return [[{ component: -10, pin: -10 }]]; // Return doesn't matter
}

export function nor(a: Signal, b: Signal): [Signal] {
  return [[{ component: -10, pin: -10 }]]; // Return doesn't matter
}
