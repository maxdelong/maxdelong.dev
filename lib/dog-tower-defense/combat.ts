import { INITIAL_PLACEMENT_SPOTS, pathFor, pointAtProgress } from "./paths";
import type { Attack, Dog, Intruder, Point } from "./types";

export const DOG_COOLDOWN_MS = 2200;
export const ATTACK_DISPLAY_MS = 150;

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function dogPosition(dog: Dog): Point {
  const spot = INITIAL_PLACEMENT_SPOTS.find((s) => s.id === dog.spotId);
  if (!spot) throw new Error(`Unknown placement spot: ${dog.spotId}`);
  return spot.position;
}

export function intruderPosition(intruder: Intruder): Point {
  return pointAtProgress(pathFor(intruder.type), intruder.pathProgress);
}

export function isInYard(intruder: Intruder, elapsedMs: number): boolean {
  return intruder.alive && elapsedMs >= intruder.spawnAtMs;
}

/**
 * Each ready dog defeats one in-range intruder, preferring the one furthest
 * along its path, then waits out its cooldown. Two dogs never spend an attack
 * on the same intruder.
 */
export function resolveAttacks(
  dogs: Dog[],
  intruders: Intruder[],
  elapsedMs: number,
  deltaMs: number
): { dogs: Dog[]; intruders: Intruder[]; attacks: Attack[] } {
  const defeated = new Set<string>();
  const attacks: Attack[] = [];

  const nextDogs = dogs.map((dog) => {
    const cooldownMs = Math.max(0, dog.cooldownMs - deltaMs);
    if (cooldownMs > 0) return { ...dog, cooldownMs };

    const from = dogPosition(dog);
    const target = intruders
      .filter(
        (i) =>
          isInYard(i, elapsedMs) &&
          !defeated.has(i.id) &&
          distance(from, intruderPosition(i)) <= dog.range
      )
      .sort((a, b) => b.pathProgress - a.pathProgress)[0];
    if (!target) return { ...dog, cooldownMs };

    defeated.add(target.id);
    attacks.push({
      id: `${dog.id}-${target.id}`,
      from,
      to: intruderPosition(target),
      remainingMs: ATTACK_DISPLAY_MS,
    });
    return { ...dog, cooldownMs: DOG_COOLDOWN_MS };
  });

  return {
    dogs: nextDogs,
    intruders: intruders.map((i) => (defeated.has(i.id) ? { ...i, alive: false } : i)),
    attacks,
  };
}
