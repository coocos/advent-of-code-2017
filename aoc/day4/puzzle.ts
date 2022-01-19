import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

async function readInput() {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  const lines = input.split("\n");
  return lines.map((line) => line.split(" "));
}

async function solve() {
  const passphrases = await readInput();

  // First part
  const validForFirstPolicy = passphrases.filter(
    (phrase) => new Set(phrase).size === phrase.length
  );
  assert(validForFirstPolicy.length === 455);

  // Second part
  const validForSecondPolicy = passphrases
    .map((phrase) => phrase.map((word) => Array.from(word).sort().join("")))
    .filter((phrase) => new Set(phrase).size === phrase.length);
  assert(validForSecondPolicy.length === 186);
}

solve();
