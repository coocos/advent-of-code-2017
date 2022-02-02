import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

class Vector {
  constructor(public x: number, public y: number) {}

  add(other: Vector) {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  neighbours() {
    return [
      new Vector(this.x + 1, this.y),
      new Vector(this.x + 1, this.y - 1),
      new Vector(this.x, this.y - 1),
      new Vector(this.x - 1, this.y - 1),
      new Vector(this.x - 1, this.y),
      new Vector(this.x - 1, this.y + 1),
      new Vector(this.x, this.y + 1),
      new Vector(this.x + 1, this.y + 1),
    ];
  }

  hash() {
    return `${this.x},${this.y}`;
  }
}

async function readInput() {
  const seed = await readFile(join(__dirname, "input.txt"), "utf-8");
  return parseInt(seed);
}

const directions = {
  up: {
    step: new Vector(0, -1),
    side: new Vector(-1, 0),
    next: "left" as const,
  },
  left: {
    step: new Vector(-1, 0),
    side: new Vector(0, 1),
    next: "down" as const,
  },
  down: {
    step: new Vector(0, 1),
    side: new Vector(1, 0),
    next: "right" as const,
  },
  right: {
    step: new Vector(1, 0),
    side: new Vector(0, -1),
    next: "up" as const,
  },
};

type Direction = typeof directions["up" | "down" | "left" | "right"];

function firstSpiral(max: number) {
  const visited = new Set(["0,0"]);
  let position = new Vector(1, 0);
  let direction: Direction = directions.up;
  while (visited.size + 1 < max) {
    if (!visited.has(position.add(direction.side).hash())) {
      direction = directions[direction.next];
    } else {
      visited.add(position.hash());
      position = position.add(direction.step);
    }
  }
  return Math.abs(position.x) + Math.abs(position.y);
}

function secondSpiral(max: number) {
  const visited: { [key: string]: number } = {
    "0,0": 1,
    "1,0": 1,
  };
  let position = new Vector(1, 0);
  let direction: Direction = directions.up;
  while (Math.max(...Object.values(visited)) < max) {
    if (!(position.add(direction.side).hash() in visited)) {
      direction = directions[direction.next];
    } else {
      position = position.add(direction.step);
      visited[position.hash()] = position
        .neighbours()
        .filter((neighbour) => neighbour.hash() in visited)
        .reduce((sum, neighbour) => sum + visited[neighbour.hash()], 0);
    }
  }
  return Math.max(...Object.values(visited));
}

async function solve() {
  const input = await readInput();

  // First part
  assert(firstSpiral(input) === 419);

  // Second part
  assert(secondSpiral(input) === 295229);
}

solve();
