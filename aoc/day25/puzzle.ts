import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

type State = "A" | "B" | "C" | "D" | "E" | "F";

type Machine = {
  state: State;
  tape: {
    [cell: string]: number;
  };
  cursor: number;
};

type Transitions = {
  [state: string]: (value: number) => [number, number, State];
};

async function readInput() {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  const steps = parseInt(/after (\d+) steps\./.exec(input)![1]);
  const transitions = input
    .split("In state ")
    .slice(1)
    .reduce((transitions, rule) => {
      const lines = rule
        .replace(/[.:]/g, "")
        .split("\n")
        .map((line) => line.split(" ").pop() ?? "");
      return {
        ...transitions,
        [lines[0]]: (value) => {
          if (value === parseInt(lines[1])) {
            return [
              parseInt(lines[2]),
              lines[3] === "left" ? -1 : 1,
              lines[4] as State,
            ];
          } else {
            return [
              parseInt(lines[6]),
              lines[7] === "left" ? -1 : 1,
              lines[8] as State,
            ];
          }
        },
      };
    }, {} as Transitions);
  return [transitions, steps] as const;
}

async function solve() {
  const [transitions, steps] = await readInput();
  const machine: Machine = {
    state: "A",
    tape: {},
    cursor: 0,
  };
  for (let step = 0; step < steps; step++) {
    const [value, move, state] = transitions[machine.state](
      machine.tape[machine.cursor] ?? 0
    );
    machine.tape[machine.cursor] = value;
    machine.cursor += move;
    machine.state = state;
  }

  // First part
  assert(
    Object.values(machine.tape).filter((value) => value === 1).length === 2474
  );
}

solve();
