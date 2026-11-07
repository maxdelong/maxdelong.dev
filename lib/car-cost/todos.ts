import type { TodoCard } from "@/lib/todos";

export const todos: TodoCard[] = [
  {
    title: "Electric cars",
    summary: "Accept miles per kWh and electricity prices, so an EV can be compared with a gas car.",
    size: "S",
  },
  {
    title: "Taxes and fees",
    summary: "Add sales tax, registration and trade-in value, which change the real price.",
    size: "S",
  },
  {
    title: "Save and share",
    summary: "Keep comparisons in the browser, and share one with a link.",
    size: "S",
  },
  {
    title: "Compare more cars",
    summary: "Allow three or more cars, and add a \"no car\" option using transit and rideshare costs.",
    size: "S",
  },
  {
    title: "Rising costs",
    summary: "Let repairs grow as the car ages, and add a gas price forecast.",
    size: "S",
  },
  {
    title: "Real-world estimates",
    summary: "Fill in mileage and resale value by make and model. It needs a data source.",
    size: "M",
  },
];
