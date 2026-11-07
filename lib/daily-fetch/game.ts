const GRAVITY = 9.8;
const MIN_DOG_DISTANCE = 15;
const MAX_DOG_DISTANCE = 40;
const MAX_WIND = 2.5;

export const MIN_ANGLE = 10;
export const MAX_ANGLE = 80;
export const MIN_POWER = 5;
export const MAX_POWER = 25;

export interface Day {
  /** Meters from the thrower to the dog. */
  dogDistance: number;
  /** Sideways push on the ball in m/s². Positive blows toward the dog. */
  wind: number;
}

export interface Aim {
  angle: number;
  power: number;
}

export interface Flight {
  /** Seconds in the air. */
  duration: number;
  /** Where the ball lands, in meters from the thrower. Negative is behind them. */
  landing: number;
  /** Meters between the landing spot and the dog. */
  miss: number;
}

/** The player's calendar date, like 2026-11-06. */
export function dateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Turns a date into a number from 0 up to 1. FNV-1a, then one mulberry32 step per draw. */
function seededRandom(key: string): () => number {
  let state = 2166136261;
  for (const char of key) {
    state = Math.imul(state ^ char.charCodeAt(0), 16777619);
  }
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

/** The same date always gives the same day, for everyone. */
export function dayFor(key: string): Day {
  const random = seededRandom(key);
  const dogDistance =
    MIN_DOG_DISTANCE + Math.floor(random() * (MAX_DOG_DISTANCE - MIN_DOG_DISTANCE + 1));
  const wind = Math.round((random() * 2 - 1) * MAX_WIND * 10) / 10;
  return { dogDistance, wind };
}

export function flightFor({ angle, power }: Aim, day: Day): Flight {
  const radians = (angle * Math.PI) / 180;
  const duration = (2 * power * Math.sin(radians)) / GRAVITY;
  const landing = positionAt({ angle, power }, day, duration).x;
  return { duration, landing, miss: Math.abs(landing - day.dogDistance) };
}

/** Where the ball is, in meters, at a time in seconds. */
export function positionAt({ angle, power }: Aim, day: Day, time: number): { x: number; y: number } {
  const radians = (angle * Math.PI) / 180;
  return {
    x: power * Math.cos(radians) * time + 0.5 * day.wind * time * time,
    y: Math.max(0, power * Math.sin(radians) * time - 0.5 * GRAVITY * time * time),
  };
}

export function verdictFor(miss: number): string {
  if (miss < 1) return "Caught it! Very good dog.";
  if (miss < 3) return "So close. The dog barely had to move.";
  if (miss < 8) return "The dog is walking over. Slowly.";
  if (miss < 20) return "The dog looked at the ball, then at you.";
  return "The dog has gone back inside.";
}

export function shareText(key: string, miss: number): string {
  return `Daily Fetch ${key} 🎾 ${miss.toFixed(1)} m from the dog`;
}
