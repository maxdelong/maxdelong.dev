import { computeWinRate } from "./format";
import type {
  HeroPoolEntry,
  Match,
  OpenDotaFailureReason,
  OpenDotaResult,
  PlayerProfile,
} from "./types";

const BASE_URL = "https://api.opendota.com/api";

export function classifyOpenDotaStatus(status: number): OpenDotaFailureReason {
  if (status === 404) return "not-found";
  if (status === 429) return "rate-limited";
  return "unavailable";
}

async function fetchJson<T>(path: string): Promise<OpenDotaResult<T>> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, { cache: "no-store" });
    if (!res.ok) {
      return { ok: false, reason: classifyOpenDotaStatus(res.status) };
    }
    const data = (await res.json()) as T;
    return { ok: true, data };
  } catch {
    return { ok: false, reason: "unavailable" };
  }
}

interface OpenDotaSearchResult {
  account_id: number;
  personaname: string;
  similarity: number;
}

export async function searchPlayers(
  query: string
): Promise<OpenDotaResult<{ accountId: number; name: string }[]>> {
  const result = await fetchJson<OpenDotaSearchResult[]>(
    `/search?q=${encodeURIComponent(query)}`
  );
  if (!result.ok) return result;

  const sorted = [...result.data].sort((a, b) => b.similarity - a.similarity);
  return {
    ok: true,
    data: sorted.map((r) => ({ accountId: r.account_id, name: r.personaname })),
  };
}

interface OpenDotaProfileResponse {
  profile: { personaname: string; account_id: number } | null;
  mmr_estimate?: { estimate: number | null };
}

interface OpenDotaWLResponse {
  win: number;
  lose: number;
}

export async function getPlayerProfile(
  accountId: number
): Promise<OpenDotaResult<PlayerProfile>> {
  const [profileResult, wlResult] = await Promise.all([
    fetchJson<OpenDotaProfileResponse>(`/players/${accountId}`),
    fetchJson<OpenDotaWLResponse>(`/players/${accountId}/wl`),
  ]);

  if (!profileResult.ok) return profileResult;
  if (!wlResult.ok) return wlResult;

  const { win, lose } = wlResult.data;
  const totalMatches = win + lose;

  // A private or nonexistent-data profile shows up as valid JSON with no wl data.
  if (!profileResult.data.profile || totalMatches === 0) {
    return { ok: false, reason: "unavailable" };
  }

  return {
    ok: true,
    data: {
      accountId,
      displayName: profileResult.data.profile.personaname ?? "Unknown player",
      mmr: profileResult.data.mmr_estimate?.estimate ?? null,
      winRate: computeWinRate(win, lose),
      totalMatches,
    },
  };
}

interface OpenDotaMatchResponse {
  match_id: number;
  player_slot: number;
  radiant_win: boolean;
  hero_id: number;
  start_time: number;
  duration: number;
}

function wonMatch(playerSlot: number, radiantWin: boolean): boolean {
  const isRadiant = playerSlot < 128;
  return isRadiant === radiantWin;
}

export async function getPlayerMatches(accountId: number): Promise<OpenDotaResult<Match[]>> {
  const result = await fetchJson<OpenDotaMatchResponse[]>(
    `/players/${accountId}/matches?limit=20`
  );
  if (!result.ok) return result;

  return {
    ok: true,
    data: result.data.map((m) => ({
      matchId: m.match_id,
      won: wonMatch(m.player_slot, m.radiant_win),
      heroId: m.hero_id,
      playedAt: m.start_time,
      durationSeconds: m.duration,
    })),
  };
}

interface OpenDotaHero {
  id: number;
  localized_name: string;
}

interface OpenDotaHeroStat {
  hero_id: number;
  games: number;
  win: number;
}

let heroNameCache: Map<number, string> | null = null;

async function getHeroNameMap(): Promise<Map<number, string>> {
  if (heroNameCache) return heroNameCache;

  const result = await fetchJson<OpenDotaHero[]>(`/heroes`);
  const map = new Map<number, string>();
  if (result.ok) {
    for (const hero of result.data) map.set(hero.id, hero.localized_name);
  }
  heroNameCache = map;
  return map;
}

export async function getPlayerHeroPool(
  accountId: number
): Promise<OpenDotaResult<HeroPoolEntry[]>> {
  const [statsResult, heroNames] = await Promise.all([
    fetchJson<OpenDotaHeroStat[]>(`/players/${accountId}/heroes`),
    getHeroNameMap(),
  ]);
  if (!statsResult.ok) return statsResult;

  const MOST_PLAYED_LIMIT = 20;

  return {
    ok: true,
    data: statsResult.data
      .filter((h) => h.games > 0)
      .sort((a, b) => b.games - a.games)
      .slice(0, MOST_PLAYED_LIMIT)
      .map((h) => ({
        heroId: h.hero_id,
        heroName: heroNames.get(h.hero_id) ?? `Hero ${h.hero_id}`,
        games: h.games,
        winRate: h.win / h.games,
      })),
  };
}
