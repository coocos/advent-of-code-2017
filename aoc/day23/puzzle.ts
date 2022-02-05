import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

type Registers = {
  [name: string]: number;
};

async function readInput() {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  return input.split("\n").map((line) => line.split(" "));
}

function vm(instructions: string[][]) {
  const registers: Registers = Object.fromEntries(
    "abcdefghijklmnop".split("").map((register) => [register, 0])
  );
  const registerOrValue = (c: string) =>
    /[a-z]/.test(c) ? registers[c] : parseInt(c);
  let ip = 0;
  let mul = 0;
  while (ip >= 0 && ip < instructions.length) {
    const [opcode, a, b] = instructions[ip];
    switch (opcode) {
      case "set":
        registers[a] = registerOrValue(b);
        ip++;
        break;
      case "sub":
        registers[a] -= registerOrValue(b);
        ip++;
        break;
      case "mul":
        registers[a] *= registerOrValue(b);
        mul++;
        ip++;
        break;
      case "jnz":
        ip += registerOrValue(a) !== 0 ? registerOrValue(b) : 1;
        break;
    }
  }
  return mul;
}

async function solve() {
  const instructions = await readInput();

  // First part
  const mul = vm(instructions);
  assert(mul === 6724);

  // Second part - done by converting the assembly
  // code into TypeScript and optimizing the nested
  // loops into higher level operations like using
  // the modulo operator
  let h = 0;
  for (let b = 108400; b <= 125400; b += 17) {
    for (let d = 2; d < b; d++) {
      if (b % d === 0) {
        h++;
        break;
      }
    }
  }
  assert(h === 903);
}

solve();
