import type { TodoCard } from "@/lib/todos";

export const todos: TodoCard[] = [
  {
    title: "Fix MMR never displaying",
    summary: "The tracker always shows \"MMR unavailable\". Details are in the Dota Tracker known issues doc.",
    size: "S",
  },
  {
    title: "Fix name search opening the wrong player",
    summary: "Searching by name can open the wrong profile. Let people choose from the matches instead.",
    size: "S",
  },
  {
    title: "Work through the other known issues",
    summary: "The rest are listed in the Dota Tracker known issues doc.",
    size: "M",
  },
];
