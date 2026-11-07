import type { IntruderTypeId, Lane } from "./types";

export interface IntruderData {
  id: IntruderTypeId;
  name: string;
  emoji: string;
  lane: Lane;
  hp: number;
  /** Walking speed in pixels per second. */
  speed: number;
  bounty: number;
  /** Lives lost if it reaches the porch. */
  leak: number;
  /** Only dogs that see hidden intruders can target it. */
  hidden?: boolean;
  /** Bites and balls bounce off unless the dog can hit prickly intruders. */
  prickly?: boolean;
  /** Stuns nearby dogs when defeated. */
  spray?: boolean;
  /** Bosses take half the slow from herding. */
  boss?: boolean;
  /** What it splits into when defeated. */
  splitsInto?: { type: IntruderTypeId; count: number };
  note: string;
}

export const INTRUDERS: Record<IntruderTypeId, IntruderData> = {
  squirrel: { id: "squirrel", name: "Squirrel", emoji: "🐿️", lane: "yard", hp: 1, speed: 75, bounty: 2, leak: 1, note: "Plain and plentiful." },
  rabbit: { id: "rabbit", name: "Rabbit", emoji: "🐇", lane: "yard", hp: 2, speed: 140, bounty: 4, leak: 1, note: "Very fast." },
  frog: { id: "frog", name: "Frog", emoji: "🐸", lane: "pond", hp: 3, speed: 55, bounty: 4, leak: 1, note: "Comes from the pond, on the shorter path." },
  cat: { id: "cat", name: "Cat", emoji: "🐈", lane: "yard", hp: 5, speed: 80, bounty: 8, leak: 2, hidden: true, note: "Hidden. Needs a dog that can see it." },
  hedgehog: { id: "hedgehog", name: "Hedgehog", emoji: "🦔", lane: "yard", hp: 8, speed: 45, bounty: 10, leak: 2, prickly: true, note: "Prickly. Bites and balls bounce off." },
  raccoon: { id: "raccoon", name: "Raccoon", emoji: "🦝", lane: "yard", hp: 20, speed: 50, bounty: 15, leak: 3, note: "Tough." },
  skunk: { id: "skunk", name: "Skunk", emoji: "🦨", lane: "yard", hp: 10, speed: 60, bounty: 12, leak: 2, spray: true, note: "Sprays when defeated, stunning nearby dogs." },
  duckling: { id: "duckling", name: "Duckling", emoji: "🐥", lane: "pond", hp: 3, speed: 90, bounty: 2, leak: 1, note: "Comes out of a defeated duck." },
  duck: { id: "duck", name: "Big Duck", emoji: "🦆", lane: "pond", hp: 70, speed: 32, bounty: 30, leak: 6, boss: true, splitsInto: { type: "duckling", count: 4 }, note: "Boss. Splits into ducklings." },
  swan: { id: "swan", name: "Furious Swan", emoji: "🦢", lane: "pond", hp: 1300, speed: 16, bounty: 200, leak: 40, boss: true, splitsInto: { type: "duck", count: 3 }, note: "Final boss. Splits into big ducks." },
};
