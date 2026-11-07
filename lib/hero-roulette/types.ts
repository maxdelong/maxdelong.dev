export type Attribute = "strength" | "agility" | "intelligence" | "universal";

export type Role =
  | "Carry"
  | "Escape"
  | "Nuker"
  | "Initiator"
  | "Durable"
  | "Disabler"
  | "Support"
  | "Pusher";

export interface Hero {
  name: string;
  attribute: Attribute;
  attack: "melee" | "ranged";
  legs: number;
  roles: Role[];
}

export interface Build {
  name: string;
  plan: string;
  /** Heroes with this role get the build normally. Anyone else only gets it cursed. */
  role: Role;
  lanes: string[];
}

export interface Spin {
  hero: Hero;
  build: Build;
  /** True when the build doesn't suit the hero, on purpose. */
  cursed: boolean;
  lane: string;
  twist: string;
}
