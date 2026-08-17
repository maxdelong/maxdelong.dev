import { describe, expect, it } from "vitest";
import { canPlaceDog, placeDog, DOG_COST } from "@/lib/dog-tower-defense/placement";
import { INITIAL_PLACEMENT_SPOTS } from "@/lib/dog-tower-defense/paths";
import type { PlacementSpot } from "@/lib/dog-tower-defense/types";

function freshSpots(): PlacementSpot[] {
  return INITIAL_PLACEMENT_SPOTS.map((s) => ({ ...s }));
}

describe("canPlaceDog", () => {
  it("allows placement on a valid, unoccupied spot with enough bones", () => {
    const result = canPlaceDog(freshSpots(), "spot-1", DOG_COST);
    expect(result.ok).toBe(true);
  });

  it("rejects placement on an unknown spot id", () => {
    const result = canPlaceDog(freshSpots(), "not-a-spot", DOG_COST);
    expect(result.ok).toBe(false);
  });

  it("rejects placement on an already-occupied spot", () => {
    const spots = freshSpots();
    spots[0].occupiedBy = "existing-dog";
    const result = canPlaceDog(spots, "spot-1", DOG_COST);
    expect(result.ok).toBe(false);
  });

  it("rejects placement with insufficient bones", () => {
    const result = canPlaceDog(freshSpots(), "spot-1", DOG_COST - 1);
    expect(result.ok).toBe(false);
  });
});

describe("placeDog", () => {
  it("occupies the spot and deducts the cost from bones", () => {
    const spots = freshSpots();
    const result = placeDog(spots, "spot-1", DOG_COST + 5, "dog-1");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.spots.find((s) => s.id === "spot-1")?.occupiedBy).toBe("dog-1");
    expect(result.remainingBones).toBe(5);
  });

  it("does not mutate the original spots array", () => {
    const spots = freshSpots();
    placeDog(spots, "spot-1", DOG_COST, "dog-1");
    expect(spots.find((s) => s.id === "spot-1")?.occupiedBy).toBeNull();
  });
});
