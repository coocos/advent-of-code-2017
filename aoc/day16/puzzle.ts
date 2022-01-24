import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

async function readInput() {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  return input.split(",");
}

function dance(moves: string[], programs: string[]) {
  return moves.reduce(
    (programs, move) => {
      switch (move[0]) {
        case "s": {
          const offset = parseInt(move.substring(1));
          programs = programs
            .slice(-offset)
            .concat(programs.slice(0, programs.length - offset));
          break;
        }
        case "x": {
          const [a, b] = move
            .substring(1)
            .split("/")
            .map((c) => parseInt(c));
          const temp = programs[a];
          programs[a] = programs[b];
          programs[b] = temp;
          break;
        }
        case "p": {
          const [a, b] = move
            .substring(1)
            .split("/")
            .map((c) => programs.indexOf(c));
          const temp = programs[a];
          programs[a] = programs[b];
          programs[b] = temp;
          break;
        }
      }
      return [...programs];
    },
    [...programs]
  );
}

function findCycle(moves: string[], programs: string[]): number {
  const seen = new Set<string>();
  while (!seen.has(programs.join(""))) {
    seen.add(programs.join(""));
    programs = dance(moves, programs);
  }
  return seen.size;
}

async function solve() {
  const moves = await readInput();
  let programs = "abcdefghijklmnop".split("");

  // First part
  programs = dance(moves, programs);
  assert(programs.join("") === "kbednhopmfcjilag");

  // Second part
  const cycle = findCycle(moves, programs);
  const totalDances = 1_000_000_000 - 1;
  let position = totalDances - (totalDances % cycle);
  while (position < totalDances) {
    programs = dance(moves, programs);
    position++;
  }
  assert(programs.join("") === "fbmcgdnjakpioelh");
}

solve();
