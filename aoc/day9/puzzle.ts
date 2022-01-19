import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

async function readInput() {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  return input;
}

async function solve() {
  const stream = await readInput();

  let depth = 0;
  let pointer = 0;
  let garbage = false;
  let groupScore = 0;
  let garbageScore = 0;

  while (pointer < stream.length) {
    if (!garbage) {
      switch (stream[pointer]) {
        case "{":
          depth += 1;
          break;
        case "}":
          groupScore += depth;
          depth -= 1;
          break;
        case "<":
          garbage = true;
          break;
        default:
          break;
      }
    } else {
      switch (stream[pointer]) {
        case ">":
          garbage = false;
          break;
        case "!":
          pointer += 1;
          break;
        default:
          garbageScore += 1;
          break;
      }
    }
    pointer += 1;
  }

  // First part
  assert(groupScore === 21037);

  // Second part
  assert(garbageScore === 9495);
}

solve();
