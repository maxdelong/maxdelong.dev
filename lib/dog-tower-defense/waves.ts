import type { IntruderTypeId, PendingSpawn } from "./types";

export interface WaveGroup {
  type: IntruderTypeId;
  count: number;
  gapMs: number;
  /** When this group starts, from the start of the round. */
  delayMs?: number;
}

function group(type: IntruderTypeId, count: number, gapMs: number, delayMs = 0): WaveGroup {
  return { type, count, gapMs, delayMs };
}

export const WAVES: WaveGroup[][] = [
  /*  1 */ [group("squirrel", 10, 800)],
  /*  2 */ [group("squirrel", 15, 600), group("frog", 4, 1500, 2000)],
  /*  3 */ [group("squirrel", 15, 500), group("frog", 8, 900), group("rabbit", 5, 800, 4000)],
  /*  4 */ [group("rabbit", 12, 500), group("frog", 10, 700)],
  /*  5 */ [group("squirrel", 30, 280), group("cat", 3, 1500, 3000)],
  /*  6 */ [group("frog", 20, 450), group("cat", 6, 900)],
  /*  7 */ [group("hedgehog", 5, 1200), group("rabbit", 15, 400, 1000)],
  /*  8 */ [group("raccoon", 4, 1800), group("squirrel", 30, 250)],
  /*  9 */ [group("skunk", 5, 1500), group("cat", 10, 700)],
  /* 10 */ [group("frog", 15, 400), group("duck", 1, 0, 4000)],
  /* 11 */ [group("hedgehog", 12, 700), group("rabbit", 30, 280)],
  /* 12 */ [group("raccoon", 10, 900), group("skunk", 5, 1500, 2000)],
  /* 13 */ [group("cat", 25, 400), group("frog", 30, 300)],
  /* 14 */ [group("duck", 3, 3500), group("hedgehog", 10, 800, 1000)],
  /* 15 */ [group("raccoon", 20, 550), group("cat", 20, 450)],
  /* 16 */ [group("skunk", 15, 650), group("rabbit", 50, 180)],
  /* 17 */ [group("duck", 6, 2200), group("raccoon", 15, 650)],
  /* 18 */ [group("hedgehog", 30, 350), group("cat", 30, 320)],
  /* 19 */ [group("duck", 10, 1500), group("skunk", 20, 500), group("raccoon", 20, 500)],
  /* 20 */ [group("swan", 1, 0), group("rabbit", 40, 300, 3000), group("cat", 20, 500, 6000)],
];

export const TOTAL_ROUNDS = WAVES.length;

export function spawnsForRound(round: number): PendingSpawn[] {
  return WAVES[round - 1]
    .flatMap(({ type, count, gapMs, delayMs = 0 }) =>
      Array.from({ length: count }, (_, i) => ({ type, atMs: delayMs + i * gapMs }))
    )
    .sort((a, b) => a.atMs - b.atMs);
}

/** How many of each intruder a round sends, for the "next round" preview. */
export function roundPreview(round: number): { type: IntruderTypeId; count: number }[] {
  return WAVES[round - 1].map(({ type, count }) => ({ type, count }));
}
