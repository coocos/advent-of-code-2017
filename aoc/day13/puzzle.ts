import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

async function readInput() {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  return input
    .split("\n")
    .map((line) => line.split(": ").map((value) => parseInt(value)));
}

async function solve() {
  const scanners = await readInput();

  // First part
  const severity = scanners
    .filter(([id, range]) => id % ((range - 1) * 2) === 0)
    .reduce((total, [id, range]) => total + id * range, 0);
  assert(severity === 1844);

  // Second part
  let delay = 0;
  while (
    scanners.some(([id, range]) => (delay + id) % ((range - 1) * 2) === 0)
  ) {
    delay++;
  }
  assert(delay === 3897604);
}
solve();
