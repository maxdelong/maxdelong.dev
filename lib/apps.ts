import { todos as agenticDevTodos } from "./agentic-dev/todos";
import { todos as carCostTodos } from "./car-cost/todos";
import { todos as dailyFetchTodos } from "./daily-fetch/todos";
import { todos as dogTowerDefenseTodos } from "./dog-tower-defense/todos";
import { todos as dotaTrackerTodos } from "./dota-tracker/todos";
import { todos as emojiSearchTodos } from "./emoji-search/todos";
import { todos as heroRouletteTodos } from "./hero-roulette/todos";
import { todos as lunchRouletteTodos } from "./lunch-roulette/todos";
import type { TodoCard } from "./todos";
import { todos as workBackwardTodos } from "./work-backward/todos";

export type AppStatus = "available" | "coming-soon";

export interface AppEntry {
  slug: string;
  name: string;
  status: AppStatus;
  icon: string;
  description: string;
  /** A short label shown on the home page card. */
  kind: string;
  /** Possible improvements, kept in `lib/<slug>/todos.ts`. */
  todos: TodoCard[];
}

export const apps: AppEntry[] = [
  {
    slug: "dog-tower-defense",
    name: "Dog Tower Defense",
    status: "available",
    icon: "🐕",
    description: "Seven breeds, twenty rounds and one furious swan. Defend the yard.",
    kind: "Game",
    todos: dogTowerDefenseTodos,
  },
  {
    slug: "daily-fetch",
    name: "Daily Fetch",
    status: "available",
    icon: "🎾",
    description: "Same wind and same dog for everyone. You get one throw a day.",
    kind: "Game",
    todos: dailyFetchTodos,
  },
  {
    slug: "hero-roulette",
    name: "Hero Roulette",
    status: "available",
    icon: "🎰",
    description: "Spin a random Dota 2 hero and a loose game plan. Rerolling will cost you.",
    kind: "Toy",
    todos: heroRouletteTodos,
  },
  {
    slug: "lunch-roulette",
    name: "Lunch Roulette",
    status: "available",
    icon: "🌮",
    description: "Spin your own list of places. Vetoes come with punishments.",
    kind: "Toy",
    todos: lunchRouletteTodos,
  },
  {
    slug: "car-cost",
    name: "True Cost of a Car",
    status: "available",
    icon: "🚗",
    description: "Compare two cars by what they really cost per month and per mile.",
    kind: "Tool",
    todos: carCostTodos,
  },
  {
    slug: "work-backward",
    name: "Work Backward",
    status: "available",
    icon: "⏪",
    description: "Enter when you need to be there and find out when to start.",
    kind: "Tool",
    todos: workBackwardTodos,
  },
  {
    slug: "emoji-search",
    name: "Emoji Search",
    status: "available",
    icon: "🔍",
    description: "Find any emoji by name, keyword or category, and copy it with one click.",
    kind: "Tool",
    todos: emojiSearchTodos,
  },
  {
    slug: "agentic-dev",
    name: "Agentic Dev",
    status: "available",
    icon: "🤖",
    description: "What's new with loops and harnesses, which tools to use, and the evidence behind it.",
    kind: "Guide",
    todos: agenticDevTodos,
  },
  {
    slug: "dota-tracker",
    name: "Dota Tracker",
    status: "available",
    icon: "⚔️",
    description: "Look up a Dota 2 player's stats, recent matches and hero pool.",
    kind: "Tool",
    todos: dotaTrackerTodos,
  },
  {
    slug: "spotify-tracker",
    name: "Spotify Tracker",
    status: "coming-soon",
    icon: "🎧",
    description: "Listening stats and history. Not built yet.",
    kind: "Tool",
    todos: [],
  },
];
