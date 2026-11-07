import type { Match } from "@/lib/dota-tracker/types";

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

export function RecentMatches({ matches }: Readonly<{ matches: Match[] }>) {
  if (matches.length === 0) {
    return <p className="text-sm text-muted">No recent matches found.</p>;
  }

  return (
    <ul className="divide-y divide-line rounded-lg border border-line bg-panel">
      {matches.map((match) => (
        <li key={match.matchId} className="flex items-center gap-3 px-3 py-1.5 text-[13px]">
          <span
            className={`w-9 font-medium ${
              match.won ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
            }`}
          >
            {match.won ? "Win" : "Loss"}
          </span>
          <span className="flex-1 tabular-nums text-muted">{formatDuration(match.durationSeconds)}</span>
          <span className="text-muted">{new Date(match.playedAt * 1000).toLocaleDateString()}</span>
        </li>
      ))}
    </ul>
  );
}
