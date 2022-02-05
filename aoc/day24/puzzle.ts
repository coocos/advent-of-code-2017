import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

type Ports = {
  [port: string]: string[];
};

async function readInput() {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  return input.split("\n").reduce((ports, c) => {
    for (const p of c.split("/")) {
      ports[p] = p in ports ? ports[p].concat(c) : [c];
    }
    return ports;
  }, {} as Ports);
}

function strength(bridge: string[]) {
  return bridge.reduce((sum, component) => {
    const [a, b] = component.split("/").map((port) => parseInt(port));
    return sum + a + b;
  }, 0);
}

function strongestBridge(ports: Ports, bridge = ["0/0"]): number {
  const next = bridge[bridge.length - 1].split("/").pop()!;
  if (!ports[next].length) {
    return strength(bridge);
  }
  return Math.max(
    ...ports[next].map((component) => {
      const [a, b] = component.split("/");
      const flipped = [b, a].join("/");
      return strongestBridge(
        {
          ...ports,
          [a]: ports[a].filter((c) => c !== component && c !== flipped),
          [b]: ports[b].filter((c) => c !== component && c !== flipped),
        },
        bridge.concat(a === next ? component : flipped)
      );
    })
  );
}

function longestBridge(ports: Ports, bridge = ["0/0"]): string[] {
  const next = bridge[bridge.length - 1].split("/").pop()!;
  if (!ports[next].length) {
    return bridge;
  }
  return ports[next].reduce((longest, component) => {
    const [a, b] = component.split("/");
    const flipped = [b, a].join("/");
    const candidate = longestBridge(
      {
        ...ports,
        [a]: ports[a].filter((c) => c !== component && c !== flipped),
        [b]: ports[b].filter((c) => c !== component && c !== flipped),
      },
      bridge.concat(a === next ? component : flipped)
    );
    return candidate.length > longest.length ? candidate : longest;
  }, bridge);
}

async function solve() {
  const ports = await readInput();

  // First part
  assert(strongestBridge(ports) === 1906);

  // Second part
  assert(strength(longestBridge(ports)) === 1824);
}

solve();
