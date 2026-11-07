import type { Metadata } from "next";
import { GameCanvas } from "@/components/dog-tower-defense/GameCanvas";
import { PageHeader } from "@/components/PageHeader";
import { TodoCards } from "@/components/TodoCards";
import { todos } from "@/lib/dog-tower-defense/todos";

export const metadata: Metadata = {
  title: "Dog Tower Defense",
  description: "Place and upgrade seven dog breeds to defend the yard across twenty rounds.",
};

export default function DogTowerDefensePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <PageHeader title="Dog Tower Defense" description="Keep everything off the porch for twenty rounds." />
        <GameCanvas />
      </div>
      <TodoCards cards={todos} />
    </div>
  );
}
