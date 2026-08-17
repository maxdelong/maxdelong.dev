export interface PlayerProfile {
  accountId: number;
  displayName: string;
  mmr: number | null;
  winRate: number | null;
  totalMatches: number;
}

export interface Match {
  matchId: number;
  won: boolean;
  heroId: number;
  playedAt: number;
  durationSeconds: number;
}

export interface HeroPoolEntry {
  heroId: number;
  heroName: string;
  games: number;
  winRate: number;
}

export type OpenDotaFailureReason = "not-found" | "unavailable" | "rate-limited";

export type OpenDotaResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: OpenDotaFailureReason };
