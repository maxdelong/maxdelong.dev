import { BREED_LIST } from "@/lib/dog-tower-defense/breeds";
import type { BreedId } from "@/lib/dog-tower-defense/types";
import { DogIcon } from "./DogIcon";

export function Shop({
  bones,
  placing,
  onChoose,
}: Readonly<{
  bones: number;
  placing: BreedId | null;
  onChoose: (breed: BreedId) => void;
}>) {
  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-2">
      {BREED_LIST.map((breed, i) => {
        const affordable = bones >= breed.cost;
        const active = placing === breed.id;
        const star = breed.id === "shepherd";
        return (
          <button
            key={breed.id}
            type="button"
            disabled={!affordable}
            aria-pressed={active}
            title={`${breed.name}: ${breed.description} (key ${i + 1})`}
            onClick={() => onChoose(breed.id)}
            className={`relative flex items-center gap-1.5 rounded-lg border px-1.5 py-1 text-left transition-colors ${
              active
                ? "border-accent bg-accent-soft"
                : star
                  ? "border-amber-400/70 bg-amber-50 enabled:hover:bg-amber-100 dark:bg-amber-400/10 dark:enabled:hover:bg-amber-400/20"
                  : "border-line bg-panel enabled:hover:bg-hover"
            } disabled:cursor-not-allowed disabled:opacity-45 ${star ? "col-span-2 sm:col-span-1 lg:col-span-2" : ""}`}
          >
            <DogIcon art={breed.art} size={30} />
            <span className="min-w-0">
              <span className="block text-xs leading-tight font-medium text-ink">{breed.name}</span>
              <span className="block text-[11px] text-muted">🦴 {breed.cost}</span>
            </span>
            {star && (
              <span className="ml-auto hidden text-[10px] font-semibold uppercase tracking-wide text-amber-700 lg:block dark:text-amber-300">
                Best dog
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
