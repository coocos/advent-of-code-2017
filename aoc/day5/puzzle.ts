import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

async function readInput() {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  return input.split("\n").map((line) => parseInt(line));
}

function jump(offsets: Array<number>, rule: (x: number) => number): number {
  let index = 0;
  let steps = 0;
  while (index >= 0 && index < offsets.length) {
    const next = index + offsets[index];
    offsets[index] += rule(offsets[index]);
    index = next;
    steps++;
  }
  return steps;
}

async function solve() {
  const offsets = await readInput();

  // First part
  assert(jump([...offsets], () => 1) === 325922);

  // Second part
  assert(jump([...offsets], (x) => (x >= 3 ? -1 : 1)) === 24490906);
}

solve();
