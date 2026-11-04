import { isInYard, resolveAttacks } from "./combat";
import { placeDog } from "./placement";
import { INITIAL_PLACEMENT_SPOTS, pathFor, pathLength } from "./paths";
import type { Dog, GameState, Intruder, IntruderType } from "./types";

export const STARTING_LIVES = 5;
export const STARTING_BONES = 6;
export const BONES_PER_KILL = 1;
export const DOG_RANGE = 90;
export const SPAWN_INTERVAL_MS = 800;
/** Longest step one tick simulates, so a stalled tab can't jump intruders past dogs. */
export const MAX_TICK_MS = 100;

/** Walking speed in canvas pixels per second. */
export const INTRUDER_SPEED: Record<IntruderType, number> = {
  squirrel: 70,
  frog: 45,
};

const WAVE: IntruderType[] = [
  "squirrel",
  "frog",
  "squirrel",
  "squirrel",
  "frog",
  "squirrel",
  "frog",
  "squirrel",
  "frog",
  "squirrel",
  "squirrel",
  "frog",
  "squirrel",
  "frog",
  "squirrel",
  "squirrel",
];

function spawnWave(): Intruder[] {
  return WAVE.map((type, i) => ({
    id: `${type}-${i}`,
    type,
    pathProgress: 0,
    alive: true,
    spawnAtMs: i * SPAWN_INTERVAL_MS,
  }));
}

export function createInitialGameState(): GameState {
  return {
    lives: STARTING_LIVES,
    bones: STARTING_BONES,
    dogs: [],
    spots: INITIAL_PLACEMENT_SPOTS.map((s) => ({ ...s })),
    intruders: spawnWave(),
    attacks: [],
    elapsedMs: 0,
    status: "ready",
  };
}

export function startWave(state: GameState): GameState {
  return state.status === "ready" ? { ...state, status: "playing" } : state;
}

export function tryPlaceDog(state: GameState, spotId: string): GameState {
  if (state.status !== "ready" && state.status !== "playing") return state;

  const dogId = `dog-${spotId}`;
  const result = placeDog(state.spots, spotId, state.bones, dogId);
  if (!result.ok) return state;

  const dog: Dog = { id: dogId, spotId, range: DOG_RANGE, cooldownMs: 0 };

  return {
    ...state,
    dogs: [...state.dogs, dog],
    spots: result.spots,
    bones: result.remainingBones,
  };
}

/** Advances the game by `deltaMs`: moves intruders, resolves combat, awards bones, deducts lives, evaluates win/lose. */
export function tick(state: GameState, deltaMs: number): GameState {
  if (state.status !== "playing") return state;

  const stepMs = Math.min(deltaMs, MAX_TICK_MS);
  const elapsedMs = state.elapsedMs + stepMs;

  const advanced = state.intruders.map((intruder) => {
    if (!isInYard(intruder, elapsedMs)) return intruder;
    const distance = (INTRUDER_SPEED[intruder.type] * stepMs) / 1000;
    const progress = distance / pathLength(pathFor(intruder.type));
    return { ...intruder, pathProgress: Math.min(1, intruder.pathProgress + progress) };
  });

  const combat = resolveAttacks(state.dogs, advanced, elapsedMs, stepMs);

  const bonesEarned = combat.attacks.length * BONES_PER_KILL;

  const livesLost = combat.intruders.filter((i) => i.alive && i.pathProgress >= 1).length;
  const intruders = combat.intruders.map((i) =>
    i.alive && i.pathProgress >= 1 ? { ...i, alive: false } : i
  );

  const lives = state.lives - livesLost;

  let status: GameState["status"] = state.status;
  if (lives <= 0) {
    status = "lost";
  } else if (intruders.every((i) => !i.alive)) {
    status = "won";
  }

  return {
    ...state,
    dogs: combat.dogs,
    intruders,
    attacks: [
      ...state.attacks
        .map((a) => ({ ...a, remainingMs: a.remainingMs - stepMs }))
        .filter((a) => a.remainingMs > 0),
      ...combat.attacks,
    ],
    elapsedMs,
    lives: Math.max(0, lives),
    bones: state.bones + bonesEarned,
    status,
  };
}

export function restart(): GameState {
  return createInitialGameState();
}
