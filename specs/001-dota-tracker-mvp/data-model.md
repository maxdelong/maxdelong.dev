# Data Model: Dota Tracker MVP

No database (spec Assumptions). Every shape here is a TypeScript type
reflecting an OpenDota API response, held only for the duration of one
request — nothing is stored between requests or sessions.

## PlayerProfile

Maps to spec's **Player** entity.

| Field | Type | Source |
|-------|------|--------|
| `accountId` | `number` | OpenDota account ID (resolved from search input) |
| `displayName` | `string` | OpenDota `profile.personaname` |
| `mmr` | `number \| null` | OpenDota `mmr_estimate.estimate`; `null` if absent (research.md) |
| `winRate` | `number \| null` | Computed from `wl.win` / `wl.lose`; `null` if both are 0 and the profile appears private |
| `totalMatches` | `number` | `wl.win + wl.lose` |

## Match

Maps to spec's **Match** entity.

| Field | Type | Source |
|-------|------|--------|
| `matchId` | `number` | OpenDota `match_id` |
| `won` | `boolean` | Derived from `player_slot` and `radiant_win` |
| `heroId` | `number` | OpenDota `hero_id` |
| `playedAt` | `number` (unix seconds) | OpenDota `start_time` |
| `durationSeconds` | `number` | OpenDota `duration` |

## HeroPoolEntry

Maps to spec's **Hero Pool Entry** entity.

| Field | Type | Source |
|-------|------|--------|
| `heroId` | `number` | OpenDota `hero_id` |
| `heroName` | `string` | Resolved from OpenDota's `/heroes` list by `heroId` |
| `games` | `number` | OpenDota `games` |
| `winRate` | `number` | Computed from OpenDota `win` / `games` |

## SearchResult (internal, not spec-level)

The outcome of classifying and resolving a search query (research.md);
not persisted, exists only within one server action invocation.

| Field | Type | Notes |
|-------|------|-------|
| `outcome` | `"found" \| "not-found" \| "unavailable"` | Drives whether the action redirects to a player page or back to the search form with an error |
| `accountId` | `number \| null` | Present only when `outcome === "found"` |

## Availability state (per FR-005 / FR-006)

Not a stored entity — a per-request classification applied to the
player-page fetch results:

- **Not found**: the resolved account ID doesn't correspond to a real
  OpenDota player (404) → FR-005's "not found" message.
- **Unavailable**: the account exists but its match/profile data can't be
  retrieved (private profile, OpenDota error, rate limit) → FR-006's
  "stats unavailable" message.
- **Found**: profile data loads successfully; individual fields (like
  `mmr`) may still individually be `null` per the PlayerProfile shape
  above, shown as "unavailable" inline rather than blocking the page.
