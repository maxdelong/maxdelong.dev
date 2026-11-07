import Link from "next/link";
import { getPlayerHeroPool, getPlayerMatches, getPlayerProfile } from "@/lib/dota-tracker/opendota";
import { PageHeader } from "@/components/PageHeader";
import { PlayerStats } from "@/components/dota-tracker/PlayerStats";
import { RecentMatches } from "@/components/dota-tracker/RecentMatches";
import { HeroPool } from "@/components/dota-tracker/HeroPool";

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId: accountIdParam } = await params;
  const accountId = Number(accountIdParam);

  const [profileResult, matchesResult, heroesResult] = await Promise.all([
    getPlayerProfile(accountId),
    getPlayerMatches(accountId),
    getPlayerHeroPool(accountId),
  ]);

  if (!profileResult.ok) {
    return (
      <div className="max-w-2xl rounded-xl border border-line bg-panel p-4">
        <p className="text-sm text-ink">
          {profileResult.reason === "not-found"
            ? "Player not found."
            : "Stats are unavailable for this player right now."}
        </p>
        <Link href="/dota-tracker" className="mt-2 inline-block text-sm font-medium text-accent hover:underline">
          ← Back to search
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Link href="/dota-tracker" className="mb-2 inline-block text-xs text-muted hover:text-ink">
        ← Search
      </Link>
      <PageHeader title={profileResult.data.displayName} />

      <PlayerStats profile={profileResult.data} />

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <section>
          <h2 className="mb-1.5 text-sm font-semibold text-ink">Recent matches</h2>
          <RecentMatches matches={matchesResult.ok ? matchesResult.data : []} />
        </section>

        <section>
          <h2 className="mb-1.5 text-sm font-semibold text-ink">Hero pool</h2>
          <HeroPool heroes={heroesResult.ok ? heroesResult.data : []} />
        </section>
      </div>
    </div>
  );
}
