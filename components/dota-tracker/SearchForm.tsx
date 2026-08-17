import { searchPlayer } from "@/app/dota-tracker/actions";

export function SearchForm({ notFound }: { notFound?: boolean }) {
  return (
    <form action={searchPlayer} className="flex flex-col gap-3">
      <label htmlFor="query" className="text-sm font-medium text-gray-700">
        Player name or Steam ID
      </label>
      <div className="flex gap-2">
        <input
          id="query"
          name="query"
          type="text"
          placeholder="e.g. Miracle- or 76561198012345678"
          className="w-full max-w-md rounded border border-gray-300 px-3 py-2 text-sm"
          autoComplete="off"
        />
        <button
          type="submit"
          className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Search
        </button>
      </div>
      {notFound && (
        <p className="text-sm text-red-600">
          No player found for that search. Try a different name or Steam ID.
        </p>
      )}
    </form>
  );
}
