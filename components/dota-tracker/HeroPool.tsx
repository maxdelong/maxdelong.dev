import type { HeroPoolEntry } from "@/lib/dota-tracker/types";

export function HeroPool({ heroes }: { heroes: HeroPoolEntry[] }) {
  if (heroes.length === 0) {
    return <p className="text-sm text-gray-500">No hero history found.</p>;
  }

  return (
    <ul className="divide-y divide-gray-200 rounded border border-gray-200">
      {heroes.map((hero) => (
        <li key={hero.heroId} className="flex items-center justify-between px-4 py-2 text-sm">
          <span className="font-medium text-gray-900">{hero.heroName}</span>
          <span className="text-gray-500">{hero.games} games</span>
          <span className="text-gray-500">{Math.round(hero.winRate * 100)}% win rate</span>
        </li>
      ))}
    </ul>
  );
}
