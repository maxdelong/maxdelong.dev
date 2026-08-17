---

description: "Task list template for feature implementation"
---

# Tasks: Dota Tracker MVP

**Input**: Design documents from `/specs/001-dota-tracker-mvp/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/opendota-client.md](./contracts/opendota-client.md), [quickstart.md](./quickstart.md)

**Tests**: Included — plan.md designs the search/ID/win-rate/error-classification logic as pure functions specifically so they're unit-testable, per the constitution's Pragmatic Testing principle.

**Organization**: Tasks are grouped by user story so each can be implemented and tested independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

## Path Conventions

Adds two routes plus its own `components/` and `lib/` subfolders to the existing single Next.js project (see plan.md). **Requires `002-site-shell` already implemented** — this feature replaces its `dota-tracker` coming-soon placeholder and flips one registry entry.

---

## Phase 1: Setup

- [X] T001 [P] Create the `lib/dota-tracker/`, `components/dota-tracker/`, and `tests/lib/dota-tracker/` directories

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types and the OpenDota client every user story depends on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T002 [P] Define `PlayerProfile`, `Match`, `HeroPoolEntry`, and `OpenDotaResult<T>` types in `lib/dota-tracker/types.ts` per [data-model.md](./data-model.md)
- [X] T003 [P] Implement pure logic in `lib/dota-tracker/format.ts`: classify a search query (SteamID64 vs. account ID vs. name), convert SteamID64 → account ID, and compute win rate from win/lose counts (research.md)
- [X] T004 Implement the OpenDota client in `lib/dota-tracker/opendota.ts`: `searchPlayers`, `getPlayerProfile`, `getPlayerMatches`, `getPlayerHeroPool`, each returning `OpenDotaResult<T>` with responses classified into `"not-found" | "unavailable" | "rate-limited"` per [contracts/opendota-client.md](./contracts/opendota-client.md) (depends on T002)

**Checkpoint**: Shared types and the API client exist — user story implementation can begin.

---

## Phase 3: User Story 1 - Look up a player's stats (Priority: P1) 🎯 MVP

**Goal**: Search by name or Steam ID and see MMR, win rate, and total matches for a found player; clear messages for not-found and unavailable.

**Independent Test**: Search a known public player by name, confirm their MMR/win rate/matches display; search a nonsense query, confirm "not found"; search a private/unreachable profile, confirm "stats unavailable."

### Tests for User Story 1

- [X] T005 [P] [US1] Write tests in `tests/lib/dota-tracker/format.test.ts`: SteamID64 correctly converts to account ID; short numeric input is treated as an account ID directly; non-numeric input is treated as a name; win rate computes correctly, including the 0/0 edge case (FR-001, FR-002)
- [X] T006 [P] [US1] Write tests in `tests/lib/dota-tracker/opendota.test.ts`: a 404 response classifies as `"not-found"`, a 429 as `"rate-limited"`, and other non-2xx/network failures as `"unavailable"` (FR-005, FR-006)

### Implementation for User Story 1

- [X] T007 [P] [US1] Create `SearchForm` in `components/dota-tracker/SearchForm.tsx`: a form posting to a server action with one text input (FR-001)
- [X] T008 [US1] Create the search server action in `app/dota-tracker/actions.ts`: classifies the query (T003), resolves it via `opendota.ts` (T004) — a name goes through `searchPlayers` and takes the top match — then redirects to `/dota-tracker/{accountId}` on success or back to `/dota-tracker?error=not-found` on failure (depends on T003, T004, T007)
- [X] T009 [US1] Replace the coming-soon placeholder in `app/dota-tracker/page.tsx` with the real search page: renders `SearchForm`, reads an `error` query param to show a "player not found" message (FR-005) (depends on T007, T008)
- [X] T010 [P] [US1] Create `PlayerStats` in `components/dota-tracker/PlayerStats.tsx`: displays MMR (or "MMR unavailable"), win rate, and total matches (FR-002) (depends on T002)
- [X] T011 [US1] Create `app/dota-tracker/[accountId]/page.tsx`: server component fetching profile + win/loss in parallel via `opendota.ts`; shows `PlayerStats` on success, a "stats unavailable" message on an `"unavailable"`/`"rate-limited"` result, and a "not found" message on `"not-found"` (FR-002, FR-005, FR-006) (depends on T004, T010)

**Checkpoint**: User Story 1 is fully functional and independently testable — search resolves to a working player page with correct stats, or a clear error state.

---

## Phase 4: User Story 2 - View recent matches (Priority: P2)

**Goal**: A found player's page also shows their recent matches with win/loss.

**Independent Test**: Search a player with match history; confirm a list of recent matches renders with win/loss per match. Search a player with no recent matches; confirm an empty state, not an error.

### Implementation for User Story 2

- [X] T012 [P] [US2] Extend `opendota.ts` (from T004) with `getPlayerMatches`, deriving `won` from `player_slot`/`radiant_win` per [data-model.md](./data-model.md) (FR-003)
- [X] T013 [P] [US2] Create `RecentMatches` in `components/dota-tracker/RecentMatches.tsx`: renders the match list with win/loss per match, and an explicit empty state when there are none (FR-003)
- [X] T014 [US2] Fetch matches in `app/dota-tracker/[accountId]/page.tsx` alongside the existing profile/win-loss calls (same `Promise.all`) and render `RecentMatches` (FR-003, SC-003) (depends on T011, T012, T013)

**Checkpoint**: User Stories 1 and 2 both work — a found player's page shows stats and recent matches together.

---

## Phase 5: User Story 3 - View hero pool (Priority: P3)

**Goal**: A found player's page also shows their most-played heroes with games and win rate per hero.

**Independent Test**: Search a player with hero history; confirm heroes are listed with games played and win rate. Search a player with very limited history; confirm the section shows whatever exists without erroring.

### Implementation for User Story 3

- [X] T015 [P] [US3] Extend `opendota.ts` (from T004) with `getPlayerHeroPool`, resolving hero names via OpenDota's `/heroes` list (FR-004)
- [X] T016 [P] [US3] Create `HeroPool` in `components/dota-tracker/HeroPool.tsx`: renders heroes with games played and win rate per hero (FR-004)
- [X] T017 [US3] Fetch the hero pool in `app/dota-tracker/[accountId]/page.tsx` alongside the other calls (same `Promise.all`) and render `HeroPool` (FR-004, SC-003) (depends on T011, T015, T016)

**Checkpoint**: All three user stories independently functional — stats, matches, and hero pool all render on one page load.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T018 Flip the `dota-tracker` entry in `lib/apps.ts` from `status: "coming-soon"` to `status: "available"` (contracts/opendota-client.md)
- [X] T019 [P] Manually run through every scenario in [quickstart.md](./quickstart.md) against the real OpenDota API, including a rate-limit/unavailable simulation
- [X] T020 [P] Verify the "Dota Tracker" sidebar entry is now clickable and opens this feature from `002-site-shell`'s sidebar
- [X] T021 Run `npm run build` to confirm the project still builds cleanly (constitution Principle V: Always Deployable)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup — blocks all user stories. T003/T002 can run in parallel; T004 depends on T002.
- **User Stories (Phase 3-5)**: All depend on Foundational. US2 and US3 both depend on US1's player-page skeleton (T011) but extend it independently of each other.
- **Polish (Phase 6)**: Depends on the user stories you choose to complete. T018 (flip registry status) should happen only once the page actually works — don't flip it before US1 is functional.

### Parallel Opportunities

- T002 and T003 (Foundational) can run in parallel.
- T005 and T006 (US1 tests) can run in parallel.
- T007 and T010 (US1 implementation) can run in parallel; T008 depends on T003/T004/T007; T009 depends on T007/T008; T011 depends on T004/T010.
- T012 and T013 (US2) can run in parallel; T015 and T016 (US3) can run in parallel. US2 and US3 can be worked on in parallel with each other once US1's T011 exists.
- T019 and T020 (Polish) can run in parallel.

---

## Parallel Example: User Story 1

```bash
Task: "Create SearchForm in components/dota-tracker/SearchForm.tsx"
Task: "Create PlayerStats in components/dota-tracker/PlayerStats.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: search a real player, confirm stats display; confirm not-found and unavailable states
5. Deploy/demo if ready — this alone delivers the core value

### Incremental Delivery

1. Setup + Foundational → OpenDota client ready
2. Add US1 → validate → deploy (search + stats)
3. Add US2 → validate → deploy (recent matches)
4. Add US3 → validate → deploy (hero pool)
5. Polish → flip the registry, final build check

## Notes

- [P] tasks touch different files with no dependency on an incomplete task.
- Commit after each task or logical group.

## Status & Next Step

**Current state**: Implemented and verified against the real, live OpenDota
API (not mocked) — 29/29 project-wide tests pass (11 for this feature),
lint is clean, `npm run build` succeeds. Manually verified in a real
headless browser against `api.opendota.com`: searching a real account ID
renders MMR (or "MMR unavailable" when OpenDota doesn't expose it — this
player didn't), win rate, total matches, a styled recent-matches list, and
a top-20 most-played hero-pool list, all on one page; a bogus account ID
shows "Player not found" rather than crashing. No console errors.

**Implementation notes**:

- SteamID64 → OpenDota account ID conversion uses `BigInt`, not `Number`
  — a 17-digit SteamID64 (~7.6e16) exceeds `Number.MAX_SAFE_INTEGER`
  (~9.007e15), so a plain `Number()` subtraction silently produces the
  wrong account ID. Caught via a wrong-value unit test during
  implementation, not by inspection. `tsconfig.json`'s `target` was
  bumped from `ES2017` to `ES2020` to allow `BigInt` literal syntax.
- Hero pool is capped to the top 20 most-played heroes (sorted by games
  descending), not every hero ever played — confirmed against a
  4,000+ match real account whose unbounded list was unreadable. FR-004
  says "most-played heroes," which reads as a curated top list rather
  than a full account history dump.
- OpenDota's `/search` endpoint was intermittently slow/unreachable from
  this environment during manual testing (other endpoints were fine);
  the app's existing `"unavailable"` classification already covers this
  gracefully, so no code change was needed — noted here in case name
  search feels slow in production.
- `apps/dota-tracker/CONSTITUTION.md` was removed (see this spec's
  earlier Status entry) and the old `players`/`mmr_history` Supabase
  schema it implied is intentionally not built — this feature has no
  database at all, per the spec's own Assumptions.

**Next step**: All three features (`001-dota-tracker-mvp`,
`002-site-shell`, `003-dog-tower-defense`) are now implemented. Blog and
Portfolio remain unbuilt placeholders in the registry for whenever
they're wanted.
