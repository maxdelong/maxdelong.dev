import { HEROES } from "./heroes";
import type { Build, Spin } from "./types";

export const CURSED_CHANCE = 0.15;

export const BUILDS: Build[] = [
  {
    name: "Right-click everything",
    plan: "Farm until the enemy gets nervous, then hit people until the game ends.",
    role: "Carry",
    lanes: ["Safe lane", "Mid"],
  },
  {
    name: "Spell slinger",
    plan: "Max your biggest spell, buy mana, and delete someone in every fight.",
    role: "Nuker",
    lanes: ["Mid", "Off lane", "Soft support"],
  },
  {
    name: "Unkillable nuisance",
    plan: "Buy health and armor, walk in first, and refuse to die about it.",
    role: "Durable",
    lanes: ["Off lane"],
  },
  {
    name: "Professional menace",
    plan: "Build for cooldowns. Somebody on the enemy team is always stuck.",
    role: "Disabler",
    lanes: ["Off lane", "Soft support", "Hard support"],
  },
  {
    name: "First one in",
    plan: "Get a way to jump in, start every fight, and hope your team noticed.",
    role: "Initiator",
    lanes: ["Off lane", "Soft support"],
  },
  {
    name: "Ghost",
    plan: "Build mobility, never be where they expect, and catch whoever walks alone.",
    role: "Escape",
    lanes: ["Mid", "Safe lane"],
  },
  {
    name: "Team's favorite",
    plan: "Buy the wards, save the carry, and accept that nobody will thank you.",
    role: "Support",
    lanes: ["Soft support", "Hard support"],
  },
  {
    name: "Tower problem",
    plan: "Skip the team fight. Take buildings until someone has to deal with you.",
    role: "Pusher",
    lanes: ["Off lane", "Mid"],
  },
];

export const TWISTS: string[] = [
  "Announce your ultimate before you use it, like a wrestler.",
  "Your first big purchase has to be something nobody asked for.",
  "Say \"as the wheel intended\" every time something goes well.",
  "Name your hero's grudge in chat, then hold it all game.",
  "Taunt at the enemy fountain if you ever get close enough.",
  "Every kill needs a catchphrase. Keep the same one all game.",
  "You must buy one item purely because it looks cool.",
  "Narrate your deaths in the third person.",
  "Pick one enemy as your nemesis and tell them why.",
  "Stand next to your support for one full minute, for morale.",
];

/**
 * What each reroll costs. The first is free, then these stack up in order. Once
 * they run out, so do the rerolls.
 */
export const REROLL_PENALTIES: string[] = [
  "Apologize to the hero you just rejected, out loud.",
  "Buy the first ward, whatever your role is.",
  "Say \"glhf\" and actually mean it.",
  "Compliment the enemy mid in all chat.",
  "Thank your support by name.",
  "Tell your team this was the wheel's fault, not yours.",
];

export const MAX_REROLLS = REROLL_PENALTIES.length + 1;

function pick<T>(items: readonly T[], rng: () => number): T {
  return items[Math.floor(rng() * items.length)];
}

/** Rolls a hero and a plan for them. `previousHero` can't come up twice in a row. */
export function spin(rng: () => number = Math.random, previousHero?: string): Spin {
  const hero = pick(
    HEROES.filter((candidate) => candidate.name !== previousHero),
    rng
  );
  const cursed = rng() < CURSED_CHANCE;
  const build = pick(
    BUILDS.filter((candidate) => hero.roles.includes(candidate.role) !== cursed),
    rng
  );
  return { hero, build, cursed, lane: pick(build.lanes, rng), twist: pick(TWISTS, rng) };
}

export function canReroll(rerolls: number): boolean {
  return rerolls < MAX_REROLLS;
}

/** The penalties owed after this many rerolls. */
export function penaltiesFor(rerolls: number): string[] {
  return REROLL_PENALTIES.slice(0, Math.max(0, rerolls - 1));
}
