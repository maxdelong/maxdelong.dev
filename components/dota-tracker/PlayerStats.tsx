import type { PlayerProfile } from "@/lib/dota-tracker/types";

export function PlayerStats({ profile }: Readonly<{ profile: PlayerProfile }>) {
  return (
    <div className="grid grid-cols-3 divide-x divide-line rounded-lg border border-line bg-panel">
      <Stat label="MMR" value={profile.mmr !== null ? profile.mmr.toString() : "MMR unavailable"} />
      <Stat
        label="Win rate"
        value={profile.winRate !== null ? `${Math.round(profile.winRate * 100)}%` : "N/A"}
      />
      <Stat label="Matches" value={profile.totalMatches.toString()} />
    </div>
  );
}

function Stat({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="px-3 py-2">
      <div className="text-[11px] font-medium uppercase tracking-wide text-muted">{label}</div>
      <div className="text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}
