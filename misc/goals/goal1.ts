function srLatch(s: Microchip.Signal, r: Microchip.Signal) {
  const q = new Microchip.Signal();
  const qNot = new Microchip.Signal();
  [s, r] = Microchip.registerChip({
    name: "SR Latch",
    inputs: [s, r],
    outputs: [q, qNot],
    inputNames: ["Set", "Reset"],
    outputNames: ["Q", "~Q😊☆*: .｡. o(≧▽≦)o .｡.:*☆"],
  });

  q.setSourceSignal(Microchip.nand(s, qNot));
  qNot.setSourceSignal(Microchip.nand(r, q));

  return [q, qNot];
}

function xor(a: Microchip.Signal, b: Microchip.Signal): Microchip.Signal {
  Microchip.registerChip({});
  return Microchip.and(Microchip.nand(a, b), Microchip.or(a, b));
}

function wack(a: Microchip.Signal, b: Microchip.Signal): Microchip.Signal[] {
  const [q, qNot] = srLatch(xor(a, b), Microchip.registerSignal());
  Microchip.registerChip({
    name: "Main",
    callback: main,
    inputs: [a, b],
    outputs: [q, qNot],
  });
  return [q, qNot];
}

export default wack;
