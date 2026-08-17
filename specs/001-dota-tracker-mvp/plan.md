# Implementation Plan: Dota Tracker MVP

**Branch**: `001-dota-tracker-mvp` | **Date**: 2026-08-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-dota-tracker-mvp/spec.md`

## Summary

A player search page at `/dota-tracker` (replacing the existing
`coming-soon` placeholder from `002-site-shell`) backed entirely by the
public OpenDota API — no database, no API key, no persistence, matching
the spec's Assumptions. A visitor enters a name or Steam ID; a server
action resolves that to an OpenDota account ID and routes to
`/dota-tracker/[accountId]`, a server component that fetches the
player's profile, win/loss record, recent matches, and hero pool in
parallel and renders all of it on one page (SC-003). Not-found and
private-profile/unavailable states are handled explicitly per FR-005/006.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode) — same as
`002-site-shell` and `003-dog-tower-defense`

**Primary Dependencies**: Next.js 14+ (App Router), React 18+. No new
dependency for the API client — the OpenDota REST API is plain JSON over
`fetch`, needing no SDK.

**Storage**: N/A — no database, no caching layer. The spec's Assumptions
are explicit: "No persistence in this MVP: every search is a fresh
lookup." (This also means `apps/dota-tracker/README.md`'s original
`players`/`mmr_history` Supabase schema and 5-minute caching plan are
**not** built — they predate this spec and describe Phase 2/3 scope the
spec explicitly excludes.)

**Testing**: Vitest for the pure logic that has real branching to get
wrong: classifying a search query (SteamID64 vs. OpenDota account ID vs.
player name), converting SteamID64 → account ID, computing win rate, and
classifying OpenDota error responses into "not found" vs. "unavailable"
vs. "rate limited." The `fetch` calls themselves and the page components
are not unit tested, consistent with the constitution's Pragmatic Testing
principle and the same choice made for the prior two features.

**Target Platform**: Web, same single Vercel deployment as the rest of
the site.

**Project Type**: Adds two routes (`/dota-tracker`,
`/dota-tracker/[accountId]`) plus a server action to the existing single
Next.js project; no new project.

**Performance Goals**: SC-001 — under 10 seconds from landing on the
search page to seeing a found player's stats. OpenDota's public API
typically responds in well under a second per call; the player page's
four calls (profile, win/loss, matches, heroes) run in parallel via
`Promise.all`, not sequentially.

**Constraints**: No accounts/login (FR-007); no persistence (FR-008); no
API key (OpenDota's public endpoints require none); must handle OpenDota
rate limiting and downtime gracefully rather than crashing (spec Edge
Cases).

**Scale/Scope**: Single external API, four endpoints, two routes, no
database. Personal-site scale — no caching or rate-limit budget
management beyond graceful degradation on a 429.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Evaluated against `.specify/memory/constitution.md` (the root
constitution — now the sole constitution in the repo; see this spec's
Status & Next Step for why `apps/dota-tracker/CONSTITUTION.md` was
retired):

- **I. Simplicity & YAGNI**: PASS. No database, no caching layer, no SDK
  dependency for a plain REST API, no account disambiguation UI beyond
  taking the best search match — all scope the old, retired constitution
  would have required (5-minute caching, MMR history, mandatory UI tests)
  is deliberately not built, matching this spec's own Assumptions.
- **II. Type Safety End-to-End**: PASS. TypeScript strict mode; OpenDota
  response shapes are typed once in `lib/dota-tracker/opendota.ts` and
  flow through to the page components without re-declaration.
- **III. App Isolation**: PASS. Everything lives under
  `app/dota-tracker/` and `lib/dota-tracker/`; no imports from
  `dog-tower-defense` or `spotify-tracker`, and nothing of this feature's
  is imported by them either.
- **IV. Pragmatic Testing**: PASS. Tests cover the actual branching logic
  (input classification, ID conversion, win-rate math, error
  classification); fetch calls and rendering are not unit tested.
- **V. Always Deployable**: Applies at merge time; noted as an
  implementation constraint (Vercel preview must succeed), same as prior
  features.

**Post-Phase 1 re-check**: The data model (below) is purely OpenDota
response shapes reflected into local TypeScript types — no new
dependency, no persistence, no expansion of the external surface beyond
the four OpenDota endpoints already scoped above. All gates still hold.

## Project Structure

### Documentation (this feature)

```text
specs/001-dota-tracker-mvp/
├── plan.md               # This file (/speckit-plan command output)
├── research.md            # Phase 0 output (/speckit-plan command)
├── data-model.md           # Phase 1 output (/speckit-plan command)
├── quickstart.md           # Phase 1 output (/speckit-plan command)
├── contracts/              # Phase 1 output (/speckit-plan command)
└── tasks.md                # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
lib/
├── apps.ts                       # (from 002-site-shell) dota-tracker entry flips coming-soon -> available
└── dota-tracker/
    ├── types.ts                   # OpenDota response shapes + this feature's view models
    ├── opendota.ts                # Typed fetch wrappers: search, player, wl, matches, heroes; error classification
    └── format.ts                  # Pure logic: input classification, SteamID64 conversion, win-rate math

app/dota-tracker/
├── page.tsx                       # Search form (replaces the coming-soon placeholder from 002-site-shell)
├── actions.ts                     # "use server" — resolves a search query to an account ID, redirects
└── [accountId]/
    └── page.tsx                    # Server component: fetches profile/wl/matches/heroes in parallel, renders the page

components/dota-tracker/
├── PlayerStats.tsx                 # MMR / win rate / total matches (FR-002)
├── RecentMatches.tsx                # Match list with win/loss (FR-003)
├── HeroPool.tsx                     # Most-played heroes with games/win rate (FR-004)
└── SearchForm.tsx                   # The search input + submit, used by app/dota-tracker/page.tsx

tests/lib/dota-tracker/
├── format.test.ts                  # Input classification, SteamID64 -> account ID, win-rate math
└── opendota.test.ts                # Error-response classification (not-found / unavailable / rate-limited)
```

**Structure Decision**: Same single Next.js project as the prior two
features, following the same App Isolation pattern — this feature's code
lives entirely under `app/dota-tracker/`, `lib/dota-tracker/`, and
`components/dota-tracker/`. The only shared-file touchpoint is the one
`lib/apps.ts` registry entry, flipped from `coming-soon` to `available`
now that this feature is real. This finally supersedes the old
`apps/dota-tracker/` planning-doc folder's implied `apps/*` structure
(already superseded by `002-site-shell`) for real.

## Complexity Tracking

No constitution violations requiring justification — table omitted.

## Status & Next Step

**Current state**: Implemented. See [tasks.md](./tasks.md) for
verification details and implementation notes.

**Next step**: All three features are now implemented.
