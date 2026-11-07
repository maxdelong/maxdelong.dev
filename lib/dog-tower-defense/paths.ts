import type { Lane, Point } from "./types";

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 480;
export const PATH_WIDTH = 28;

export const PORCH: Point = { x: 760, y: 240 };

export const POND = { x: 340, y: 10, width: 110, height: 70 };

export const WAYPOINTS: Record<Lane, Point[]> = {
  yard: [
    { x: 0, y: 120 },
    { x: 200, y: 120 },
    { x: 200, y: 360 },
    { x: 500, y: 360 },
    { x: 500, y: 240 },
    PORCH,
  ],
  pond: [
    { x: 395, y: 80 },
    { x: 395, y: 200 },
    { x: 620, y: 200 },
    { x: 620, y: 240 },
    PORCH,
  ],
};

function buildLengths(points: Point[]): number[] {
  return points.slice(1).map((p, i) => Math.hypot(p.x - points[i].x, p.y - points[i].y));
}

const SEGMENTS: Record<Lane, number[]> = {
  yard: buildLengths(WAYPOINTS.yard),
  pond: buildLengths(WAYPOINTS.pond),
};

export const LANE_LENGTH: Record<Lane, number> = {
  yard: SEGMENTS.yard.reduce((sum, len) => sum + len, 0),
  pond: SEGMENTS.pond.reduce((sum, len) => sum + len, 0),
};

/** The point `distance` pixels along a lane, clamped to its ends. */
export function pointAtDistance(lane: Lane, distance: number): Point {
  const points = WAYPOINTS[lane];
  const segments = SEGMENTS[lane];
  let left = Math.max(0, distance);

  for (let i = 0; i < segments.length; i++) {
    if (left <= segments[i]) {
      const t = left / segments[i];
      return {
        x: points[i].x + (points[i + 1].x - points[i].x) * t,
        y: points[i].y + (points[i + 1].y - points[i].y) * t,
      };
    }
    left -= segments[i];
  }
  return points[points.length - 1];
}

function distanceToSegment(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(p.x - (a.x + dx * t), p.y - (a.y + dy * t));
}

export function distanceToPath(p: Point): number {
  let best = Infinity;
  for (const points of Object.values(WAYPOINTS)) {
    for (let i = 0; i < points.length - 1; i++) {
      best = Math.min(best, distanceToSegment(p, points[i], points[i + 1]));
    }
  }
  return best;
}
