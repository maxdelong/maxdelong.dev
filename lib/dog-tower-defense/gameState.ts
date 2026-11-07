import { BREEDS, dogStats, nextUpgrade } from "./breeds";
import { ALPHA_COOLDOWN_MULTIPLIER, chooseTargets, packBuff, slowFor } from "./combat";
import { INTRUDERS } from "./intruders";
import { LANE_LENGTH, pointAtDistance } from "./paths";
import { canPlaceAt } from "./placement";
import { TOTAL_ROUNDS, spawnsForRound } from "./waves";
import type {
  BreedId,
  Dog,
  Effect,
  EffectKind,
  GameState,
  Intruder,
  IntruderTypeId,
  PathIndex,
  Point,
  Targeting,
} from "./types";

export const STARTING_LIVES = 40;
export const STARTING_BONES = 400;
export const SELL_REFUND = 0.7;
export const SPRAY_RADIUS = 70;
export const SPRAY_STUN_MS = 1500;
export const ALPHA_DURATION_MS = 8000;
export const ALPHA_RECHARGE_MS = 40000;
/** The simulation always moves in steps this long, so outcomes don't depend on frame rate. */
export const STEP_MS = 1000 / 60;
/** The most time one `advance` call simulates, so a stalled tab can't fast-forward the game. */
export const MAX_ADVANCE_MS = 400;

export function roundBonus(round: number): number {
  return 90 + round * 12;
}

export function createInitialGameState(): GameState {
  return {
    status: "building",
    round: 1,
    lives: STARTING_LIVES,
    bones: STARTING_BONES,
    dogs: [],
    intruders: [],
    pending: [],
    effects: [],
    roundMs: 0,
    alphaMs: 0,
    carryMs: 0,
    nextId: 1,
  };
}

export function restart(): GameState {
  return createInitialGameState();
}

function isOver(state: GameState): boolean {
  return state.status === "won" || state.status === "lost";
}

export function startRound(state: GameState): GameState {
  if (state.status !== "building") return state;
  return { ...state, status: "wave", roundMs: 0, pending: spawnsForRound(state.round) };
}

export function buyDog(state: GameState, breed: BreedId, point: Point): GameState {
  if (isOver(state)) return state;
  const { cost } = BREEDS[breed];
  if (state.bones < cost || !canPlaceAt(point, state.dogs)) return state;

  const dog: Dog = {
    id: state.nextId,
    breed,
    x: point.x,
    y: point.y,
    tiers: [0, 0],
    cooldownMs: 0,
    stunnedMs: 0,
    targeting: "first",
    spent: cost,
    defeats: 0,
    abilityCooldownMs: 0,
  };
  return { ...state, dogs: [...state.dogs, dog], bones: state.bones - cost, nextId: state.nextId + 1 };
}

export function upgradeDog(state: GameState, dogId: number, path: PathIndex): GameState {
  if (isOver(state)) return state;
  const dog = state.dogs.find((d) => d.id === dogId);
  if (!dog) return state;
  const upgrade = nextUpgrade(dog, path);
  if (!upgrade || state.bones < upgrade.cost) return state;

  const tiers: [number, number] = [dog.tiers[0], dog.tiers[1]];
  tiers[path] += 1;
  return {
    ...state,
    bones: state.bones - upgrade.cost,
    dogs: state.dogs.map((d) => (d.id === dogId ? { ...d, tiers, spent: d.spent + upgrade.cost } : d)),
  };
}

export function sellValue(dog: Pick<Dog, "spent">): number {
  return Math.floor(dog.spent * SELL_REFUND);
}

export function sellDog(state: GameState, dogId: number): GameState {
  if (isOver(state)) return state;
  const dog = state.dogs.find((d) => d.id === dogId);
  if (!dog) return state;
  return { ...state, bones: state.bones + sellValue(dog), dogs: state.dogs.filter((d) => d.id !== dogId) };
}

export function setTargeting(state: GameState, dogId: number, targeting: Targeting): GameState {
  return { ...state, dogs: state.dogs.map((d) => (d.id === dogId ? { ...d, targeting } : d)) };
}

/** Alpha Command: every dog attacks three times as fast for a few seconds. */
export function activateAlpha(state: GameState, dogId: number): GameState {
  if (state.status !== "wave") return state;
  const dog = state.dogs.find((d) => d.id === dogId);
  if (!dog || !dogStats(dog).hasAbility || dog.abilityCooldownMs > 0) return state;

  const effect: Effect = {
    id: state.nextId,
    kind: "alpha",
    from: { x: dog.x, y: dog.y },
    to: { x: dog.x, y: dog.y },
    radius: 260,
    remainingMs: 600,
    totalMs: 600,
  };
  return {
    ...state,
    alphaMs: ALPHA_DURATION_MS,
    nextId: state.nextId + 1,
    effects: [...state.effects, effect],
    dogs: state.dogs.map((d) => (d.id === dogId ? { ...d, abilityCooldownMs: ALPHA_RECHARGE_MS } : d)),
  };
}

function makeIntruder(id: number, type: IntruderTypeId, distance = 0): Intruder {
  const { hp, lane } = INTRUDERS[type];
  const point = pointAtDistance(lane, distance);
  return { id, type, lane, hp, distance, x: point.x, y: point.y, slowed: false };
}

function makeEffect(id: number, kind: EffectKind, from: Point, to: Point, radius = 0): Effect {
  const totalMs = kind === "howl" || kind === "spray" ? 320 : 140;
  return { id, kind, from: { x: from.x, y: from.y }, to: { x: to.x, y: to.y }, radius, remainingMs: totalMs, totalMs };
}

/** Advances the simulation by one step. Returns a new state and never changes the one passed in. */
export function tick(state: GameState, stepMs: number = STEP_MS): GameState {
  const effects = state.effects
    .map((e) => ({ ...e, remainingMs: e.remainingMs - stepMs }))
    .filter((e) => e.remainingMs > 0);

  if (state.status !== "wave") {
    return effects.length === state.effects.length && effects.length === 0
      ? state
      : { ...state, effects };
  }

  let { nextId, bones, lives } = state;
  const roundMs = state.roundMs + stepMs;
  const alphaMs = Math.max(0, state.alphaMs - stepMs);

  // Bring in anything due to spawn. The list is sorted by time.
  let due = 0;
  while (due < state.pending.length && state.pending[due].atMs <= roundMs) due++;
  const pending = due === 0 ? state.pending : state.pending.slice(due);
  const spawned = state.pending.slice(0, due).map(({ type }) => makeIntruder(nextId++, type));

  const stunnedDogs = state.dogs.map((dog) => ({
    ...dog,
    stunnedMs: Math.max(0, dog.stunnedMs - stepMs),
    cooldownMs: Math.max(0, dog.cooldownMs - stepMs),
    abilityCooldownMs: Math.max(0, dog.abilityCooldownMs - stepMs),
  }));

  // Walk.
  const walkers = [...state.intruders, ...spawned].map((intruder) => {
    const slow = slowFor(intruder, stunnedDogs);
    const distance = intruder.distance + (INTRUDERS[intruder.type].speed * (1 - slow) * stepMs) / 1000;
    const point = pointAtDistance(intruder.lane, distance);
    return { ...intruder, distance, x: point.x, y: point.y, slowed: slow > 0 };
  });

  // Attack. Damage lands immediately, so later dogs don't waste hits on the already defeated.
  const dogs = stunnedDogs.map((dog) => {
    if (dog.stunnedMs > 0 || dog.cooldownMs > 0) return dog;
    const stats = dogStats(dog);
    const targets = chooseTargets(dog, stats, walkers);
    if (targets.length === 0) return dog;

    const buff = packBuff(dog, stunnedDogs);
    const damage = stats.damage + buff.damage;
    let defeats = dog.defeats;
    for (const target of targets) {
      target.hp -= damage;
      if (target.hp <= 0) {
        defeats++;
        bones += stats.bonusBounty;
      }
    }

    if (stats.attack === "howl") {
      effects.push(makeEffect(nextId++, "howl", dog, dog, stats.range));
    } else {
      for (const target of targets) {
        effects.push(makeEffect(nextId++, stats.attack === "ball" ? "ball" : "bite", dog, target));
      }
    }

    const alpha = alphaMs > 0 ? ALPHA_COOLDOWN_MULTIPLIER : 1;
    return { ...dog, defeats, cooldownMs: stats.cooldownMs * buff.cooldown * alpha };
  });

  // Resolve defeats and leaks.
  const intruders: Intruder[] = [];
  let finalDogs = dogs;
  for (const intruder of walkers) {
    const data = INTRUDERS[intruder.type];

    if (intruder.hp <= 0) {
      bones += data.bounty;
      if (data.spray) {
        effects.push(makeEffect(nextId++, "spray", intruder, intruder, SPRAY_RADIUS));
        finalDogs = finalDogs.map((dog) =>
          Math.hypot(dog.x - intruder.x, dog.y - intruder.y) <= SPRAY_RADIUS
            ? { ...dog, stunnedMs: SPRAY_STUN_MS }
            : dog
        );
      }
      if (data.splitsInto) {
        const { type, count } = data.splitsInto;
        for (let i = 0; i < count; i++) {
          intruders.push(makeIntruder(nextId++, type, Math.max(0, intruder.distance - i * 14)));
        }
      }
    } else if (intruder.distance >= LANE_LENGTH[intruder.lane]) {
      lives -= data.leak;
    } else {
      intruders.push(intruder);
    }
  }

  let status: GameState["status"] = state.status;
  let { round } = state;
  if (lives <= 0) {
    lives = 0;
    status = "lost";
  } else if (pending.length === 0 && intruders.length === 0) {
    bones += roundBonus(round);
    for (const dog of finalDogs) bones += dogStats(dog).bonesPerRound;
    if (round >= TOTAL_ROUNDS) {
      status = "won";
    } else {
      status = "building";
      round += 1;
    }
  }

  return {
    ...state,
    status,
    round,
    lives,
    bones,
    dogs: finalDogs,
    intruders,
    pending,
    effects,
    roundMs,
    alphaMs,
    nextId,
  };
}

/** Advances by real elapsed time, in fixed steps, keeping any remainder for next time. */
export function advance(state: GameState, elapsedMs: number): GameState {
  let remaining = state.carryMs + Math.min(elapsedMs, MAX_ADVANCE_MS);
  let next = state;
  while (remaining >= STEP_MS) {
    next = tick(next, STEP_MS);
    remaining -= STEP_MS;
  }
  return next.carryMs === remaining ? next : { ...next, carryMs: remaining };
}
