import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

interface Program {
  readonly name: string;
  readonly weight: number;
  subprograms: Program[];
}

async function readInput() {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  const subprograms: string[][] = [];
  const programs: { [key: string]: Program } = input
    .split("\n")
    .reduce((programs, line) => {
      const [left, right] = line.split(" -> ");
      const match = /([a-z]+) \((\d+)\)/.exec(left);
      assert(match);
      if (right !== undefined) {
        subprograms.push([match[1], ...right.split(", ")]);
      }
      return {
        ...programs,
        [match[1]]: {
          name: match[1],
          weight: parseInt(match[2]),
          subprograms: [],
        },
      };
    }, {});
  for (const [program, ...subs] of subprograms) {
    programs[program].subprograms = subs.map((name) => programs[name]);
  }
  return programs;
}

function totalWeight(program: Program): number {
  return (
    program.weight +
    program.subprograms.reduce((sum, sub) => sum + totalWeight(sub), 0)
  );
}

function correctWrongWeight(program: Program) {
  let queue = [program];
  const correctedWeights: number[] = [];

  while (queue.length) {
    const program = queue.shift();
    assert(program);
    const weights = program.subprograms.map((program) => totalWeight(program));
    if (new Set(weights).size > 1) {
      const [a, b] = new Set(weights);
      const wrongWeight =
        weights.filter((weight) => weight === a).length > 1 ? b : a;
      const correctWeight = wrongWeight === a ? b : a;
      const wrongProgram =
        program.subprograms[
          weights.findIndex((weight) => weight === wrongWeight)
        ];
      correctedWeights.push(wrongProgram.weight + correctWeight - wrongWeight);
    }
    queue = queue.concat(program.subprograms);
  }
  return correctedWeights.pop();
}

async function solve() {
  const programs = await readInput();

  // First part
  const candidates = Object.values(programs)
    .flatMap((program) => program.subprograms)
    .reduce(
      (programs, subprogram) =>
        programs.filter((program) => program !== subprogram.name),
      Object.keys(programs)
    );
  const root = candidates.pop();
  assert(root === "vgzejbd");

  // Second part
  const weight = correctWrongWeight(programs[root]);
  assert(weight === 1226);
}

solve();
