import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

async function readInput() {
  const input = join(__dirname, "input.txt");
  return readFile(input, "utf-8");
}

async function solve() {
  const input = await readInput();
  assert.strictEqual(input, "");
}

solve();
