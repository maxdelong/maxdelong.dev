export type IntruderType = "squirrel" | "frog";

export interface Point {
  x: number;
  y: number;
}

export interface GamePath {
  id: IntruderType;
  waypoints: Point[];
}

export interface Pond {
  bounds: { x: number; y: number; width: number; height: number };
}

export interface PlacementSpot {
  id: string;
  position: Point;
  occupiedBy: string | null;
}

export interface Dog {
  id: string;
  spotId: string;
  range: number;
  /** Milliseconds until this dog can attack again; 0 means ready. */
  cooldownMs: number;
}

export interface Intruder {
  id: string;
  type: IntruderType;
  pathProgress: number;
  alive: boolean;
  /** Wave time at which this intruder enters the yard. */
  spawnAtMs: number;
}

/** A recent dog attack, kept briefly so the canvas can draw it. */
export interface Attack {
  id: string;
  from: Point;
  to: Point;
  remainingMs: number;
}

export type GameStatus = "ready" | "playing" | "won" | "lost";

export interface GameState {
  lives: number;
  bones: number;
  dogs: Dog[];
  spots: PlacementSpot[];
  intruders: Intruder[];
  attacks: Attack[];
  /** Time since the wave started. */
  elapsedMs: number;
  status: GameStatus;
}
