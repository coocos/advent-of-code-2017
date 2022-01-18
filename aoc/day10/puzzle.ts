import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

interface Node {
  value: number;
  next: Node;
}

async function readInput() {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  return input.split(",").map((value) => parseInt(value));
}

function circularList(size: number) {
  const head: any = {
    value: 0,
  };
  let current = head;
  while (current.value < size - 1) {
    current.next = {
      value: current.value + 1,
    };
    current = current.next;
  }
  current.next = head;
  return head as Node;
}

function denseHash(head: Node) {
  let current = head;
  const denseHash: number[] = [];
  let block: number[] = [];
  for (let i = 0; i <= 256; i++) {
    if (i % 16 === 0) {
      if (block.length > 0) {
        denseHash.push(block.reduce((a, b) => a ^ b));
      }
      block = [];
    }
    block.push(current.value);
    current = current.next;
  }
  return denseHash;
}

function hash(lengths: number[], rounds: number): Node {
  const head = circularList(256);
  let position = head;
  let skip = 0;

  for (let i = 0; i < rounds; i++) {
    lengths.forEach((length) => {
      let current = position;
      const values: number[] = [];
      for (let i = 0; i < length; i++) {
        values.push(current.value);
        current = current.next;
      }
      current = position;
      for (let i = 0; i < length; i++) {
        const value = values.pop();
        assert(value !== undefined);
        current.value = value;
        current = current.next;
      }
      for (let i = 0; i < length + skip; i++) {
        position = position.next;
      }
      skip++;
    });
  }
  return head;
}

async function solve() {
  const lengths = await readInput();

  // First part
  const head = hash(lengths, 1);
  assert(head.value * head.next.value === 8536);

  // Second part
  const asciiLengths = [
    ...lengths
      .join(",")
      .split("")
      .map((letter) => letter.charCodeAt(0)),
    17,
    31,
    73,
    47,
    23,
  ];

  const knotHash = denseHash(hash(asciiLengths, 64))
    .map((number) => number.toString(16).padStart(2, "0"))
    .join("");
  assert(knotHash === "aff593797989d665349efe11bb4fd99b");
}

solve();
