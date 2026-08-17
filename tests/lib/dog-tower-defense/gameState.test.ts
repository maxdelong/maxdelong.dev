import { describe, expect, it } from "vitest";
import { createInitialGameState, restart, tick, tryPlaceDog } from "@/lib/dog-tower-defense/gameState";
import type { GameState } from "@/lib/dog-tower-defense/types";

describe("tick: win/lose evaluation", () => {
  it("declares a win once every intruder is defeated with lives remaining", () => {
    const state: GameState = {
      ...createInitialGameState(),
      lives: 3,
      intruders: [
        { id: "a", type: "squirrel", pathProgress: 0.5, alive: false },
        { id: "b", type: "frog", pathProgress: 0.3, alive: false },
      ],
    };

    const result = tick(state);

    expect(result.status).toBe("won");
  });

  it("declares a loss the instant lives reach zero, without needing the wave to finish", () => {
    const state: GameState = {
      ...createInitialGameState(),
      lives: 1,
      intruders: [
        { id: "a", type: "squirrel", pathProgress: 0.999, alive: true },
        { id: "b", type: "frog", pathProgress: 0.1, alive: true },
      ],
    };

    const result = tick(state);

    expect(result.lives).toBe(0);
    expect(result.status).toBe("lost");
  });

  it("does not change status while the wave is still in progress", () => {
    const state: GameState = {
      ...createInitialGameState(),
      lives: 5,
      intruders: [{ id: "a", type: "squirrel", pathProgress: 0.1, alive: true }],
    };

    const result = tick(state);

    expect(result.status).toBe("playing");
  });

  it("does not advance state once the game has ended", () => {
    const state: GameState = { ...createInitialGameState(), status: "lost", lives: 0 };

    const result = tick(state);

    expect(result).toEqual(state);
  });
});

describe("restart", () => {
  it("resets lives, bones, dogs, and spots to their starting values", () => {
    const played = tryPlaceDog(createInitialGameState(), "spot-1");
    expect(played.dogs.length).toBe(1);

    const fresh = restart();

    expect(fresh.dogs).toEqual([]);
    expect(fresh.lives).toBe(createInitialGameState().lives);
    expect(fresh.bones).toBe(createInitialGameState().bones);
    expect(fresh.spots.every((s) => s.occupiedBy === null)).toBe(true);
    expect(fresh.status).toBe("playing");
  });
});
