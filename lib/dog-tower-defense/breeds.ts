import type { BreedId, Dog, DogStats, PathIndex } from "./types";

export const MAX_TIER = 3;

export interface UpgradeEffect {
  attack?: DogStats["attack"];
  /** Added to damage. */
  damage?: number;
  /** Multiplies cooldown. */
  cooldown?: number;
  /** Multiplies range. */
  range?: number;
  /** Added to pierce. */
  pierce?: number;
  seesHidden?: boolean;
  hitsPrickly?: boolean;
  /** Replaces slow. */
  slow?: number;
  /** Added to bones per round. */
  bonesPerRound?: number;
  /** Added to bonus bounty. */
  bonusBounty?: number;
  /** Replaces pack cooldown multiplier. */
  packCooldown?: number;
  /** Added to pack damage. */
  packDamage?: number;
  hasAbility?: boolean;
}

export interface Upgrade {
  name: string;
  cost: number;
  description: string;
  effect: UpgradeEffect;
}

export interface Breed {
  id: BreedId;
  name: string;
  role: string;
  description: string;
  cost: number;
  base: DogStats;
  pathNames: [string, string];
  paths: [Upgrade[], Upgrade[]];
  art: {
    fur: string;
    accent: string;
    ears: "pointy" | "floppy" | "big";
    earColor?: string;
    /** A marking across the top of the head. */
    cap?: string;
  };
}

const NO_STATS: DogStats = {
  attack: "bite",
  damage: 1,
  cooldownMs: 1000,
  range: 100,
  pierce: 1,
  seesHidden: false,
  hitsPrickly: false,
  slow: 0,
  bonesPerRound: 0,
  bonusBounty: 0,
  packCooldown: 1,
  packDamage: 0,
  hasAbility: false,
};

export const BREEDS: Record<BreedId, Breed> = {
  chihuahua: {
    id: "chihuahua",
    name: "Chihuahua",
    role: "Cheap and furious",
    description: "Bites very fast, but only what comes right up to it.",
    cost: 90,
    base: { ...NO_STATS, damage: 1, cooldownMs: 480, range: 62 },
    pathNames: ["Fury", "Reach"],
    paths: [
      [
        { name: "Yappy", cost: 60, description: "Bites 20% faster.", effect: { cooldown: 0.8 } },
        { name: "Ankle Biter", cost: 140, description: "+1 damage.", effect: { damage: 1 } },
        {
          name: "Tiny Tyrant",
          cost: 420,
          description: "Bites 40% faster and +1 damage.",
          effect: { cooldown: 0.6, damage: 1 },
        },
      ],
      [
        { name: "Big Zoomies", cost: 70, description: "40% more range.", effect: { range: 1.4 } },
        { name: "Sniffles", cost: 120, description: "Sees hidden intruders.", effect: { seesHidden: true } },
        {
          name: "Sharp Little Teeth",
          cost: 300,
          description: "Hurts prickly intruders and bites 2 at once.",
          effect: { hitsPrickly: true, pierce: 1 },
        },
      ],
    ],
    art: { fur: "#d9b382", accent: "#f2dfc4", ears: "big" },
  },
  beagle: {
    id: "beagle",
    name: "Beagle",
    role: "The nose",
    description: "Reliable all-rounder that can smell hidden intruders.",
    cost: 130,
    base: { ...NO_STATS, damage: 1, cooldownMs: 700, range: 110, seesHidden: true },
    pathNames: ["Tracker", "Jaws"],
    paths: [
      [
        { name: "Bloodhound Nose", cost: 90, description: "25% more range.", effect: { range: 1.25 } },
        { name: "Treat Tracker", cost: 140, description: "+1 bone per defeat.", effect: { bonusBounty: 1 } },
        {
          name: "Baying Hunter",
          cost: 450,
          description: "Bites 40% faster and +2 damage.",
          effect: { cooldown: 0.6, damage: 2 },
        },
      ],
      [
        { name: "Double Bite", cost: 110, description: "Bites 2 at once.", effect: { pierce: 1 } },
        { name: "Strong Jaw", cost: 200, description: "+1 damage.", effect: { damage: 1 } },
        {
          name: "Spine Crunch",
          cost: 500,
          description: "Hurts prickly intruders and +2 damage.",
          effect: { hitsPrickly: true, damage: 2 },
        },
      ],
    ],
    art: { fur: "#a9682f", accent: "#f7efe3", ears: "floppy" },
  },
  corgi: {
    id: "corgi",
    name: "Corgi",
    role: "Herder",
    description: "Doesn't bite at first. Slows every intruder in range.",
    cost: 150,
    base: { ...NO_STATS, attack: "none", damage: 0, range: 90, pierce: 0, slow: 0.3 },
    pathNames: ["Herding", "Nips"],
    paths: [
      [
        { name: "Firm Herding", cost: 100, description: "Slows by 40%.", effect: { slow: 0.4 } },
        { name: "Wide Circles", cost: 160, description: "30% more range.", effect: { range: 1.3 } },
        {
          name: "Total Herd",
          cost: 400,
          description: "Slows by 60% with 20% more range.",
          effect: { slow: 0.6, range: 1.2 },
        },
      ],
      [
        {
          name: "Heel Nips",
          cost: 120,
          description: "Starts biting.",
          effect: { attack: "bite", damage: 1, pierce: 1, cooldown: 0.9 },
        },
        { name: "Low Rider", cost: 220, description: "+1 damage, bites 2 at once.", effect: { damage: 1, pierce: 1 } },
        {
          name: "Royal Corgi",
          cost: 550,
          description: "Bites twice as fast and +2 damage.",
          effect: { cooldown: 0.5, damage: 2 },
        },
      ],
    ],
    art: { fur: "#e58f3c", accent: "#fff6ea", ears: "pointy" },
  },
  labrador: {
    id: "labrador",
    name: "Labrador",
    role: "Long range",
    description: "Throws tennis balls across the yard, hitting several intruders.",
    cost: 200,
    base: { ...NO_STATS, attack: "ball", damage: 2, cooldownMs: 1300, range: 170, pierce: 3 },
    pathNames: ["Fetch", "Arm"],
    paths: [
      [
        { name: "Bigger Ball", cost: 130, description: "Hits 2 more.", effect: { pierce: 2 } },
        { name: "Slobber Ball", cost: 240, description: "+1 damage.", effect: { damage: 1 } },
        {
          name: "Ball Launcher",
          cost: 700,
          description: "Throws twice as fast and hits 3 more.",
          effect: { cooldown: 0.5, pierce: 3 },
        },
      ],
      [
        { name: "Long Throw", cost: 90, description: "25% more range.", effect: { range: 1.25 } },
        { name: "Keen Eye", cost: 150, description: "Sees hidden intruders.", effect: { seesHidden: true } },
        {
          name: "Spiky Ball",
          cost: 500,
          description: "Hurts prickly intruders and +2 damage.",
          effect: { hitsPrickly: true, damage: 2 },
        },
      ],
    ],
    art: { fur: "#e8cf8f", accent: "#c9a968", ears: "floppy" },
  },
  husky: {
    id: "husky",
    name: "Husky",
    role: "Area damage",
    description: "Howls at everything in range at once, spines included.",
    cost: 300,
    base: { ...NO_STATS, attack: "howl", damage: 2, cooldownMs: 2000, range: 95, pierce: 0, hitsPrickly: true },
    pathNames: ["Howl", "Drama"],
    paths: [
      [
        { name: "Louder", cost: 150, description: "20% more range.", effect: { range: 1.2 } },
        { name: "Chorus", cost: 280, description: "Howls 30% faster.", effect: { cooldown: 0.7 } },
        {
          name: "Blizzard Howl",
          cost: 800,
          description: "+3 damage and howls 20% faster.",
          effect: { damage: 3, cooldown: 0.8 },
        },
      ],
      [
        { name: "Chilling Stare", cost: 120, description: "Slows by 20%.", effect: { slow: 0.2 } },
        { name: "Ice Breath", cost: 260, description: "+1 damage.", effect: { damage: 1 } },
        {
          name: "Wolf Ears",
          cost: 700,
          description: "Sees hidden intruders and +2 damage.",
          effect: { seesHidden: true, damage: 2 },
        },
      ],
    ],
    art: { fur: "#f1f4f7", accent: "#ffffff", ears: "pointy", earColor: "#6d7886", cap: "#6d7886" },
  },
  golden: {
    id: "golden",
    name: "Golden Retriever",
    role: "Support",
    description: "Doesn't fight. Fetches bones every round and encourages nearby dogs.",
    cost: 250,
    base: { ...NO_STATS, attack: "none", damage: 0, range: 110, pierce: 0, bonesPerRound: 60 },
    pathNames: ["Fetching", "Good Boy"],
    paths: [
      [
        { name: "Extra Fetch", cost: 150, description: "+40 bones per round.", effect: { bonesPerRound: 40 } },
        { name: "Bone Stash", cost: 280, description: "+70 bones per round.", effect: { bonesPerRound: 70 } },
        { name: "Buried Treasure", cost: 900, description: "+150 bones per round.", effect: { bonesPerRound: 150 } },
      ],
      [
        { name: "Tail Wags", cost: 200, description: "Dogs in range attack 12% faster.", effect: { packCooldown: 0.88 } },
        { name: "Zoomies Together", cost: 400, description: "Dogs in range attack 22% faster.", effect: { packCooldown: 0.78 } },
        {
          name: "Best Friend",
          cost: 1000,
          description: "Dogs in range attack 30% faster with +1 damage.",
          effect: { packCooldown: 0.7, packDamage: 1 },
        },
      ],
    ],
    art: { fur: "#d9a441", accent: "#f0cd7c", ears: "floppy" },
  },
  shepherd: {
    id: "shepherd",
    name: "German Shepherd",
    role: "The best dog",
    description: "Hits hardest, sees hidden intruders, ignores spines and bites two at once.",
    cost: 500,
    base: {
      ...NO_STATS,
      damage: 5,
      cooldownMs: 550,
      range: 150,
      pierce: 2,
      seesHidden: true,
      hitsPrickly: true,
    },
    pathNames: ["K-9 Unit", "Protection"],
    paths: [
      [
        { name: "Scent Work", cost: 250, description: "20% more range.", effect: { range: 1.2 } },
        { name: "Takedown", cost: 600, description: "+4 damage.", effect: { damage: 4 } },
        {
          name: "Alpha Command",
          cost: 1500,
          description: "Unlocks an ability: every dog attacks 3x as fast for 8s.",
          effect: { hasAbility: true },
        },
      ],
      [
        { name: "Steel Jaws", cost: 300, description: "Bites 3 at once.", effect: { pierce: 1 } },
        { name: "Rapid Response", cost: 600, description: "Bites 30% faster.", effect: { cooldown: 0.7 } },
        {
          name: "Pack Leader",
          cost: 1800,
          description: "+5 damage. Dogs in range attack 25% faster with +2 damage.",
          effect: { damage: 5, packCooldown: 0.75, packDamage: 2 },
        },
      ],
    ],
    art: { fur: "#c98f4a", accent: "#2f241c", ears: "pointy", earColor: "#241b15", cap: "#241b15" },
  },
};

export const BREED_LIST: Breed[] = [
  BREEDS.chihuahua,
  BREEDS.beagle,
  BREEDS.corgi,
  BREEDS.labrador,
  BREEDS.husky,
  BREEDS.golden,
  BREEDS.shepherd,
];

const statsCache = new Map<string, DogStats>();

/** A dog's stats with its upgrades applied, before any pack buffs. */
export function statsFor(breed: BreedId, tiers: readonly [number, number]): DogStats {
  const key = `${breed}:${tiers[0]}:${tiers[1]}`;
  const cached = statsCache.get(key);
  if (cached) return cached;

  const data = BREEDS[breed];
  const stats = { ...data.base };
  data.paths.forEach((path, p) => {
    for (const { effect } of path.slice(0, tiers[p])) {
      if (effect.attack) stats.attack = effect.attack;
      stats.damage += effect.damage ?? 0;
      stats.cooldownMs *= effect.cooldown ?? 1;
      stats.range *= effect.range ?? 1;
      stats.pierce += effect.pierce ?? 0;
      stats.seesHidden ||= effect.seesHidden ?? false;
      stats.hitsPrickly ||= effect.hitsPrickly ?? false;
      stats.slow = effect.slow ?? stats.slow;
      stats.bonesPerRound += effect.bonesPerRound ?? 0;
      stats.bonusBounty += effect.bonusBounty ?? 0;
      stats.packCooldown = effect.packCooldown ?? stats.packCooldown;
      stats.packDamage += effect.packDamage ?? 0;
      stats.hasAbility ||= effect.hasAbility ?? false;
    }
  });

  statsCache.set(key, stats);
  return stats;
}

export function dogStats(dog: Pick<Dog, "breed" | "tiers">): DogStats {
  return statsFor(dog.breed, dog.tiers);
}

/** The next upgrade on a path, or null if it's maxed or locked. Only one path can pass tier 1. */
export function nextUpgrade(dog: Pick<Dog, "breed" | "tiers">, path: PathIndex): Upgrade | null {
  const tier = dog.tiers[path];
  if (tier >= MAX_TIER) return null;
  const other = dog.tiers[path === 0 ? 1 : 0];
  if (tier >= 1 && other >= 2) return null;
  return BREEDS[dog.breed].paths[path][tier];
}

/** Damage per second against one target, a simple way to compare dogs. */
export function singleTargetDps(stats: DogStats): number {
  return stats.attack === "none" ? 0 : (stats.damage / stats.cooldownMs) * 1000;
}
