import { readFile } from "fs/promises";
import { join } from "path";
import assert from "assert";

type Vector = {
  x: number;
  y: number;
  z: number;
};

type Particles = {
  [id: string]: Particle;
};

class Particle {
  constructor(
    public id: number,
    public p: Vector,
    public v: Vector,
    public a: Vector
  ) {}

  update() {
    this.v.x += this.a.x;
    this.v.y += this.a.y;
    this.v.z += this.a.z;
    this.p.x += this.v.x;
    this.p.y += this.v.y;
    this.p.z += this.v.z;
  }

  hash() {
    return `${this.p.x},${this.p.y},${this.p.z}`;
  }

  distance() {
    return Math.abs(this.p.x) + Math.abs(this.p.y) + Math.abs(this.p.z);
  }
}

async function readInput(): Promise<Particles> {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  return input.split("\n").reduce((particles, line, id) => {
    const [p, v, a] = line.split(", ").map((vec) => {
      const groups = /[pva]=<(-?\d+),(-?\d+),(-?\d+)>/.exec(vec);
      assert(groups);
      return {
        x: parseInt(groups[1]),
        y: parseInt(groups[2]),
        z: parseInt(groups[3]),
      };
    });
    return {
      ...particles,
      [id]: new Particle(id, p, v, a),
    };
  }, {});
}

function closest(particles: Particles) {
  const closestDuringStep: number[] = [];
  while (
    !(
      closestDuringStep.length > 1024 &&
      new Set(closestDuringStep.slice(-1024)).size === 1
    )
  ) {
    Object.values(particles).forEach((particle) => particle.update());
    const closest = Object.values(particles).reduce((closest, particle) => {
      return particle.distance() <= closest.distance() ? particle : closest;
    }, particles[0]);
    closestDuringStep.push(closest.id);
  }
  return closestDuringStep.pop();
}

function withoutCollisions(particles: Particles) {
  const remainingAfterRound: number[] = [];
  while (
    !(
      remainingAfterRound.length > 1024 &&
      new Set(remainingAfterRound.slice(-1024)).size === 1
    )
  ) {
    const collisions: { [hash: string]: Particle[] } = {};
    Object.values(particles).forEach((particle) => {
      if (particle.hash() in collisions) {
        collisions[particle.hash()].push(particle);
      } else {
        collisions[particle.hash()] = [particle];
      }
    });
    Object.values(collisions)
      .flatMap((collided) => (collided.length > 1 ? collided : []))
      .forEach((particle) => {
        delete particles[particle.id];
      });
    remainingAfterRound.push(Object.keys(particles).length);
    Object.values(particles).forEach((particle) => particle.update());
  }
  return remainingAfterRound.pop();
}

async function solve() {
  // First part
  let particles = await readInput();
  assert(closest(particles) === 91);

  // Second part
  particles = await readInput();
  assert(withoutCollisions(particles) === 567);
}

solve();
