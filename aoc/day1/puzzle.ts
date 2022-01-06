import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

async function readInput() {
  const input = join(__dirname, "input.txt");
  return readFile(input, "utf-8");
}

async function solve() {
  const input = await readInput();

  // First part
  let nextSum = 0;
  for (let i = 0; i < input.length; i++) {
    const a = input[i];
    const b = input[i + 1] ?? input[0];
    if (a == b) {
      nextSum += parseInt(a);
    }
  }
  assert.strictEqual(nextSum, 997);

  // Second part
  let halfSum = 0;
  for (let i = 0; i < input.length; i++) {
    const a = input[i];
    const b = input[(i + input.length / 2) % input.length];
    if (a == b) {
      halfSum += parseInt(a);
    }
  }
  assert.strictEqual(halfSum, 1358);
}

solve();
