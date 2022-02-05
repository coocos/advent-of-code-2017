import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

async function readInput() {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  return input.split(" ").map((value) => parseInt(value));
}

function distribute(banks: number[]) {
  let bank = banks.findIndex((blocks) => blocks === Math.max(...banks));
  let blocks = banks[bank];
  banks[bank] = 0;
  while (blocks) {
    banks[++bank % banks.length]++;
    blocks--;
  }
}

function loop(banks: number[]): number {
  const seen = new Set<string>();
  while (!seen.has(banks.join())) {
    seen.add(banks.join());
    distribute(banks);
  }
  return seen.size;
}

async function solve() {
  const banks = await readInput();

  // First part
  assert(loop(banks) === 12841);

  // Second part
  assert(loop(banks) === 8038);
}

solve();
