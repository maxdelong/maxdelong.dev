import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { TodoCards } from "@/components/TodoCards";
import { SearchForm } from "@/components/dota-tracker/SearchForm";
import { todos } from "@/lib/dota-tracker/todos";

export const metadata: Metadata = {
  title: "Dota Tracker",
  description: "Look up a Dota 2 player's stats, recent matches and hero pool.",
};

export default async function DotaTrackerPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Dota Tracker"
        description="Search for a Dota 2 player by name or Steam ID to see their stats, recent matches and hero pool."
      />
      <SearchForm notFound={error === "not-found"} />
      <div className="mt-6">
        <TodoCards cards={todos} />
      </div>
    </div>
  );
}
