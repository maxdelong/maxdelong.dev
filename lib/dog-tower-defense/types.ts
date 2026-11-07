export type BreedId =
  | "chihuahua"
  | "beagle"
  | "corgi"
  | "labrador"
  | "husky"
  | "golden"
  | "shepherd";

export type IntruderTypeId =
  | "squirrel"
  | "rabbit"
  | "frog"
  | "cat"
  | "hedgehog"
  | "raccoon"
  | "skunk"
  | "duckling"
  | "duck"
  | "swan";

export type Lane = "yard" | "pond";
export type AttackKind = "none" | "bite" | "ball" | "howl";
export type Targeting = "first" | "last" | "strong" | "close";
export type PathIndex = 0 | 1;

export interface Point {
  x: number;
  y: number;
}

export interface DogStats {
  attack: AttackKind;
  damage: number;
  cooldownMs: number;
  range: number;
  /** How many intruders one bite or ball can hit. Howls hit everything in range. */
  pierce: number;
  seesHidden: boolean;
  hitsPrickly: boolean;
  /** Fraction of walking speed removed from intruders in range. */
  slow: number;
  bonesPerRound: number;
  /** Extra bones when this dog finishes an intruder. */
  bonusBounty: number;
  /** Cooldown multiplier given to other dogs in range; 1 means none. */
  packCooldown: number;
  /** Damage added to other attacking dogs in range. */
  packDamage: number;
  hasAbility: boolean;
}

export interface Dog {
  id: number;
  breed: BreedId;
  x: number;
  y: number;
  /** Upgrade tier reached on each of the two paths. */
  tiers: [number, number];
  cooldownMs: number;
  stunnedMs: number;
  targeting: Targeting;
  /** Bones spent on this dog, used for the sell refund. */
  spent: number;
  defeats: number;
  abilityCooldownMs: number;
}

export interface Intruder {
  id: number;
  type: IntruderTypeId;
  lane: Lane;
  hp: number;
  /** Pixels walked along its path. */
  distance: number;
  x: number;
  y: number;
  /** Slow applied this step; drawn as a tint. */
  slowed: boolean;
}

export interface PendingSpawn {
  type: IntruderTypeId;
  atMs: number;
}

export type EffectKind = "bite" | "ball" | "howl" | "spray" | "alpha";

/** A short-lived visual; it has no effect on the simulation. */
export interface Effect {
  id: number;
  kind: EffectKind;
  from: Point;
  to: Point;
  radius: number;
  remainingMs: number;
  totalMs: number;
}

export type GameStatus = "building" | "wave" | "won" | "lost";

export interface GameState {
  status: GameStatus;
  /** The round being played, or next to be played while building. */
  round: number;
  lives: number;
  bones: number;
  dogs: Dog[];
  intruders: Intruder[];
  pending: PendingSpawn[];
  effects: Effect[];
  roundMs: number;
  /** Time left on the Alpha Command ability; 0 when inactive. */
  alphaMs: number;
  /** Unsimulated time left over from the last `advance`. */
  carryMs: number;
  nextId: number;
}
