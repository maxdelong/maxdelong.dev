import type { GamePath, PlacementSpot, Pond } from "./types";

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 480;

export const PORCH: { x: number; y: number } = { x: 760, y: 240 };

export const SQUIRREL_PATH: GamePath = {
  id: "squirrel",
  waypoints: [
    { x: 0, y: 120 },
    { x: 200, y: 120 },
    { x: 200, y: 360 },
    { x: 500, y: 360 },
    { x: 500, y: 240 },
    PORCH,
  ],
};

export const POND: Pond = {
  bounds: { x: 340, y: 10, width: 110, height: 70 },
};

export const FROG_PATH: GamePath = {
  id: "frog",
  waypoints: [
    { x: 395, y: 80 },
    { x: 395, y: 200 },
    { x: 620, y: 200 },
    { x: 620, y: 240 },
    PORCH,
  ],
};

export const PATHS: GamePath[] = [SQUIRREL_PATH, FROG_PATH];

export function pathFor(type: GamePath["id"]): GamePath {
  const path = PATHS.find((p) => p.id === type);
  if (!path) throw new Error(`No path for intruder type: ${type}`);
  return path;
}

function segmentLength(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

/** Position of a point at `progress` (0-1) along a path's waypoints. */
export function pointAtProgress(
  path: GamePath,
  progress: number
): { x: number; y: number } {
  const clamped = Math.min(1, Math.max(0, progress));
  const { waypoints } = path;
  if (waypoints.length === 1) return waypoints[0];

  const segmentLengths = waypoints.slice(1).map((wp, i) => segmentLength(waypoints[i], wp));
  const totalLength = segmentLengths.reduce((sum, len) => sum + len, 0);
  const targetDistance = clamped * totalLength;

  let travelled = 0;
  for (let i = 0; i < segmentLengths.length; i++) {
    const len = segmentLengths[i];
    if (travelled + len >= targetDistance || i === segmentLengths.length - 1) {
      const remaining = len === 0 ? 0 : (targetDistance - travelled) / len;
      const a = waypoints[i];
      const b = waypoints[i + 1];
      return {
        x: a.x + (b.x - a.x) * Math.min(1, Math.max(0, remaining)),
        y: a.y + (b.y - a.y) * Math.min(1, Math.max(0, remaining)),
      };
    }
    travelled += len;
  }
  return waypoints[waypoints.length - 1];
}

export const INITIAL_PLACEMENT_SPOTS: PlacementSpot[] = [
  { id: "spot-1", position: { x: 100, y: 60 }, occupiedBy: null },
  { id: "spot-2", position: { x: 300, y: 220 }, occupiedBy: null },
  { id: "spot-3", position: { x: 100, y: 300 }, occupiedBy: null },
  { id: "spot-4", position: { x: 620, y: 320 }, occupiedBy: null },
  { id: "spot-5", position: { x: 500, y: 150 }, occupiedBy: null },
  { id: "spot-6", position: { x: 700, y: 150 }, occupiedBy: null },
];
