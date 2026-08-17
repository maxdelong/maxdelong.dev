# Contract: OpenDota Client

This is the external interface this feature depends on (OpenDota's public
API) and the internal interface `lib/dota-tracker/opendota.ts` exposes to
the rest of the feature. No authentication — every call is anonymous.

## External endpoints used

| Endpoint | Purpose |
|----------|---------|
| `GET /api/search?q={query}` | Resolve a name to candidate players, ranked by similarity |
| `GET /api/players/{accountId}` | Profile + `mmr_estimate` |
| `GET /api/players/{accountId}/wl` | Win/loss counts |
| `GET /api/players/{accountId}/matches?limit=20` | Recent matches |
| `GET /api/players/{accountId}/heroes` | Hero pool (games/wins per hero) |
| `GET /api/heroes` | Static hero ID → name list, used to label the hero pool |

## Internal interface (`lib/dota-tracker/opendota.ts`)

```typescript
export type OpenDotaResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "not-found" | "unavailable" | "rate-limited" };

export function searchPlayers(query: string): Promise<OpenDotaResult<{ accountId: number; name: string }[]>>;
export function getPlayerProfile(accountId: number): Promise<OpenDotaResult<PlayerProfile>>;
export function getPlayerMatches(accountId: number): Promise<OpenDotaResult<Match[]>>;
export function getPlayerHeroPool(accountId: number): Promise<OpenDotaResult<HeroPoolEntry[]>>;
```

Every function returns the same `OpenDotaResult<T>` shape — callers never
handle raw HTTP status codes or thrown fetch errors directly; the client
classifies those into `"not-found"` / `"unavailable"` / `"rate-limited"`
internally (see research.md's error-classification decision).

## Guarantee this feature provides back to the shell

- `app/dota-tracker/page.tsx` and `app/dota-tracker/[accountId]/page.tsx`
  exist and render complete, working pages.
- The `lib/apps.ts` entry for `dota-tracker` is flipped from
  `"coming-soon"` to `"available"` — per `002-site-shell`'s contract,
  this makes the sidebar link live with no other change needed there.
