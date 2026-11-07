import type { Metadata } from "next";
import { LunchRouletteLoader } from "@/components/lunch-roulette/LunchRouletteLoader";
import { PageHeader } from "@/components/PageHeader";
import { TodoCards } from "@/components/TodoCards";
import { todos } from "@/lib/lunch-roulette/todos";

export const metadata: Metadata = {
  title: "Lunch Roulette",
  description: "Spin your own list of lunch places. Vetoes come with punishments.",
};

export default function LunchRoulettePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <PageHeader
          title="Lunch Roulette"
          description="Let the wheel settle it. Your list stays in this browser."
        />
        <LunchRouletteLoader />
      </div>
      <TodoCards cards={todos} />
    </div>
  );
}
