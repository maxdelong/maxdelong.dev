import type { TodoCard } from "@/lib/todos";

export const todos: TodoCard[] = [
  {
    title: "Streaks and history",
    summary: "Keep past scores in the browser and show a streak and your best throw.",
    size: "S",
  },
  {
    title: "Share a link",
    summary: "Add a site link to the copied score once the production URL is set up.",
    size: "S",
  },
  {
    title: "Roll over at midnight",
    summary: "A tab left open stays on yesterday's throw until you reload it. Move it on automatically.",
    size: "S",
  },
  {
    title: "Yard obstacles",
    summary: "Add a daily fence, tree or sprinkler so days feel more different from each other.",
    size: "M",
  },
  {
    title: "Better art",
    summary: "Draw a proper yard and let the dog run for the ball, reusing the look of Dog Tower Defense.",
    size: "M",
  },
  {
    title: "Daily leaderboard",
    summary: "Compare today's throw with everyone else's. It needs Supabase, and some way to stop cheating.",
    size: "L",
  },
];
