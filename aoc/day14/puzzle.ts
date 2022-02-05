import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

async function readInput() {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  return Array.from(Array(128).keys()).map((i) => {
    const row = `${input}-${i}`.split("").map((char) => char.charCodeAt(0));
    return hash(row)
      .split("")
      .flatMap((c) =>
        parseInt(c, 16)
          .toString(2)
          .padStart(4, "0")
          .split("")
          .map((c) => parseInt(c))
      );
  });
}

function hash(input: number[]) {
  const sparse = Array.from(Array(256).keys());
  let position = 0;
  let skip = 0;
  Array(64)
    .fill([...input, 17, 31, 73, 47, 23])
    .flat()
    .forEach((byte) => {
      let p1 = position;
      let p2 = position + byte - 1;
      while (p1 < p2) {
        const temp = sparse[p1 % sparse.length];
        sparse[p1 % sparse.length] = sparse[p2 % sparse.length];
        sparse[p2 % sparse.length] = temp;
        p1++;
        p2--;
      }
      position = (position + byte + skip) % sparse.length;
      skip++;
    });
  const dense: number[] = [];
  let block: number[] = [];
  for (let i = 0; i <= 256; i++) {
    if (block.length === 16) {
      dense.push(block.reduce((a, b) => a ^ b));
      block = [];
    }
    block.push(sparse[i]);
  }
  return dense.map((number) => number.toString(16).padStart(2, "0")).join("");
}

function searchRegion(
  [x, y]: [number, number],
  grid: number[][],
  visited: Set<string>
) {
  if (
    x < 0 ||
    x >= 128 ||
    y < 0 ||
    y >= 128 ||
    grid[y][x] !== 1 ||
    visited.has([x, y].join())
  ) {
    return;
  }
  visited.add([x, y].join());
  const neighbours = [
    [x, y - 1],
    [x + 1, y],
    [x, y + 1],
    [x - 1, y],
  ];
  for (const [x, y] of neighbours) {
    searchRegion([x, y], grid, visited);
  }
}

async function solve() {
  const grid = await readInput();

  // First part
  const used = grid.reduce(
    (count, row) => count + row.filter((bit) => bit === 1).length,
    0
  );
  assert(used === 8292);

  // Second part
  let regions = 0;
  const visited = new Set<string>();
  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 128; x++) {
      const point: [number, number] = [x, y];
      if (grid[y][x] === 1 && !visited.has(point.join())) {
        searchRegion(point, grid, visited);
        regions++;
      }
    }
  }
  assert(regions === 1069);
}

solve();
