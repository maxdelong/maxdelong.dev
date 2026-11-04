import { describe, expect, it } from "vitest";
import {
  DOG_RANGE,
  MAX_TICK_MS,
  SPAWN_INTERVAL_MS,
  STARTING_LIVES,
  createInitialGameState,
  restart,
  startWave,
  tick,
  tryPlaceDog,
} from "@/lib/dog-tower-defense/gameState";
import {
  FROG_PATH,
  INITIAL_PLACEMENT_SPOTS,
  SQUIRREL_PATH,
  pointAtProgress,
} from "@/lib/dog-tower-defense/paths";
import type { GamePath, GameState } from "@/lib/dog-tower-defense/types";

const FRAME_60HZ = 1000 / 60;

function playing(overrides: Partial<GameState>): GameState {
  return { ...createInitialGameState(), status: "playing", ...overrides };
}

/** Plays a full wave with dogs placed up front; `buyMore` spends bones on these spots as they come in. */
function playThrough(spotIds: string[], { frameMs = FRAME_60HZ, buyMore = [] as string[] } = {}) {
  let state = createInitialGameState();
  for (const id of spotIds) state = tryPlaceDog(state, id);
  state = startWave(state);
  for (let i = 0; state.status === "playing" && i < 1_000_000; i++) {
    for (const id of buyMore) state = tryPlaceDog(state, id);
    state = tick(state, frameMs);
  }
  return state;
}

function pathReachesSpot(path: GamePath, spot: { x: number; y: number }): boolean {
  for (let p = 0; p <= 1; p += 0.001) {
    const point = pointAtProgress(path, p);
    if (Math.hypot(point.x - spot.x, point.y - spot.y) <= DOG_RANGE) return true;
  }
  return false;
}

describe("before the wave starts", () => {
  it("waits for the player: time does not pass until the wave is started", () => {
    const state = createInitialGameState();

    expect(state.status).toBe("ready");
    expect(tick(state, 5000)).toEqual(state);
  });

  it("allows dog placement while ready", () => {
    const state = tryPlaceDog(createInitialGameState(), "spot-1");

    expect(state.dogs).toHaveLength(1);
  });

  it("startWave moves ready to playing and does not restart a finished game", () => {
    expect(startWave(createInitialGameState()).status).toBe("playing");

    const lost = playing({ status: "lost" });
    expect(startWave(lost)).toBe(lost);
  });
});

describe("tick: win/lose evaluation", () => {
  it("declares a win once every intruder is defeated with lives remaining", () => {
    const state = playing({
      lives: 3,
      intruders: [
        { id: "a", type: "squirrel", pathProgress: 0.5, alive: false, spawnAtMs: 0 },
        { id: "b", type: "frog", pathProgress: 0.3, alive: false, spawnAtMs: 0 },
      ],
    });

    expect(tick(state, FRAME_60HZ).status).toBe("won");
  });

  it("declares a loss the instant lives reach zero, without needing the wave to finish", () => {
    const state = playing({
      lives: 1,
      intruders: [
        { id: "a", type: "squirrel", pathProgress: 0.9999, alive: true, spawnAtMs: 0 },
        { id: "b", type: "frog", pathProgress: 0.1, alive: true, spawnAtMs: 0 },
      ],
    });

    const result = tick(state, FRAME_60HZ);

    expect(result.lives).toBe(0);
    expect(result.status).toBe("lost");
  });

  it("does not change status while the wave is still in progress", () => {
    const state = playing({
      intruders: [{ id: "a", type: "squirrel", pathProgress: 0.1, alive: true, spawnAtMs: 0 }],
    });

    expect(tick(state, FRAME_60HZ).status).toBe("playing");
  });

  it("does not advance state once the game has ended", () => {
    const state = playing({ status: "lost", lives: 0 });

    expect(tick(state, FRAME_60HZ)).toEqual(state);
  });
});

describe("tick: pacing", () => {
  it("spawns intruders one at a time rather than all at once", () => {
    const state = createInitialGameState();
    const spawnTimes = state.intruders.map((i) => i.spawnAtMs);

    expect(new Set(spawnTimes).size).toBe(state.intruders.length);
    expect(spawnTimes[1] - spawnTimes[0]).toBe(SPAWN_INTERVAL_MS);
  });

  it("does not move an intruder before its spawn time", () => {
    const state = playing({
      intruders: [{ id: "a", type: "squirrel", pathProgress: 0, alive: true, spawnAtMs: 5000 }],
    });

    expect(tick(state, FRAME_60HZ).intruders[0].pathProgress).toBe(0);
  });

  it("caps a long frame so a stalled tab cannot jump intruders along the path", () => {
    const state = playing({
      intruders: [{ id: "a", type: "squirrel", pathProgress: 0, alive: true, spawnAtMs: 0 }],
    });

    expect(tick(state, 60_000)).toEqual(tick(state, MAX_TICK_MS));
  });

  it("plays out the same at any frame rate", () => {
    const spots = ["spot-4", "spot-6"];
    const at60 = playThrough(spots);

    for (const frameMs of [1000 / 30, 1000 / 144]) {
      const other = playThrough(spots, { frameMs });
      expect(other.status).toBe(at60.status);
      expect(other.lives).toBe(at60.lives);
      expect(Math.abs(other.elapsedMs - at60.elapsedMs)).toBeLessThan(500);
    }
  });

  it("gives the player well over ten seconds of play", () => {
    expect(playThrough([]).elapsedMs).toBeGreaterThan(10_000);
  });
});

describe("balance", () => {
  it("every placement spot can reach a path", () => {
    for (const spot of INITIAL_PLACEMENT_SPOTS) {
      const reachable =
        pathReachesSpot(SQUIRREL_PATH, spot.position) || pathReachesSpot(FROG_PATH, spot.position);
      expect(reachable, spot.id).toBe(true);
    }
  });

  it("loses with no dogs", () => {
    expect(playThrough([]).status).toBe("lost");
  });

  it("loses with any single dog", () => {
    for (const spot of INITIAL_PLACEMENT_SPOTS) {
      expect(playThrough([spot.id]).status, spot.id).toBe("lost");
    }
  });

  it("loses when two dogs guard only the squirrel path", () => {
    expect(playThrough(["spot-1", "spot-2"]).status).toBe("lost");
  });

  it("wins when two dogs cover both paths", () => {
    const state = playThrough(["spot-1", "spot-6"]);

    expect(state.status).toBe("won");
    expect(state.lives).toBeLessThan(STARTING_LIVES);
  });

  it("rewards reinvesting bones with a cleaner win", () => {
    const allSpots = INITIAL_PLACEMENT_SPOTS.map((s) => s.id);
    const state = playThrough(["spot-1", "spot-6"], { buyMore: allSpots });

    expect(state.status).toBe("won");
    expect(state.lives).toBe(STARTING_LIVES);
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
    expect(fresh.status).toBe("ready");
  });
});
