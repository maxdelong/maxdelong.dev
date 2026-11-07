import type { TodoCard } from "@/lib/todos";

export const todos: TodoCard[] = [
  {
    title: "Add to calendar",
    summary: "Download the plan as a calendar file, with an alert for each step.",
    size: "S",
  },
  {
    title: "Reorder steps",
    summary: "Drag steps into a new order. For now, steps can only be added at the end.",
    size: "S",
  },
  {
    title: "Save and reuse plans",
    summary: "Keep plans in the browser, with starters like \"catch a flight\" and \"school run\".",
    size: "S",
  },
  {
    title: "Running late mode",
    summary: "Tap through steps as you do them. If you fall behind, it tells you what to cut.",
    size: "S",
  },
  {
    title: "Everything hot at once",
    summary: "Run several steps side by side, so all the dishes in a dinner finish together.",
    size: "M",
  },
  {
    title: "Live drive times",
    summary: "Fill in the drive from real traffic. It needs a routing API.",
    size: "M",
  },
];
