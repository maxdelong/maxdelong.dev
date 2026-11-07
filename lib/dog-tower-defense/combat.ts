import { dogStats } from "./breeds";
import { INTRUDERS } from "./intruders";
import { LANE_LENGTH } from "./paths";
import type { Dog, DogStats, Intruder, Targeting } from "./types";

export const ALPHA_COOLDOWN_MULTIPLIER = 1 / 3;

/** Whether a dog with these stats is able to attack this intruder at all. */
export function canHit(stats: DogStats, intruder: Intruder): boolean {
  const data = INTRUDERS[intruder.type];
  if (data.hidden && !stats.seesHidden) return false;
  if (data.prickly && stats.attack !== "howl" && !stats.hitsPrickly) return false;
  return true;
}

export function inRange(dog: Pick<Dog, "x" | "y">, range: number, intruder: Pick<Intruder, "x" | "y">): boolean {
  return Math.hypot(dog.x - intruder.x, dog.y - intruder.y) <= range;
}

function progress(intruder: Intruder): number {
  return intruder.distance / LANE_LENGTH[intruder.lane];
}

/** Orders intruders so the dog's preferred targets come first. */
export function sortForTargeting(dog: Pick<Dog, "x" | "y">, intruders: Intruder[], targeting: Targeting): Intruder[] {
  const sorted = [...intruders];
  switch (targeting) {
    case "first":
      return sorted.sort((a, b) => progress(b) - progress(a));
    case "last":
      return sorted.sort((a, b) => progress(a) - progress(b));
    case "strong":
      return sorted.sort((a, b) => b.hp - a.hp || progress(b) - progress(a));
    case "close":
      return sorted.sort(
        (a, b) => Math.hypot(a.x - dog.x, a.y - dog.y) - Math.hypot(b.x - dog.x, b.y - dog.y)
      );
  }
}

/** Who an attack lands on. A howl hits everything in range; bites and balls hit up to `pierce`. */
export function chooseTargets(dog: Dog, stats: DogStats, intruders: Intruder[]): Intruder[] {
  if (stats.attack === "none") return [];
  const hittable = intruders.filter(
    (i) => i.hp > 0 && inRange(dog, stats.range, i) && canHit(stats, i)
  );
  if (stats.attack === "howl") return hittable;
  return sortForTargeting(dog, hittable, dog.targeting).slice(0, stats.pierce);
}

/** Cooldown multiplier and bonus damage a dog gets from pack dogs in range of it. */
export function packBuff(dog: Dog, dogs: Dog[]): { cooldown: number; damage: number } {
  let cooldown = 1;
  let damage = 0;
  for (const other of dogs) {
    if (other.id === dog.id) continue;
    const stats = dogStats(other);
    if (stats.packCooldown === 1 && stats.packDamage === 0) continue;
    if (!inRange(other, stats.range, dog)) continue;
    cooldown = Math.min(cooldown, stats.packCooldown);
    damage = Math.max(damage, stats.packDamage);
  }
  return { cooldown, damage };
}

/** The strongest slow any dog applies to this intruder. Bosses take half. */
export function slowFor(intruder: Pick<Intruder, "type" | "x" | "y">, dogs: Dog[]): number {
  let slow = 0;
  for (const dog of dogs) {
    if (dog.stunnedMs > 0) continue;
    const stats = dogStats(dog);
    if (stats.slow > slow && inRange(dog, stats.range, intruder)) slow = stats.slow;
  }
  return INTRUDERS[intruder.type].boss ? slow / 2 : slow;
}
