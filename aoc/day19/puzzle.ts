import assert from "assert";
import { readFile } from "fs/promises";
import { join } from "path";

type Graph = {
  [pos: string]: Node;
};

type Node = {
  x: number;
  y: number;
  type: string;
};

async function readInput(): Promise<[Graph, Node]> {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  const grid = input.split("\n").map((line) => line.split(""));
  const graph: Graph = {};
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const type = grid[y][x];
      if (type !== " ") {
        graph[[x, y].join()] = {
          x,
          y,
          type,
        };
      }
    }
  }
  return [graph, Object.values(graph).find((node) => node.y === 0)!];
}

async function solve() {
  let [graph, node] = await readInput();

  const letters: string[] = [];
  const visited = new Set<string>();
  let steps = 0;
  let dir = {
    x: 0,
    y: 1,
  };
  while (node) {
    steps++;
    visited.add([node.x, node.y].join());
    if (node.type === "+") {
      for (const [x, y] of [
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0],
      ]) {
        const next: string = [node.x + x, node.y + y].join();
        if (next in graph && !visited.has(next)) {
          node = graph[next];
          dir = { x, y };
          break;
        }
      }
    } else {
      if (/[A-Z]/.test(node.type)) {
        letters.push(node.type);
      }
      node = graph[[node.x + dir.x, node.y + dir.y].join()];
    }
  }
  // First part
  assert(letters.join("") === "QPRYCIOLU");

  // Second part
  assert(steps === 16162);
}

solve();
