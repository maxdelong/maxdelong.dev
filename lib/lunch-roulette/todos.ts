import type { TodoCard } from "@/lib/todos";

export const todos: TodoCard[] = [
  {
    title: "A real spinning wheel",
    summary: "Draw the list as a wheel and let it spin, instead of showing the answer right away.",
    size: "S",
  },
  {
    title: "Share a list",
    summary: "Put your places in a link so a whole office can spin the same list.",
    size: "S",
  },
  {
    title: "Don't repeat this week",
    summary: "Remember recent picks and make them less likely to come up.",
    size: "S",
  },
  {
    title: "Tags and filters",
    summary: "Tag places as cheap, quick or walkable, then spin only the ones that fit today.",
    size: "S",
  },
  {
    title: "Group vetoes",
    summary: "Give each person their own vetoes, and track who owes what.",
    size: "M",
  },
  {
    title: "Places near you",
    summary: "Fill the list from nearby restaurants. It needs a maps API and permission to use your location.",
    size: "M",
  },
];
