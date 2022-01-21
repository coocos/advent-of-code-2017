import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

async function readInput() {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  return input.split("\n").map((line) => {
    const [program, rest] = line.split(" <-> ");
    return [
      parseInt(program),
      ...rest.split(", ").map((prog) => parseInt(prog)),
    ];
  });
}

type Graph = {
  [program: string]: Set<number>;
};

function findGroup(value: number, visited: Set<number>, graph: Graph) {
  for (const link of graph[value]) {
    if (!visited.has(link)) {
      visited.add(link);
      findGroup(link, visited, graph);
    }
  }
  return visited;
}

function constructGraph(links: number[][]) {
  const graph: Graph = {};

  for (const [program, ...linked] of links) {
    graph[program] =
      program in graph
        ? new Set([...linked, ...graph[program]])
        : new Set(linked);
    for (const link of linked) {
      graph[link] =
        link in graph ? new Set([program, ...graph[link]]) : new Set([program]);
    }
  }

  return graph;
}

async function solve() {
  const links = await readInput();
  const graph = constructGraph(links);

  // First part
  const group = findGroup(0, new Set([0]), graph);
  assert(group.size === 239);

  // Second part
  let grouped = new Set<number>();
  let groups = 0;
  for (const program of Object.keys(graph).map((p) => parseInt(p))) {
    if (!grouped.has(program)) {
      grouped = new Set([
        ...grouped,
        ...findGroup(program, new Set([0]), graph),
      ]);
      groups++;
    }
  }
  assert(groups === 215);
}

solve();
