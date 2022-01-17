import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

async function readInput() {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  return input;
}

async function solve() {
  const input = await readInput();
  assert.strictEqual(input, "");
}

solve();
