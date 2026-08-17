import { describe, expect, it } from "vitest";
import { resolveAttacks } from "@/lib/dog-tower-defense/combat";
import type { Dog, Intruder } from "@/lib/dog-tower-defense/types";

function dogAt(spotId: string, range: number): Dog {
  return { id: `dog-${spotId}`, spotId, range };
}

function intruder(type: "squirrel" | "frog", progress: number): Intruder {
  return { id: `${type}-${progress}`, type, pathProgress: progress, alive: true };
}

describe("resolveAttacks", () => {
  it("defeats a squirrel within a dog's range", () => {
    // spot-1 sits at (100, 60); the squirrel is near (112, 120) at progress 0.1 (~61px away)
    const dogs = [dogAt("spot-1", 80)];
    const intruders = [intruder("squirrel", 0.1)];

    const result = resolveAttacks(dogs, intruders);

    expect(result.find((i) => i.id === intruders[0].id)?.alive).toBe(false);
  });

  it("defeats a frog within range regardless of type", () => {
    const dogs = [dogAt("spot-5", 100)];
    const intruders = [intruder("frog", 0.5)];

    const result = resolveAttacks(dogs, intruders);

    expect(result.find((i) => i.id === intruders[0].id)?.alive).toBe(false);
  });

  it("leaves an intruder outside every dog's range untouched", () => {
    const dogs = [dogAt("spot-1", 10)];
    const intruders = [intruder("squirrel", 0.9)];

    const result = resolveAttacks(dogs, intruders);

    expect(result.find((i) => i.id === intruders[0].id)?.alive).toBe(true);
  });

  it("never touches an already-dead intruder", () => {
    const dogs = [dogAt("spot-2", 200)];
    const dead: Intruder = { id: "x", type: "squirrel", pathProgress: 0.45, alive: false };

    const result = resolveAttacks(dogs, [dead]);

    expect(result.find((i) => i.id === "x")?.alive).toBe(false);
  });
});
