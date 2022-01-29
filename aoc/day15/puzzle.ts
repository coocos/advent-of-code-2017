import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

async function readInput(): Promise<[number, number]> {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  const [a, b] = input.split("\n").map((line) => line.split(" ").pop());
  assert(a !== undefined);
  assert(b !== undefined);
  return [parseInt(a), parseInt(b)];
}

function* random(
  value: number,
  multiplier: number,
  filter: (n: number) => boolean = () => true
) {
  while (true) {
    value = (value * multiplier) % 2147483647;
    if (filter(value)) {
      yield value;
    }
  }
}

async function solve() {
  const [a, b] = await readInput();

  // First part
  const generatorA = random(a, 16807);
  const generatorB = random(b, 48271);
  let matches = 0;
  for (let i = 0; i < 40_000_000; i++) {
    if (
      (generatorA.next().value! & 65535) ===
      (generatorB.next().value! & 65535)
    ) {
      matches++;
    }
  }
  assert(matches === 619);

  // Second part
  const pickyGeneratorA = random(a, 16807, (n) => n % 4 === 0);
  const pickyGeneratorB = random(b, 48271, (n) => n % 8 === 0);
  matches = 0;
  for (let i = 0; i < 5_000_000; i++) {
    if (
      (pickyGeneratorA.next().value! & 65535) ===
      (pickyGeneratorB.next().value! & 65535)
    ) {
      matches++;
    }
  }
  assert(matches === 290);
}

solve();
