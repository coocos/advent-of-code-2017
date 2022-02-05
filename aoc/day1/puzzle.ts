import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

async function readInput() {
  const input = join(__dirname, "input.txt");
  return (await readFile(input, "utf-8")).split("");
}

async function solve() {
  const digits = await readInput();

  // First part
  const nextSum = digits.reduce(
    (sum, value, i) =>
      value === (digits[i + 1] ?? digits[0]) ? sum + parseInt(value) : sum,
    0
  );
  assert(nextSum === 997);

  // Second part
  const halfSum = digits.reduce(
    (sum, value, i) =>
      value === digits[(i + digits.length / 2) % digits.length]
        ? sum + parseInt(value)
        : sum,
    0
  );
  assert(halfSum === 1358);
}

solve();
