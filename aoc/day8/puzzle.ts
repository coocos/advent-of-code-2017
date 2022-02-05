import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

interface Instruction {
  register: string;
  command: "inc" | "dec";
  value: number;
  condition: {
    register: string;
    comparison: "==" | "!=" | ">" | "<" | ">=" | "<=";
    value: number;
  };
}

async function readInput(): Promise<Instruction[]> {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  return input.split("\n").map((line) => {
    const match =
      /([a-z]+) (inc|dec) (-?\d+) if ([a-z]+) ([<>=!]+) (-?\d+)/.exec(line);
    assert(match);
    return {
      register: match[1],
      command: match[2] as Instruction["command"],
      value: parseInt(match[3]),
      condition: {
        register: match[4],
        comparison: match[5] as Instruction["condition"]["comparison"],
        value: parseInt(match[6]),
      },
    };
  });
}

async function solve() {
  const instructions = await readInput();

  const registers: { [name: string]: number } = instructions.reduce(
    (registers, instruction) => ({
      ...registers,
      [instruction.register]: 0,
      [instruction.condition.register]: 0,
    }),
    {}
  );

  let highestValueEver = 0;

  for (const instruction of instructions) {
    const expression = `${registers[instruction.condition.register]} ${
      instruction.condition.comparison
    } ${instruction.condition.value}`;
    if (eval(expression)) {
      registers[instruction.register] +=
        instruction.value * (instruction.command == "inc" ? 1 : -1);
      highestValueEver = Math.max(
        registers[instruction.register],
        highestValueEver
      );
    }
  }

  // First part
  assert(Math.max(...Object.values(registers)) === 4832);

  // Second part
  assert(highestValueEver === 5443);
}

solve();
