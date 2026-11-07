import type { TodoCard } from "@/lib/todos";

export const todos: TodoCard[] = [
  {
    title: "Show what people actually build",
    summary:
      "Fetch popular items for the rolled hero from OpenDota's itemPopularity endpoint and show them next to the joke plan.",
    size: "M",
  },
  {
    title: "Compare more build sources",
    summary:
      "Add a second source, such as Stratz, to compare against OpenDota. Check each API's token and usage terms first.",
    size: "M",
  },
  {
    title: "AI meta digest",
    summary:
      "On a schedule, have AI summarize how each hero's builds are shifting. It needs a cron job, stored results in Supabase and a spending cap.",
    size: "L",
  },
  {
    title: "Keep the hero list current",
    summary: "The list is a snapshot from OpenDota. Refresh it automatically so new heroes appear.",
    size: "S",
  },
  {
    title: "Share a spin",
    summary: "Copy the result or share a link, so friends can hold you to your punishments.",
    size: "S",
  },
  {
    title: "Filters",
    summary: "Limit spins by role, attribute or attack type, and ban heroes you refuse to play.",
    size: "S",
  },
  {
    title: "Hero portraits",
    summary: "Add a portrait to the result card and check the terms for using the images.",
    size: "S",
  },
];
