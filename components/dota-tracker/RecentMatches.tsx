import type { Match } from "@/lib/dota-tracker/types";

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

export function RecentMatches({ matches }: { matches: Match[] }) {
  if (matches.length === 0) {
    return <p className="text-sm text-gray-500">No recent matches found.</p>;
  }

  return (
    <ul className="divide-y divide-gray-200 rounded border border-gray-200">
      {matches.map((match) => (
        <li key={match.matchId} className="flex items-center justify-between px-4 py-2 text-sm">
          <span className={match.won ? "font-medium text-green-700" : "font-medium text-red-700"}>
            {match.won ? "Win" : "Loss"}
          </span>
          <span className="text-gray-500">{formatDuration(match.durationSeconds)}</span>
          <span className="text-gray-500">
            {new Date(match.playedAt * 1000).toLocaleDateString()}
          </span>
        </li>
      ))}
    </ul>
  );
}
