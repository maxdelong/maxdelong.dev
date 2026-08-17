# Research: Dota Tracker MVP

## Data source and authentication

**Decision**: OpenDota's public REST API (`api.opendota.com`), called
anonymously with no API key.

**Rationale**: The constitution's Technology Constraints already name
OpenDota for this app; its anonymous tier needs no key and is rate-limited
generously enough (documented ~60 requests/minute) for a personal site.
Requiring a key would add a secret-management concern this MVP has no
other reason to need.

**Alternatives considered**: Steam Web API directly — rejected; it
requires a Steam API key (a real secret to manage) and doesn't provide
match/hero aggregates as conveniently as OpenDota's player endpoints.

## Resolving MMR

**Decision**: Use OpenDota's `mmr_estimate.estimate` field as the
displayed "MMR." If absent, display the stat as "MMR unavailable" rather
than blocking the rest of the page.

**Rationale**: Exact MMR is only exposed by OpenDota for players who have
opted into leaderboard tracking — most public profiles don't have it.
`mmr_estimate` is OpenDota's own estimate and is present far more often.
Treating a missing MMR as a partial-data gap (not a full "stats
unavailable," which spec FR-006 reserves for when a player's data can't
be retrieved at all) keeps win rate and match count visible even when MMR
specifically isn't.

**Alternatives considered**: Deriving a rank label from `rank_tier` —
rejected as an added mapping table for a number the spec doesn't ask for;
`mmr_estimate` already satisfies FR-002 directly.

## Search input handling (name vs. Steam ID)

**Decision**: Classify the search input before calling any endpoint:
- All-digit, 17 characters, starts with `7656` → treat as a SteamID64;
  convert to an OpenDota account ID by subtracting `76561197960265728`.
- All-digit, ≤10 characters → treat directly as an OpenDota account ID.
- Otherwise → treat as a name and call OpenDota's `/search` endpoint,
  taking the top result by similarity.

**Rationale**: OpenDota's account ID is the 32-bit Steam ID; the
commonly-copied "Steam ID" from a profile URL is usually the 64-bit
SteamID64, which needs the documented fixed-offset conversion. Handling
both, plus a plain name search, covers what FR-001 ("by player name or
Steam ID") actually asks for without extra UI for the visitor to pick a
format.

**Alternatives considered**: Requiring visitors to enter only account IDs
— rejected; contradicts FR-001, which explicitly allows a name.

## Multiple name-search matches

**Decision**: Take OpenDota `/search`'s top result (highest `similarity`)
and go straight to that player's page; no disambiguation list.

**Rationale**: The spec's Key Entities and acceptance scenarios describe
a single found player, not a list to choose from — building a
disambiguation UI would be scope the spec doesn't ask for (YAGNI). If a
visitor gets the wrong player, searching again with a more specific query
(or a Steam ID) resolves it.

**Alternatives considered**: A results list to pick from — rejected as
unrequested scope for this MVP; worth revisiting if it turns out to be a
real pain point.

## Handling rate limits and downtime

**Decision**: Wrap every OpenDota call's response handling in one
classifier that maps a 404 to "not found" (FR-005), a 429 to
"rate-limited" (temporary — shown as a retry-suggesting unavailable
message), and any other non-2xx or network failure to "unavailable"
(FR-006). No retry/backoff logic — a single failed request just shows the
unavailable message.

**Rationale**: Satisfies the spec's edge cases (source slow/unavailable,
rate limits during a spike) with one small, testable function rather than
a retry/backoff system the spec's Success Criteria don't ask for (SC-002
only requires *some* clear message, not automatic recovery).

**Alternatives considered**: Exponential backoff with retries — rejected
as unnecessary complexity for a personal site's traffic volume (YAGNI).

## Testing framework

**Decision**: Vitest, matching both prior features, for the same
consistency reasons documented in `002-site-shell`'s research.md.
