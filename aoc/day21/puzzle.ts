import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

type Rules = {
  [pattern: string]: string;
};

async function readInput(): Promise<Rules> {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  return Object.fromEntries(
    input.split("\n").flatMap((line) => {
      const [pattern, rule] = line.split(" => ");
      return variations(pattern).map((variation) => [variation, rule]);
    })
  );
}

function rotations(pattern: string) {
  const tile = pattern.split("/").map((row) => row.split(""));
  const rotations = [tile];
  while (rotations.length < 4) {
    const next = [];
    for (let x = 0; x < tile.length; x++) {
      const column = [];
      for (let y = 0; y < tile.length; y++) {
        column.push(rotations[rotations.length - 1][y][x]);
      }
      next.push(column.reverse());
    }
    rotations.push(next);
  }
  return rotations.map((tile) => tile.map((row) => row.join("")).join("/"));
}

function variations(pattern: string) {
  const flipped = pattern
    .split("/")
    .map((row) => row.split("").reverse().join(""))
    .join("/");
  return rotations(pattern).concat(rotations(flipped));
}

function enlarge(pattern: string, rules: Rules) {
  const rows = pattern.split("/").map((row) => row.split(""));
  if (rows[0].length % 2 === 0) {
    const transformedRows: string[][] = [];
    for (let y = 0; y < rows.length; y += 2) {
      const row: string[] = [];
      for (let x = 0; x < rows[0].length; x += 2) {
        row.push(
          rules[
            `${rows[y][x]}${rows[y][x + 1]}/${rows[y + 1][x]}${
              rows[y + 1][x + 1]
            }`
          ]
        );
      }
      transformedRows.push(row);
    }
    return transformedRows
      .flatMap((row) =>
        row.reduce(
          (strings, row) => {
            const [x, y, z] = row.split("/");
            return [strings[0] + x, strings[1] + y, strings[2] + z];
          },
          ["", "", ""]
        )
      )
      .join("/");
  } else {
    const transformedRows: string[][] = [];
    for (let y = 0; y < rows.length; y += 3) {
      const row: string[] = [];
      for (let x = 0; x < rows[0].length; x += 3) {
        row.push(
          rules[
            `${rows[y][x]}${rows[y][x + 1]}${rows[y][x + 2]}/${rows[y + 1][x]}${
              rows[y + 1][x + 1]
            }${rows[y + 1][x + 2]}/${rows[y + 2][x]}${rows[y + 2][x + 1]}${
              rows[y + 2][x + 2]
            }`
          ]
        );
      }
      transformedRows.push(row);
    }
    return transformedRows
      .flatMap((row) =>
        row.reduce(
          (strings, row) => {
            const [x, y, z, w] = row.split("/");
            return [
              strings[0] + x,
              strings[1] + y,
              strings[2] + z,
              strings[3] + w,
            ];
          },
          ["", "", "", ""]
        )
      )
      .join("/");
  }
}

async function solve() {
  const rules = await readInput();

  const pixels: number[] = [];
  let pattern = ".#./..#/###";
  while (pixels.length < 18) {
    pattern = enlarge(pattern, rules);
    pixels.push(
      pattern
        .split("")
        .reduce((sum, pixel) => (pixel === "#" ? sum + 1 : sum), 0)
    );
  }
  // First part
  assert(pixels[4] == 184);

  // Second part
  assert(pixels[17] == 2810258);
}

solve();
