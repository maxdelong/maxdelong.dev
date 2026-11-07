import { BREEDS, dogStats, nextUpgrade } from "@/lib/dog-tower-defense/breeds";
import { buyDog, createInitialGameState, startRound, tick, upgradeDog } from "@/lib/dog-tower-defense/gameState";
import { CANVAS_HEIGHT, CANVAS_WIDTH, LANE_LENGTH, pointAtDistance } from "@/lib/dog-tower-defense/paths";
import { canPlaceAt } from "@/lib/dog-tower-defense/placement";
import type { BreedId, Dog, GameState, PathIndex, Point } from "@/lib/dog-tower-defense/types";

const COVERAGE_POINTS = (["yard", "pond"] as const).flatMap((lane) =>
  Array.from({ length: Math.ceil(LANE_LENGTH[lane] / 10) }, (_, i) => pointAtDistance(lane, i * 10))
);

function coverage(point: Point, range: number): number {
  return COVERAGE_POINTS.filter((p) => Math.hypot(p.x - point.x, p.y - point.y) <= range).length;
}

/** The free spot where this range covers the most path. */
export function bestSpot(dogs: Dog[], range: number): Point | null {
  let best: Point | null = null;
  let bestScore = -1;
  for (let x = 20; x < CANVAS_WIDTH; x += 20) {
    for (let y = 20; y < CANVAS_HEIGHT; y += 20) {
      const point = { x, y };
      if (!canPlaceAt(point, dogs)) continue;
      const score = coverage(point, range);
      if (score > bestScore) {
        best = point;
        bestScore = score;
      }
    }
  }
  return best;
}

/** Runs one decision for the bot. It may buy repeatedly until nothing changes. */
export type Policy = (state: GameState) => GameState;

export interface BotResult {
  status: GameState["status"];
  /** The last round the bot survived. */
  roundsCleared: number;
  lives: number;
  dogs: Dog[];
  ms: number;
}

export function play(policy: Policy, maxRounds = 20): BotResult {
  let state = createInitialGameState();
  let ms = 0;
  while (state.status !== "won" && state.status !== "lost") {
    state = policy(state);
    if (state.status === "building") {
      if (state.round > maxRounds) break;
      state = startRound(state);
    }
    for (let i = 0; i < 30 && state.status === "wave"; i++) {
      state = tick(state);
      ms += 1000 / 60;
    }
  }
  const roundsCleared = state.status === "won" ? state.round : state.round - 1;
  return { status: state.status, roundsCleared, lives: state.lives, dogs: state.dogs, ms };
}

export function buyAtBestSpot(state: GameState, breed: BreedId): GameState {
  if (state.bones < BREEDS[breed].cost) return state;
  const spot = bestSpot(state.dogs, BREEDS[breed].base.range);
  return spot ? buyDog(state, breed, spot) : state;
}

export type PlanStep = { buy: BreedId } | { upgrade: number; path: PathIndex };

/** Works through a fixed build order, waiting until each step is affordable. */
export function planPolicy(plan: PlanStep[]): Policy {
  let index = 0;
  return (start) => {
    let state = start;
    while (index < plan.length) {
      const step = plan[index];
      const next =
        "buy" in step
          ? buyAtBestSpot(state, step.buy)
          : upgradeDog(state, state.dogs[step.upgrade]?.id ?? -1, step.path);
      if (next === state) break;
      state = next;
      index++;
    }
    return state;
  };
}

/** Spends only on one breed: each time, the cheapest new dog or upgrade available. */
export function singleBreedPolicy(breed: BreedId): Policy {
  return (start) => {
    let state = start;
    for (;;) {
      const options: { cost: number; run: (s: GameState) => GameState }[] = [
        { cost: BREEDS[breed].cost, run: (s) => buyAtBestSpot(s, breed) },
      ];
      for (const dog of state.dogs) {
        for (const path of [0, 1] as const) {
          const upgrade = nextUpgrade(dog, path);
          if (upgrade) options.push({ cost: upgrade.cost, run: (s) => upgradeDog(s, dog.id, path) });
        }
      }
      options.sort((a, b) => a.cost - b.cost);
      const option = options[0];
      if (!option || state.bones < option.cost) return state;
      const next = option.run(state);
      if (next === state) return state;
      state = next;
    }
  };
}

export function totalDps(dogs: Dog[]): number {
  return dogs.reduce((sum, dog) => {
    const stats = dogStats(dog);
    return stats.attack === "none" ? sum : sum + (stats.damage / stats.cooldownMs) * 1000;
  }, 0);
}
