import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

async function readInput() {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  return input.split(",").map((value) => parseInt(value));
}

function sparseHash(input: number[], rounds = 64): number[] {
  const values = Array.from(Array(256).keys());
  let position = 0;
  let skip = 0;
  Array(rounds)
    .fill(input)
    .flat()
    .forEach((byte) => {
      let p1 = position;
      let p2 = position + byte - 1;
      while (p1 < p2) {
        const temp = values[p1 % values.length];
        values[p1 % values.length] = values[p2 % values.length];
        values[p2 % values.length] = temp;
        p1++;
        p2--;
      }
      position = (position + byte + skip) % values.length;
      skip++;
    });
  return values;
}

function hash(input: number[]) {
  const sparse = sparseHash(input);
  const denseHash: number[] = [];
  let block: number[] = [];
  for (let i = 0; i <= 256; i++) {
    if (block.length === 16) {
      denseHash.push(block.reduce((a, b) => a ^ b));
      block = [];
    }
    block.push(sparse[i]);
  }
  return denseHash
    .map((number) => number.toString(16).padStart(2, "0"))
    .join("");
}

async function solve() {
  const input = await readInput();

  // First part
  const [first, second, ...rest] = sparseHash(input, 1);
  assert(first * second === 8536);

  // Second part
  const extendedInput = [
    ...input
      .join(",")
      .split("")
      .map((letter) => letter.charCodeAt(0)),
    17,
    31,
    73,
    47,
    23,
  ];
  assert(hash(extendedInput) === "aff593797989d665349efe11bb4fd99b");
}

solve();
