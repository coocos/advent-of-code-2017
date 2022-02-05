import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

async function readInput() {
  const input = join(__dirname, "input.txt");
  const lines = await readFile(input, "utf-8");
  return lines.split("\n").map((line) =>
    line
      .split(" ")
      .map((num) => parseInt(num))
      .sort((a, b) => a - b)
  );
}

async function solve() {
  const input = await readInput();

  // First part
  const sum = input.reduce(
    (sum, numbers) => sum + numbers[numbers.length - 1] - numbers[0],
    0
  );
  assert(sum === 39126);

  // Second part
  const divisionSum = input
    .flatMap((numbers) =>
      numbers.map((number) => [
        number,
        numbers.find((other) => number !== other && number % other === 0) ?? 0,
      ])
    )
    .filter(([a, b]) => b !== 0)
    .reduce((sum, [a, b]) => sum + a / b, 0);
  assert(divisionSum === 258);
}

solve();
