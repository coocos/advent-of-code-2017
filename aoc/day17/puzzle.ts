import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

async function readInput() {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  return parseInt(input);
}

function spin(steps: number, iterations: number) {
  const buffer: { [key: string]: number } = {
    0: 0,
  };
  let position = 0;
  for (let value = 1; value <= iterations; value++) {
    for (let step = 0; step < steps; step++) {
      position = buffer[position];
    }
    const next = buffer[position];
    buffer[position] = value;
    buffer[value] = next;
    position = value;
  }
  return buffer;
}

async function solve() {
  const steps = await readInput();

  // First part
  assert(spin(steps, 2018)[2017] === 1025);

  // Second part
  assert(spin(steps, 50_000_000)[0] === 37803463);
}

solve();
