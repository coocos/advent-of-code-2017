import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

async function readInput() {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  return input.split("\n").map((line) => line.split(" "));
}

type Registers = {
  [key: string]: number;
};

function createRegisters(instructions: string[][]): Registers {
  return instructions.reduce(
    (registers, instruction) =>
      /[a-z]/.test(instruction[1])
        ? {
            ...registers,
            [instruction[1]]: 0,
          }
        : registers,
    {}
  );
}

function* vm(id: number, instructions: string[][], part1 = false) {
  const registers: Registers = {
    ...createRegisters(instructions),
    p: part1 ? 0 : id,
  };

  const registerOrValue = (c: string) =>
    /[a-z]/.test(c) ? registers[c] : parseInt(c);
  const output: number[] = [];
  const input: number[] = [];
  let ip = 0;

  while (ip >= 0 && ip < instructions.length) {
    const [opcode, a, b] = instructions[ip];
    switch (opcode) {
      case "snd":
        output.push(registerOrValue(a));
        yield [input, output];
        ip++;
        break;
      case "set":
        registers[a] = registerOrValue(b);
        ip++;
        break;
      case "add":
        registers[a] += registerOrValue(b);
        ip++;
        break;
      case "mul":
        registers[a] *= registerOrValue(b);
        ip++;
        break;
      case "mod":
        registers[a] %= registerOrValue(b);
        ip++;
        break;
      case "rcv":
        yield [input, output];
        if (part1) {
          if (registerOrValue(a) !== 0) {
            return;
          }
          ip++;
        } else {
          if (input.length) {
            const value = input.shift()!;
            registers[a] = value;
            ip++;
          }
        }
        break;
      case "jgz":
        ip += registerOrValue(a) > 0 ? registerOrValue(b) : 1;
        break;
    }
  }
}

async function solve() {
  const instructions = await readInput();

  // First part
  const soundVm = vm(0, instructions, true);
  const [_, frequencies] = soundVm.next().value ?? [[], []];
  while (!soundVm.next().done) {
    soundVm.next();
  }
  assert(frequencies.pop() === 7071);

  // Second part
  const vm1 = vm(0, instructions);
  const vm2 = vm(1, instructions);
  let sent = 0;
  while (true) {
    const [in0, out0] = vm1.next().value ?? [[], []];
    const [in1, out1] = vm2.next().value ?? [[], []];
    // Deadlock
    if (!out0.length && !out1.length && !in0.length && !in1.length) {
      break;
    }
    while (out0.length) {
      in1.push(out0.shift()!);
    }
    while (out1.length) {
      in0.push(out1.shift()!);
      sent++;
    }
  }
  assert(sent === 8001);
}

solve();
