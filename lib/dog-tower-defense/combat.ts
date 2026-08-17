import { INITIAL_PLACEMENT_SPOTS, pathFor, pointAtProgress } from "./paths";
import type { Dog, Intruder } from "./types";

function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function dogPosition(dog: Dog): { x: number; y: number } {
  const spot = INITIAL_PLACEMENT_SPOTS.find((s) => s.id === dog.spotId);
  if (!spot) throw new Error(`Unknown placement spot: ${dog.spotId}`);
  return spot.position;
}

/** Returns a new intruders array where any alive intruder within range of any dog is defeated. */
export function resolveAttacks(dogs: Dog[], intruders: Intruder[]): Intruder[] {
  return intruders.map((intruder) => {
    if (!intruder.alive) return intruder;

    const position = pointAtProgress(pathFor(intruder.type), intruder.pathProgress);
    const inRange = dogs.some(
      (dog) => distance(dogPosition(dog), position) <= dog.range
    );

    return inRange ? { ...intruder, alive: false } : intruder;
  });
}
