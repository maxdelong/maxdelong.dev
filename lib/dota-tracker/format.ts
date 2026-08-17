// A SteamID64 (17 digits, ~7.6e16) exceeds Number.MAX_SAFE_INTEGER (~9.007e15),
// so the offset subtraction must happen in BigInt to avoid silent precision loss.
export const STEAM_ID_64_OFFSET = 76561197960265728n;

export type SearchIdentifier =
  | { type: "account-id"; accountId: number }
  | { type: "name"; name: string };

/** Classifies a raw search box value as an OpenDota account ID (from a SteamID64
 * or a plain account ID) or a name to search for. Returns null for empty/whitespace input. */
export function classifySearchInput(rawInput: string): SearchIdentifier | null {
  const trimmed = rawInput.trim();
  if (!trimmed) return null;

  if (/^\d+$/.test(trimmed)) {
    if (trimmed.length === 17 && trimmed.startsWith("7656")) {
      return { type: "account-id", accountId: steamId64ToAccountId(trimmed) };
    }
    if (trimmed.length <= 10) {
      return { type: "account-id", accountId: Number(trimmed) };
    }
  }

  return { type: "name", name: trimmed };
}

/** Converts a SteamID64 to an OpenDota account ID (32-bit Steam ID). */
export function steamId64ToAccountId(steamId64: string): number {
  return Number(BigInt(steamId64) - STEAM_ID_64_OFFSET);
}

/** Win rate as a 0-1 fraction, or null if there's no recorded matches to compute it from. */
export function computeWinRate(win: number, lose: number): number | null {
  const total = win + lose;
  if (total <= 0) return null;
  return win / total;
}
