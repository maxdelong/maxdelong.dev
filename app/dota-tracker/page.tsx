import { SearchForm } from "@/components/dota-tracker/SearchForm";

export default async function DotaTrackerPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="max-w-2xl">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Dota Tracker</h1>
      <p className="mb-6 text-gray-600">
        Search for a Dota 2 player by name or Steam ID to see their stats,
        recent matches, and hero pool.
      </p>
      <SearchForm notFound={error === "not-found"} />
    </div>
  );
}
