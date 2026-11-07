import { describe, expect, it } from "vitest";
import { BREEDS, BREED_LIST, MAX_TIER, singleTargetDps, statsFor } from "@/lib/dog-tower-defense/breeds";
import { STARTING_LIVES } from "@/lib/dog-tower-defense/gameState";
import { play, planPolicy, singleBreedPolicy, type PlanStep } from "./bot";

const SLOW_TEST_MS = 120_000;

const up = (upgrade: number, path: 0 | 1, n = 1): PlanStep[] =>
  Array.from({ length: n }, () => ({ upgrade, path }));

const SHEPHERD_LED: PlanStep[] = [
  { buy: "beagle" },
  { buy: "labrador" },
  ...up(0, 1),
  { buy: "shepherd" },
  ...up(2, 1, 2),
  { buy: "husky" },
  ...up(1, 0, 2),
  { buy: "shepherd" },
  ...up(3, 0, 2),
  ...up(4, 1, 2),
  { buy: "corgi" },
  ...up(5, 0, 2),
  { buy: "shepherd" },
  ...up(6, 1, 2),
  ...up(2, 1),
  ...up(4, 0),
  { buy: "shepherd" },
  { buy: "shepherd" },
];

const ECONOMY: PlanStep[] = [
  { buy: "beagle" },
  { buy: "chihuahua" },
  ...up(0, 1),
  { buy: "golden" },
  { buy: "labrador" },
  { buy: "golden" },
  ...up(2, 0, 2),
  ...up(4, 0, 2),
  { buy: "shepherd" },
  ...up(5, 1, 2),
  { buy: "shepherd" },
  ...up(6, 1, 3),
  ...up(5, 0),
  { buy: "husky" },
  { buy: "shepherd" },
  ...up(8, 1, 2),
  { buy: "shepherd" },
  ...up(9, 1, 2),
];

const NO_SHEPHERDS: PlanStep[] = [
  { buy: "beagle" },
  { buy: "labrador" },
  ...up(0, 1),
  { buy: "chihuahua" },
  { buy: "golden" },
  ...up(1, 0, 2),
  { buy: "husky" },
  ...up(4, 0, 2),
  { buy: "labrador" },
  ...up(5, 1, 2),
  { buy: "beagle" },
  ...up(6, 1, 2),
  { buy: "corgi" },
  ...up(7, 0, 2),
  ...up(1, 0),
  ...up(4, 0),
  { buy: "husky" },
  ...up(8, 0, 2),
  { buy: "labrador" },
  ...up(9, 0, 3),
  { buy: "husky" },
  ...up(10, 0, 3),
  { buy: "labrador" },
  ...up(11, 0, 3),
  { buy: "husky" },
  ...up(12, 0, 3),
];

describe("the German Shepherd is the best breed", () => {
  const tiers: [number, number][] = [[0, 0], [1, 1], [2, 1], [1, 2], [3, 1], [1, 3]];

  it("has the highest damage per second at every upgrade level", () => {
    for (const t of tiers) {
      const shepherd = singleTargetDps(statsFor("shepherd", t));
      for (const breed of BREED_LIST) {
        if (breed.id === "shepherd") continue;
        expect(shepherd, `${breed.id} at ${t}`).toBeGreaterThan(singleTargetDps(statsFor(breed.id, t)));
      }
    }
  });

  it("has no blind spots: it sees hidden intruders and hits prickly ones from the start", () => {
    const { base } = BREEDS.shepherd;

    expect(base.seesHidden).toBe(true);
    expect(base.hitsPrickly).toBe(true);
  });

  it("is the only breed with an ability", () => {
    const withAbility = BREED_LIST.filter((b) => statsFor(b.id, [3, 1]).hasAbility).map((b) => b.id);

    expect(withAbility).toEqual(["shepherd"]);
  });

  it("is not affordable at the very start, so it has to be earned", () => {
    expect(BREEDS.shepherd.cost).toBeGreaterThan(400);
  });

  it(
    "is the only breed that can clear every round alone",
    () => {
      for (const breed of BREED_LIST) {
        const result = play(singleBreedPolicy(breed.id));
        if (breed.id === "shepherd") {
          expect(result.status, breed.id).toBe("won");
        } else {
          expect(result.status, breed.id).toBe("lost");
        }
      }
    },
    SLOW_TEST_MS
  );
});

describe("difficulty", () => {
  it("loses early with no dogs", () => {
    const result = play(planPolicy([]));

    expect(result.status).toBe("lost");
    expect(result.roundsCleared).toBeLessThanOrEqual(3);
  });

  it(
    "a Shepherd-led team wins comfortably",
    () => {
      const result = play(planPolicy(SHEPHERD_LED));

      expect(result.status).toBe("won");
      expect(result.lives).toBeGreaterThan(STARTING_LIVES / 2);
    },
    SLOW_TEST_MS
  );

  it(
    "an economy build with Golden Retrievers also wins",
    () => {
      expect(play(planPolicy(ECONOMY)).status).toBe("won");
    },
    SLOW_TEST_MS
  );

  it(
    "a strong team without Shepherds gets late but falls short",
    () => {
      const result = play(planPolicy(NO_SHEPHERDS));

      expect(result.status).toBe("lost");
      expect(result.roundsCleared).toBeGreaterThanOrEqual(15);
    },
    SLOW_TEST_MS
  );
});

describe("breed data", () => {
  it("gives every breed two upgrade paths of three tiers with rising prices", () => {
    for (const breed of BREED_LIST) {
      for (const path of breed.paths) {
        expect(path).toHaveLength(MAX_TIER);
        const costs = path.map((u) => u.cost);
        expect(costs, breed.id).toEqual([...costs].sort((a, b) => a - b));
      }
    }
  });
});
