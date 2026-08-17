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
}

export interface Intruder {
  id: string;
  type: IntruderType;
  pathProgress: number;
  alive: boolean;
}

export type GameStatus = "playing" | "won" | "lost";

export interface GameState {
  lives: number;
  bones: number;
  dogs: Dog[];
  spots: PlacementSpot[];
  intruders: Intruder[];
  status: GameStatus;
}
