import type { TodoCard } from "@/lib/todos";

export const todos: TodoCard[] = [
  {
    title: "Keep it fresh",
    summary: "This page is a snapshot that goes stale quickly. Rerun the research on a schedule and review the changes.",
    size: "M",
  },
  {
    title: "Live release feed",
    summary: "Pull the \"new this week\" list straight from each tool's changelog.",
    size: "M",
  },
  {
    title: "Run real comparisons",
    summary: "Give each agent the same tasks in this repo, then publish the time, cost and results.",
    size: "M",
  },
  {
    title: "Starter templates",
    summary: "Add copyable examples of a safe loop, a short AGENTS.md and a set of hooks.",
    size: "S",
  },
  {
    title: "AI digest",
    summary: "Have AI summarize what changed each week, with every claim linked to its source.",
    size: "L",
  },
  {
    title: "More tools",
    summary: "Check the loop features of Cline, Gemini CLI, goose, Devin and others.",
    size: "S",
  },
];
