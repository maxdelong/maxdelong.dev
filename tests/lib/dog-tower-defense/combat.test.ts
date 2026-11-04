import { describe, expect, it } from "vitest";
import { DOG_COOLDOWN_MS, resolveAttacks } from "@/lib/dog-tower-defense/combat";
import type { Dog, Intruder } from "@/lib/dog-tower-defense/types";

function dogAt(spotId: string, range: number, cooldownMs = 0): Dog {
  return { id: `dog-${spotId}`, spotId, range, cooldownMs };
}

function intruder(id: string, type: "squirrel" | "frog", progress: number, spawnAtMs = 0): Intruder {
  return { id, type, pathProgress: progress, alive: true, spawnAtMs };
}

function aliveById(intruders: Intruder[], id: string) {
  return intruders.find((i) => i.id === id)?.alive;
}

describe("resolveAttacks", () => {
  it("defeats a squirrel within a dog's range and starts the cooldown", () => {
    // spot-1 sits at (100, 60); the squirrel is near (112, 120) at progress 0.1 (~61px away)
    const result = resolveAttacks([dogAt("spot-1", 80)], [intruder("a", "squirrel", 0.1)], 1000, 16);

    expect(aliveById(result.intruders, "a")).toBe(false);
    expect(result.dogs[0].cooldownMs).toBe(DOG_COOLDOWN_MS);
    expect(result.attacks).toHaveLength(1);
  });

  it("defeats a frog within range regardless of type", () => {
    const result = resolveAttacks([dogAt("spot-5", 100)], [intruder("a", "frog", 0.5)], 1000, 16);

    expect(aliveById(result.intruders, "a")).toBe(false);
  });

  it("leaves an intruder outside every dog's range untouched", () => {
    const result = resolveAttacks([dogAt("spot-1", 10)], [intruder("a", "squirrel", 0.9)], 1000, 16);

    expect(aliveById(result.intruders, "a")).toBe(true);
    expect(result.attacks).toEqual([]);
  });

  it("never touches an already-dead intruder", () => {
    const dead: Intruder = { ...intruder("x", "squirrel", 0.45), alive: false };

    const result = resolveAttacks([dogAt("spot-2", 200)], [dead], 1000, 16);

    expect(result.attacks).toEqual([]);
  });

  it("does not attack during cooldown, but counts the cooldown down", () => {
    const result = resolveAttacks([dogAt("spot-1", 80, 500)], [intruder("a", "squirrel", 0.1)], 1000, 100);

    expect(aliveById(result.intruders, "a")).toBe(true);
    expect(result.dogs[0].cooldownMs).toBe(400);
  });

  it("defeats only one intruder per attack, choosing the furthest along", () => {
    const result = resolveAttacks(
      [dogAt("spot-1", 80)],
      [intruder("behind", "squirrel", 0.09), intruder("ahead", "squirrel", 0.11)],
      1000,
      16
    );

    expect(aliveById(result.intruders, "ahead")).toBe(false);
    expect(aliveById(result.intruders, "behind")).toBe(true);
  });

  it("does not let two dogs spend attacks on the same intruder", () => {
    const result = resolveAttacks(
      [dogAt("spot-1", 80), dogAt("spot-3", 400)],
      [intruder("a", "squirrel", 0.1)],
      1000,
      16
    );

    expect(result.attacks).toHaveLength(1);
    expect(result.dogs[1].cooldownMs).toBe(0);
  });

  it("ignores intruders that have not spawned yet", () => {
    const result = resolveAttacks(
      [dogAt("spot-1", 200)],
      [intruder("a", "squirrel", 0, 5000)],
      1000,
      16
    );

    expect(aliveById(result.intruders, "a")).toBe(true);
  });
});
