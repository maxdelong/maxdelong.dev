import type { PlayerProfile } from "@/lib/dota-tracker/types";

export function PlayerStats({ profile }: { profile: PlayerProfile }) {
  return (
    <div className="flex flex-wrap gap-6 rounded border border-gray-200 p-4">
      <Stat label="MMR" value={profile.mmr !== null ? profile.mmr.toString() : "MMR unavailable"} />
      <Stat
        label="Win rate"
        value={profile.winRate !== null ? `${Math.round(profile.winRate * 100)}%` : "N/A"}
      />
      <Stat label="Total matches" value={profile.totalMatches.toString()} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</div>
      <div className="text-lg font-semibold text-gray-900">{value}</div>
    </div>
  );
}
