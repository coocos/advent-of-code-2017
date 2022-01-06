import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

async function readInput() {
  const input = join(__dirname, "input.txt");
  const lines = await readFile(input, "utf-8");
  const numbers = lines.split("\n").map((line) =>
    line
      .split(" ")
      .map((num) => parseInt(num))
      .sort((a, b) => a - b)
  );
  return numbers;
}

async function solve() {
  const input = await readInput();

  // First part
  const sum = input.reduce(
    (sum, numbers) => sum + numbers[numbers.length - 1] - numbers[0],
    0
  );
  assert.strictEqual(sum, 39126);

  // Second part
  let divisionSum = 0;
  for (const numbers of input) {
    for (const number of numbers) {
      const divisor = numbers.find(
        (other) => number !== other && number % other === 0
      );
      if (divisor !== undefined) {
        divisionSum += number / divisor;
        break;
      }
    }
  }
  assert.strictEqual(divisionSum, 258);
}

solve();
