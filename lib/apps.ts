export type AppStatus = "available" | "coming-soon";

export interface AppEntry {
  slug: string;
  name: string;
  status: AppStatus;
  description?: string;
}

export const apps: AppEntry[] = [
  {
    slug: "dota-tracker",
    name: "Dota Tracker",
    status: "available",
    description: "Player stats and match analysis.",
  },
  {
    slug: "spotify-tracker",
    name: "Spotify Tracker",
    status: "coming-soon",
  },
  {
    slug: "dog-tower-defense",
    name: "Dog Tower Defense",
    status: "available",
    description: "Defend the yard from squirrels and frogs.",
  },
];
