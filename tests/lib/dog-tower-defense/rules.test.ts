import { describe, expect, it } from "vitest";
import { BREEDS, nextUpgrade, statsFor } from "@/lib/dog-tower-defense/breeds";
import { canHit, chooseTargets, packBuff, slowFor } from "@/lib/dog-tower-defense/combat";
import {
  ALPHA_RECHARGE_MS,
  MAX_ADVANCE_MS,
  SELL_REFUND,
  SPRAY_STUN_MS,
  STARTING_BONES,
  STEP_MS,
  activateAlpha,
  advance,
  buyDog,
  createInitialGameState,
  restart,
  roundBonus,
  sellDog,
  setTargeting,
  startRound,
  tick,
  upgradeDog,
} from "@/lib/dog-tower-defense/gameState";
import { INTRUDERS } from "@/lib/dog-tower-defense/intruders";
import { LANE_LENGTH, POND, PORCH, WAYPOINTS, pointAtDistance } from "@/lib/dog-tower-defense/paths";
import { canPlaceAt } from "@/lib/dog-tower-defense/placement";
import { TOTAL_ROUNDS, spawnsForRound } from "@/lib/dog-tower-defense/waves";
import type { BreedId, Dog, GameState, Intruder, IntruderTypeId } from "@/lib/dog-tower-defense/types";

const OPEN_SPOT = { x: 100, y: 200 };

function dog(breed: BreedId, overrides: Partial<Dog> = {}): Dog {
  return {
    id: 1,
    breed,
    x: 100,
    y: 200,
    tiers: [0, 0],
    cooldownMs: 0,
    stunnedMs: 0,
    targeting: "first",
    spent: BREEDS[breed].cost,
    defeats: 0,
    abilityCooldownMs: 0,
    ...overrides,
  };
}

function intruder(id: number, type: IntruderTypeId, overrides: Partial<Intruder> = {}): Intruder {
  return {
    id,
    type,
    lane: INTRUDERS[type].lane,
    hp: INTRUDERS[type].hp,
    distance: 100,
    x: 100,
    y: 200,
    slowed: false,
    ...overrides,
  };
}

function wave(overrides: Partial<GameState>): GameState {
  return { ...createInitialGameState(), status: "wave", pending: [{ type: "squirrel", atMs: 1e9 }], ...overrides };
}

describe("placement", () => {
  it("allows open grass", () => {
    expect(canPlaceAt(OPEN_SPOT, [])).toBe(true);
  });

  it("rejects paths, the pond, the porch, the edges and other dogs", () => {
    expect(canPlaceAt(WAYPOINTS.yard[1], [])).toBe(false);
    expect(canPlaceAt({ x: POND.x + POND.width / 2, y: POND.y + POND.height / 2 }, [])).toBe(false);
    expect(canPlaceAt({ x: PORCH.x, y: PORCH.y + 25 }, [])).toBe(false);
    expect(canPlaceAt({ x: 2, y: 200 }, [])).toBe(false);
    expect(canPlaceAt(OPEN_SPOT, [{ x: 110, y: 200 }])).toBe(false);
  });
});

describe("buying, upgrading and selling", () => {
  it("charges for a dog and leaves the state alone when it can't be afforded or placed", () => {
    const start = createInitialGameState();

    const bought = buyDog(start, "beagle", OPEN_SPOT);
    expect(bought.dogs).toHaveLength(1);
    expect(bought.bones).toBe(STARTING_BONES - BREEDS.beagle.cost);

    expect(buyDog(start, "shepherd", OPEN_SPOT)).toBe(start);
    expect(buyDog(start, "beagle", WAYPOINTS.yard[1])).toBe(start);
  });

  it("applies upgrades to a dog's stats", () => {
    const start = { ...buyDog(createInitialGameState(), "beagle", OPEN_SPOT), bones: 5000 };
    const id = start.dogs[0].id;
    const before = statsFor("beagle", start.dogs[0].tiers);

    const upgraded = upgradeDog(start, id, 1);

    expect(upgraded.dogs[0].tiers).toEqual([0, 1]);
    expect(statsFor("beagle", upgraded.dogs[0].tiers).pierce).toBe(before.pierce + 1);
    expect(upgraded.bones).toBe(5000 - BREEDS.beagle.paths[1][0].cost);
  });

  it("lets only one path go past tier 1", () => {
    expect(nextUpgrade(dog("beagle", { tiers: [1, 1] }), 0)).not.toBeNull();
    expect(nextUpgrade(dog("beagle", { tiers: [2, 1] }), 1)).toBeNull();
    expect(nextUpgrade(dog("beagle", { tiers: [2, 0] }), 1)).not.toBeNull();
    expect(nextUpgrade(dog("beagle", { tiers: [3, 1] }), 0)).toBeNull();
  });

  it("refunds part of everything spent on a sold dog", () => {
    const state = wave({ dogs: [dog("beagle", { spent: 1000 })], bones: 0 });

    const sold = sellDog(state, 1);

    expect(sold.dogs).toEqual([]);
    expect(sold.bones).toBe(1000 * SELL_REFUND);
  });
});

describe("who a dog can hit", () => {
  it("cannot target hidden intruders without the right senses", () => {
    expect(canHit(BREEDS.chihuahua.base, intruder(1, "cat"))).toBe(false);
    expect(canHit(BREEDS.beagle.base, intruder(1, "cat"))).toBe(true);
  });

  it("bounces bites and balls off prickly intruders, but howls get through", () => {
    expect(canHit(BREEDS.beagle.base, intruder(1, "hedgehog"))).toBe(false);
    expect(canHit(BREEDS.labrador.base, intruder(1, "hedgehog"))).toBe(false);
    expect(canHit(BREEDS.husky.base, intruder(1, "hedgehog"))).toBe(true);
    expect(canHit(statsFor("beagle", [0, 3]), intruder(1, "hedgehog"))).toBe(true);
  });

  it("ignores intruders out of range", () => {
    const far = intruder(1, "squirrel", { x: 700 });

    expect(chooseTargets(dog("beagle"), BREEDS.beagle.base, [far])).toEqual([]);
  });

  it("follows the targeting setting", () => {
    const front = intruder(1, "squirrel", { distance: 500 });
    const back = intruder(2, "raccoon", { distance: 100 });
    const pick = (targeting: Dog["targeting"]) =>
      chooseTargets(dog("beagle", { targeting }), BREEDS.beagle.base, [back, front])[0].id;

    expect(pick("first")).toBe(1);
    expect(pick("last")).toBe(2);
    expect(pick("strong")).toBe(2);
  });

  it("hits up to its pierce with a ball and everything in range with a howl", () => {
    const crowd = [1, 2, 3, 4, 5].map((id) => intruder(id, "squirrel"));

    expect(chooseTargets(dog("labrador"), BREEDS.labrador.base, crowd)).toHaveLength(3);
    expect(chooseTargets(dog("husky"), BREEDS.husky.base, crowd)).toHaveLength(5);
  });
});

describe("support dogs", () => {
  it("corgis slow intruders in range, bosses by half as much", () => {
    const corgi = dog("corgi");

    expect(slowFor(intruder(1, "squirrel"), [corgi])).toBeCloseTo(0.3);
    expect(slowFor(intruder(1, "duck"), [corgi])).toBeCloseTo(0.15);
    expect(slowFor(intruder(1, "squirrel", { x: 700 }), [corgi])).toBe(0);
  });

  it("a stunned corgi stops herding", () => {
    expect(slowFor(intruder(1, "squirrel"), [dog("corgi", { stunnedMs: 500 })])).toBe(0);
  });

  it("pack dogs buff others in range, but not themselves", () => {
    const golden = dog("golden", { id: 1, tiers: [0, 3] });
    const beagle = dog("beagle", { id: 2, x: 150 });

    expect(packBuff(beagle, [golden, beagle])).toEqual({ cooldown: 0.7, damage: 1 });
    expect(packBuff(golden, [golden, beagle])).toEqual({ cooldown: 1, damage: 0 });
  });

  it("golden retrievers pay out at the end of each round", () => {
    const state = wave({ dogs: [dog("golden", { x: 30, y: 30 })], pending: [], intruders: [], bones: 0 });

    expect(tick(state).bones).toBe(roundBonus(1) + BREEDS.golden.base.bonesPerRound);
  });
});

describe("the simulation", () => {
  it("does nothing while building", () => {
    const start = createInitialGameState();

    expect(tick(start)).toBe(start);
  });

  it("does not change the state it is given", () => {
    const state = wave({ dogs: [dog("beagle")], intruders: [intruder(1, "raccoon")] });
    const copy = structuredClone(state);

    tick(state);

    expect(state).toEqual(copy);
  });

  it("damages an intruder and starts the dog's cooldown", () => {
    const state = wave({ dogs: [dog("shepherd")], intruders: [intruder(1, "raccoon")] });

    const next = tick(state);

    expect(next.intruders[0].hp).toBe(INTRUDERS.raccoon.hp - BREEDS.shepherd.base.damage);
    expect(next.dogs[0].cooldownMs).toBe(BREEDS.shepherd.base.cooldownMs);
  });

  it("pays the bounty on a defeat", () => {
    const state = wave({ dogs: [dog("beagle")], intruders: [intruder(1, "squirrel")], bones: 0 });

    const next = tick(state);

    expect(next.intruders).toEqual([]);
    expect(next.bones).toBe(INTRUDERS.squirrel.bounty);
    expect(next.dogs[0].defeats).toBe(1);
  });

  it("splits a boss into its children where it fell", () => {
    const duck = intruder(1, "duck", { hp: 1, distance: 200 });
    const state = wave({ dogs: [dog("shepherd", pointAtDistance("pond", 200))], intruders: [duck] });

    const next = tick(state);

    expect(next.intruders.map((i) => i.type)).toEqual(Array(4).fill("duckling"));
    expect(next.intruders[0].distance).toBeCloseTo(200, -1);
  });

  it("a defeated skunk stuns nearby dogs, who then can't attack", () => {
    const skunk = intruder(1, "skunk", { hp: 1 });
    const state = wave({ dogs: [dog("shepherd", pointAtDistance("yard", 100))], intruders: [skunk] });

    const sprayed = tick(state);
    expect(sprayed.dogs[0].stunnedMs).toBe(SPRAY_STUN_MS);

    const next = tick({
      ...sprayed,
      intruders: [intruder(3, "raccoon")],
      dogs: [{ ...sprayed.dogs[0], cooldownMs: 0 }],
    });
    expect(next.intruders[0].hp).toBe(INTRUDERS.raccoon.hp);
  });

  it("costs lives when an intruder reaches the porch", () => {
    const state = wave({ intruders: [intruder(1, "raccoon", { distance: LANE_LENGTH.yard - 0.01 })] });

    const next = tick(state);

    expect(next.intruders).toEqual([]);
    expect(next.lives).toBe(state.lives - INTRUDERS.raccoon.leak);
  });

  it("ends the game the moment lives run out", () => {
    const state = wave({ lives: 1, intruders: [intruder(1, "squirrel", { distance: LANE_LENGTH.yard })] });

    expect(tick(state).status).toBe("lost");
  });

  it("moves to the next round with a bonus, then wins after the last", () => {
    const cleared = tick(wave({ pending: [], intruders: [], bones: 0 }));
    expect(cleared.status).toBe("building");
    expect(cleared.round).toBe(2);
    expect(cleared.bones).toBe(roundBonus(1));

    const final = tick(wave({ round: TOTAL_ROUNDS, pending: [], intruders: [] }));
    expect(final.status).toBe("won");
  });

  it("alpha command needs the upgrade, then speeds up every dog and recharges", () => {
    const leader = dog("shepherd", { id: 1, tiers: [3, 1] });
    const other = dog("beagle", { id: 2 });
    const state = wave({ dogs: [leader, other], intruders: [intruder(1, "raccoon", { hp: 999 })] });

    expect(activateAlpha(wave({ dogs: [other] }), 2).alphaMs).toBe(0);

    const active = activateAlpha(state, 1);
    expect(active.dogs[0].abilityCooldownMs).toBe(ALPHA_RECHARGE_MS);
    expect(activateAlpha(active, 1).alphaMs).toBe(active.alphaMs);

    const next = tick(active);
    expect(next.dogs[1].cooldownMs).toBeCloseTo(BREEDS.beagle.base.cooldownMs / 3);
  });

  it("gives the same result however time is sliced into frames", () => {
    const setup = (): GameState =>
      startRound(setTargeting(buyDog(createInitialGameState(), "beagle", OPEN_SPOT), 1, "last"));
    const run = (frameMs: number) => {
      let state = setup();
      for (let t = 0; t < 8000; t += frameMs) state = advance(state, frameMs);
      return state;
    };

    const a = run(1000 / 30);
    const b = run(1000 / 144);

    expect(Math.abs(a.roundMs - b.roundMs)).toBeLessThanOrEqual(STEP_MS * 2);
    expect(Math.abs(a.bones - b.bones)).toBeLessThanOrEqual(2);
  });

  it("does not fast-forward after a stalled tab", () => {
    const next = advance(startRound(createInitialGameState()), 60_000);

    expect(next.roundMs).toBeLessThanOrEqual(MAX_ADVANCE_MS);
  });

  it("restart returns to a fresh game", () => {
    expect(restart()).toEqual(createInitialGameState());
  });
});

describe("waves and paths", () => {
  it("has twenty rounds, with spawns in time order and a boss at the end", () => {
    expect(TOTAL_ROUNDS).toBe(20);

    for (let round = 1; round <= TOTAL_ROUNDS; round++) {
      const times = spawnsForRound(round).map((s) => s.atMs);
      expect(times).toEqual([...times].sort((x, y) => x - y));
    }
    expect(spawnsForRound(20).some((s) => s.type === "swan")).toBe(true);
  });

  it("introduces each trait before the rounds that depend on it", () => {
    const firstRound = (type: IntruderTypeId) =>
      Array.from({ length: TOTAL_ROUNDS }, (_, i) => i + 1).find((r) =>
        spawnsForRound(r).some((s) => s.type === type)
      );

    expect(firstRound("cat")).toBeGreaterThanOrEqual(3);
    expect(firstRound("hedgehog")).toBeGreaterThan(firstRound("cat")!);
  });

  it("finds points along a lane and clamps at its ends", () => {
    expect(pointAtDistance("yard", 100)).toEqual({ x: 100, y: 120 });
    expect(pointAtDistance("yard", -5)).toEqual({ x: 0, y: 120 });
    expect(pointAtDistance("yard", LANE_LENGTH.yard + 50)).toEqual(PORCH);
  });
});
