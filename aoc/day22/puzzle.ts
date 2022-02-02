import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

type Virus = {
  pos: Vector;
  dir: Vector;
};

type Infected = {
  [hash: string]: "w" | "i" | "f";
};

class Vector {
  constructor(public x: number, public y: number) {}
  hash() {
    return `${this.x},${this.y}`;
  }
  add(vec: Vector) {
    return new Vector(this.x + vec.x, this.y + vec.y);
  }
  right() {
    return new Vector(-this.y, this.x);
  }
  left() {
    return new Vector(this.y, -this.x);
  }
  reverse() {
    return new Vector(-this.x, -this.y);
  }
}

async function readInput(): Promise<[Virus, Infected]> {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  const infected: Infected = {};
  const grid = input.split("\n").map((line) => line.split(""));
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "#") {
        infected[new Vector(x, y).hash()] = "i";
      }
    }
  }
  return [
    {
      pos: new Vector(Math.floor(grid.length / 2), Math.floor(grid.length / 2)),
      dir: new Vector(0, -1),
    },
    infected,
  ];
}

function basicVirus(virus: Virus, infected: Infected) {
  let infectionBursts = 0;
  for (let burst = 0; burst < 10_000; burst++) {
    if (infected[virus.pos.hash()] === "i") {
      virus.dir = virus.dir.right();
      delete infected[virus.pos.hash()];
    } else {
      virus.dir = virus.dir.left();
      infected[virus.pos.hash()] = "i";
      infectionBursts++;
    }
    virus.pos = virus.pos.add(virus.dir);
  }
  return infectionBursts;
}

function evolvedVirus(virus: Virus, infected: Infected) {
  let infectionBursts = 0;
  for (let burst = 0; burst < 10_000_000; burst++) {
    const pos = virus.pos.hash();
    const node = infected[pos];
    if (node === "i") {
      virus.dir = virus.dir.right();
      infected[pos] = "f";
    } else if (node === "w") {
      infectionBursts++;
      infected[pos] = "i";
    } else if (node === "f") {
      virus.dir = virus.dir.reverse();
      delete infected[pos];
    } else {
      virus.dir = virus.dir.left();
      infected[pos] = "w";
    }
    virus.pos = virus.pos.add(virus.dir);
  }
  return infectionBursts;
}

async function solve() {
  const [virus, infected] = await readInput();

  // First part
  assert(basicVirus({ ...virus }, { ...infected }) === 5447);

  // Second part
  assert(evolvedVirus({ ...virus }, { ...infected }) === 2511705);
}

solve();
