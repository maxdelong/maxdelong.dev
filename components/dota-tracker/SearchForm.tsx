import { searchPlayer } from "@/app/dota-tracker/actions";

export function SearchForm({ notFound }: Readonly<{ notFound?: boolean }>) {
  return (
    <form action={searchPlayer} className="flex flex-col gap-1.5">
      <label htmlFor="query" className="text-xs font-medium text-muted">
        Player name or Steam ID
      </label>
      <div className="flex gap-2">
        <input
          id="query"
          name="query"
          type="text"
          placeholder="e.g. Miracle- or 76561198012345678"
          className="w-full max-w-md rounded-md border border-line bg-panel px-3 py-1.5 text-sm text-ink outline-none placeholder:text-muted focus:border-accent"
          autoComplete="off"
        />
        <button
          type="submit"
          className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-on-accent hover:opacity-90"
        >
          Search
        </button>
      </div>
      {notFound && (
        <p className="text-sm text-red-700 dark:text-red-400">
          No player found for that search. Try a different name or Steam ID.
        </p>
      )}
    </form>
  );
}
