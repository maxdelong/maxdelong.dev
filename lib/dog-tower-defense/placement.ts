import type { PlacementSpot } from "./types";

export const DOG_COST = 3;

export type PlacementCheck = { ok: true } | { ok: false; reason: string };

export function canPlaceDog(
  spots: PlacementSpot[],
  spotId: string,
  bones: number
): PlacementCheck {
  const spot = spots.find((s) => s.id === spotId);
  if (!spot) return { ok: false, reason: "not-a-valid-spot" };
  if (spot.occupiedBy) return { ok: false, reason: "spot-occupied" };
  if (bones < DOG_COST) return { ok: false, reason: "insufficient-bones" };
  return { ok: true };
}

export type PlaceDogResult =
  | { ok: true; spots: PlacementSpot[]; remainingBones: number }
  | { ok: false; reason: string };

export function placeDog(
  spots: PlacementSpot[],
  spotId: string,
  bones: number,
  dogId: string
): PlaceDogResult {
  const check = canPlaceDog(spots, spotId, bones);
  if (!check.ok) return check;

  const nextSpots = spots.map((s) =>
    s.id === spotId ? { ...s, occupiedBy: dogId } : s
  );

  return { ok: true, spots: nextSpots, remainingBones: bones - DOG_COST };
}
