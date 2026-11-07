import type { HeroPoolEntry } from "@/lib/dota-tracker/types";

export function HeroPool({ heroes }: Readonly<{ heroes: HeroPoolEntry[] }>) {
  if (heroes.length === 0) {
    return <p className="text-sm text-muted">No hero history found.</p>;
  }

  return (
    <ul className="divide-y divide-line rounded-lg border border-line bg-panel">
      {heroes.map((hero) => (
        <li key={hero.heroId} className="flex items-center gap-3 px-3 py-1.5 text-[13px]">
          <span className="min-w-0 flex-1 truncate font-medium text-ink">{hero.heroName}</span>
          <span className="text-muted">{hero.games} games</span>
          <span className="w-10 text-right tabular-nums text-muted">{Math.round(hero.winRate * 100)}%</span>
        </li>
      ))}
    </ul>
  );
}
