import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

type Direction = "n" | "ne" | "se" | "s" | "sw" | "nw";
// Cube coordinates, see: https://www.redblobgames.com/grids/hexagons/
type Position = [number, number, number];

async function readInput() {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  return input.split(",") as Direction[];
}

function move([q, r, s]: Position, step: Direction): Position {
  switch (step) {
    case "n":
      return [q, r - 1, s + 1];
    case "ne":
      return [q + 1, r - 1, s];
    case "se":
      return [q + 1, r, s - 1];
    case "s":
      return [q, r + 1, s - 1];
    case "sw":
      return [q - 1, r + 1, s];
    case "nw":
      return [q - 1, r, s + 1];
  }
}

function distance([q, r, s]: Position): number {
  return (Math.abs(q) + Math.abs(r) + Math.abs(s)) / 2;
}

function walk(start: Position, steps: Direction[]): Position[] {
  return steps.reduce(
    (positions, step) => [
      ...positions,
      move(positions[positions.length - 1], step),
    ],
    [start]
  );
}

async function solve() {
  const steps = await readInput();

  // First part
  const positions = walk([0, 0, 0], steps);
  assert(distance(positions[positions.length - 1]) === 759);

  // Second part
  assert(Math.max(...positions.map((position) => distance(position))) === 1501);
}

solve();
