import Link from "next/link";
import { getPlayerHeroPool, getPlayerMatches, getPlayerProfile } from "@/lib/dota-tracker/opendota";
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
      <div className="max-w-2xl">
        <p className="text-gray-700">
          {profileResult.reason === "not-found"
            ? "Player not found."
            : "Stats are unavailable for this player right now."}
        </p>
        <Link href="/dota-tracker" className="mt-4 inline-block text-sm text-gray-900 underline">
          Back to search
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">{profileResult.data.displayName}</h1>

      <PlayerStats profile={profileResult.data} />

      <section className="mt-6">
        <h2 className="mb-2 text-lg font-semibold text-gray-900">Recent matches</h2>
        <RecentMatches matches={matchesResult.ok ? matchesResult.data : []} />
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-lg font-semibold text-gray-900">Hero pool</h2>
        <HeroPool heroes={heroesResult.ok ? heroesResult.data : []} />
      </section>
    </div>
  );
}
