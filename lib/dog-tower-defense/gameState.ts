import { resolveAttacks } from "./combat";
import { DOG_COST, placeDog } from "./placement";
import { INITIAL_PLACEMENT_SPOTS } from "./paths";
import type { Dog, GameState, Intruder, IntruderType } from "./types";

export const STARTING_LIVES = 5;
export const STARTING_BONES = 6;
export const BONES_PER_KILL = 1;
export const DOG_RANGE = 90;
export const INTRUDER_SPEED_PER_TICK = 0.006;

const WAVE: IntruderType[] = [
  "squirrel",
  "frog",
  "squirrel",
  "squirrel",
  "frog",
  "squirrel",
  "frog",
];

function spawnWave(): Intruder[] {
  return WAVE.map((type, i) => ({
    id: `${type}-${i}`,
    type,
    pathProgress: 0,
    alive: true,
  }));
}

export function createInitialGameState(): GameState {
  return {
    lives: STARTING_LIVES,
    bones: STARTING_BONES,
    dogs: [],
    spots: INITIAL_PLACEMENT_SPOTS.map((s) => ({ ...s })),
    intruders: spawnWave(),
    status: "playing",
  };
}

export function tryPlaceDog(state: GameState, spotId: string): GameState {
  if (state.status !== "playing") return state;

  const dogId = `dog-${spotId}`;
  const result = placeDog(state.spots, spotId, state.bones, dogId);
  if (!result.ok) return state;

  const dog: Dog = { id: dogId, spotId, range: DOG_RANGE };

  return {
    ...state,
    dogs: [...state.dogs, dog],
    spots: result.spots,
    bones: result.remainingBones,
  };
}

/** Advances the game by one tick: moves intruders, resolves combat, awards bones, deducts lives, evaluates win/lose. */
export function tick(state: GameState): GameState {
  if (state.status !== "playing") return state;

  const advanced = state.intruders.map((intruder) =>
    intruder.alive
      ? { ...intruder, pathProgress: Math.min(1, intruder.pathProgress + INTRUDER_SPEED_PER_TICK) }
      : intruder
  );

  const afterCombat = resolveAttacks(state.dogs, advanced);

  const bonesEarned = afterCombat.filter(
    (i, idx) => !i.alive && advanced[idx].alive
  ).length * BONES_PER_KILL;

  const reachedPorch = afterCombat.filter((i) => i.alive && i.pathProgress >= 1);
  const livesLost = reachedPorch.length;
  const finalIntruders = afterCombat.map((i) =>
    i.alive && i.pathProgress >= 1 ? { ...i, alive: false } : i
  );

  const lives = state.lives - livesLost;
  const bones = state.bones + bonesEarned;

  let status: GameState["status"] = state.status;
  if (lives <= 0) {
    status = "lost";
  } else if (finalIntruders.every((i) => !i.alive)) {
    status = "won";
  }

  return {
    ...state,
    intruders: finalIntruders,
    lives: Math.max(0, lives),
    bones,
    status,
  };
}

export function restart(): GameState {
  return createInitialGameState();
}

export { DOG_COST };
