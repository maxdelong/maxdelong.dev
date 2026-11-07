import type { TodoCard } from "@/lib/todos";

export const todos: TodoCard[] = [
  {
    title: "Tune difficulty from real games",
    summary: "Balance has only been tested by a bot. Adjust it after people have played full games.",
    size: "S",
  },
  {
    title: "Keyboard play",
    summary: "The canvas can't be played with a keyboard or screen reader. Add a keyboard way to place and select dogs.",
    size: "M",
  },
  {
    title: "Challenge of the day",
    summary: "A daily rule, like \"no Shepherds\" or \"one dog per breed\", with no backend at all.",
    size: "M",
  },
  {
    title: "Leaderboard",
    summary: "Rank fewest dogs and most lives left. It would be the first thing here to need Supabase.",
    size: "L",
  },
];
