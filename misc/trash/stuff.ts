class Super {
  value: string;
}

const a = new Super();
a.value = "Hello! I'm original";
console.log(a.value);

function test(b: Super) {
  console.log(b.value);
  b = new Super();
  b.value = "Goodbye... darkness, my only friend";
  console.log(b.value);
}

test(a);
console.log(a.value);
