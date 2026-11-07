import type { Metadata } from "next";
import { Roulette } from "@/components/hero-roulette/Roulette";
import { PageHeader } from "@/components/PageHeader";
import { TodoCards } from "@/components/TodoCards";
import { todos } from "@/lib/hero-roulette/todos";

export const metadata: Metadata = {
  title: "Hero Roulette",
  description: "Spin a random Dota 2 hero and a loose game plan, with punishments for rerolling.",
};

export default function HeroRoulettePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <PageHeader title="Hero Roulette" description="Let the wheel pick your next Dota 2 game." />
        <Roulette />
        <p className="mt-2 text-xs text-muted">
          Builds are loose plans written for fun, not real item data. Hero list from OpenDota.
        </p>
      </div>
      <TodoCards cards={todos} />
    </div>
  );
}
