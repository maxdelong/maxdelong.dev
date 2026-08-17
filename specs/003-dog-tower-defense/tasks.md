---

description: "Task list template for feature implementation"
---

# Tasks: Dog Tower Defense

**Input**: Design documents from `/specs/003-dog-tower-defense/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/site-registration.md](./contracts/site-registration.md), [quickstart.md](./quickstart.md)

**Tests**: Included — plan.md designs the game rules as pure, framework-free functions specifically so they're unit-testable (Pragmatic Testing principle); the canvas rendering itself is not unit tested.

**Organization**: Tasks are grouped by user story so each can be implemented and tested independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: Which user story this task belongs to (US1, US2)

## Path Conventions

This feature adds one route plus its own `components/` and `lib/` subfolders to the existing single Next.js project (see plan.md). **Requires `002-site-shell` to already be implemented** — this feature only adds one line to its shared registry (`lib/apps.ts`) and builds nothing else the project doesn't already have.

---

## Phase 1: Setup

**Purpose**: Register this app with the site shell; no new project-level tooling needed (reuses the Next.js/Vitest setup from `002-site-shell`).

- [X] T001 Add the registry entry to `lib/apps.ts`: `{ slug: "dog-tower-defense", name: "Dog Tower Defense", status: "available", description: "Defend the yard from squirrels and frogs." }` per [contracts/site-registration.md](./contracts/site-registration.md)
- [X] T002 [P] Create the `tests/lib/dog-tower-defense/` directory (reuses the Vitest config already set up by `002-site-shell`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types and fixed layout data both user stories depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T003 [P] Define `Dog`, `Intruder`, `Path`, `Pond`, `PlacementSpot`, and `GameState` types in `lib/dog-tower-defense/types.ts` per [data-model.md](./data-model.md)
- [X] T004 Define the fixed squirrel-path and frog-path waypoint lists, the pond's bounds, and the fixed placement-spot list in `lib/dog-tower-defense/paths.ts` (depends on T003)

**Checkpoint**: Shared types and layout data exist — user story implementation can begin.

---

## Phase 3: User Story 1 - Defend the yard (Priority: P1) 🎯 MVP

**Goal**: Place dogs that automatically fight squirrels and frogs as they walk their paths toward the porch; bones and lives update accordingly.

**Independent Test**: Load the game, place a dog next to either path, start the wave, and confirm it automatically engages a squirrel or frog that walks into range; confirm bones increase on a kill and lives decrease when an intruder reaches the porch.

### Tests for User Story 1

- [X] T005 [P] [US1] Write placement tests in `tests/lib/dog-tower-defense/placement.test.ts`: a valid, unoccupied spot with enough bones succeeds; an invalid spot, an occupied spot, and insufficient bones are each rejected (FR-001, FR-002, FR-011)
- [X] T006 [P] [US1] Write combat tests in `tests/lib/dog-tower-defense/combat.test.ts`: an intruder within range is attacked regardless of type (squirrel or frog); an intruder outside range is untouched (FR-003)

### Implementation for User Story 1

- [X] T007 [P] [US1] Implement placement validation in `lib/dog-tower-defense/placement.ts`: valid spot + unoccupied + sufficient bones (FR-001, FR-002, FR-011) (depends on T004)
- [X] T008 [P] [US1] Implement range detection and attack resolution in `lib/dog-tower-defense/combat.ts` (FR-003) (depends on T003)
- [X] T009 [US1] Implement the core game-state module in `lib/dog-tower-defense/gameState.ts`: spawn the wave (squirrels + frogs, FR-004), advance each intruder along its own path per tick, apply combat results, award bones on defeat (FR-005), deduct a life when an intruder reaches the porch (FR-006) (depends on T004, T007, T008)
- [X] T010 [US1] Create `GameCanvas` in `components/dog-tower-defense/GameCanvas.tsx`: a `requestAnimationFrame` loop driving `gameState`, drawing the yard, both paths, the pond, dogs, and intruders, and handling click-to-place (FR-001) (depends on T009)
- [X] T011 [US1] Create `Hud` in `components/dog-tower-defense/Hud.tsx`: displays current lives and bones (FR-005, FR-006) (depends on T009)
- [X] T012 [US1] Create `app/dog-tower-defense/page.tsx` rendering `<GameCanvas />` and `<Hud />` (depends on T010, T011)

**Checkpoint**: User Story 1 is fully functional and independently testable — dogs can be placed and automatically fight both intruder types, with bones and lives updating correctly.

---

## Phase 4: User Story 2 - See the outcome and play again (Priority: P2)

**Goal**: A clear win or lose state at the end of a wave, with a one-action restart.

**Independent Test**: Let a wave finish (win or lose) and confirm a clear result is shown with a restart control that starts a fresh game with lives, bones, and placements reset.

### Tests for User Story 2

- [X] T013 [P] [US2] Write win/lose/restart tests in `tests/lib/dog-tower-defense/gameState.test.ts`: a full clear with lives remaining produces `"won"`; lives reaching 0 mid-wave produces `"lost"` immediately, without waiting for the wave to finish; restart resets lives, bones, and dog placements to their starting values (FR-007, FR-008, FR-009)

### Implementation for User Story 2

- [X] T014 [US2] Implement win/lose evaluation in `lib/dog-tower-defense/gameState.ts`: `status` becomes `"lost"` the instant `lives` hits 0, or `"won"` once every intruder is no longer alive with `lives > 0` (FR-007, FR-008) (depends on T009)
- [X] T015 [US2] Implement restart in `lib/dog-tower-defense/gameState.ts`: discards the current state and creates a fresh one with starting lives/bones, no dogs, and a freshly spawned wave (FR-009) (depends on T014)
- [X] T016 [US2] Add a win/lose overlay and restart button to `Hud.tsx`, wired to `gameState.status` and the restart function (FR-007, FR-008, FR-009) (depends on T011, T015)

**Checkpoint**: Both user stories functional — the full game loop is playable start to finish, with restart.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T017 [P] Manually run through every scenario in [quickstart.md](./quickstart.md), including the "no network requests after load" check (FR-010, SC-004)
- [X] T018 [P] Verify the "Dog Tower Defense" sidebar entry (added by T001) is clickable and correctly opens this game from `002-site-shell`'s sidebar
- [X] T019 Run `npm run build` to confirm the project still builds cleanly (constitution Principle V: Always Deployable)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Requires `002-site-shell` already implemented (T001 edits its `lib/apps.ts`). T001 and T002 can run in parallel.
- **Foundational (Phase 2)**: Depends on Setup — blocks both user stories. T004 depends on T003.
- **User Stories (Phase 3-4)**: Both depend on Foundational. US2 depends on US1's `gameState.ts` (T009) but adds no new production files beyond extending it.
- **Polish (Phase 5)**: Depends on both user stories being complete.

### Parallel Opportunities

- T001 and T002 (Setup) can run in parallel.
- T005 and T006 (US1 tests) can run in parallel.
- T007 and T008 (US1 implementation) can run in parallel; T009 depends on both.
- T017 and T018 (Polish) can run in parallel.

---

## Parallel Example: User Story 1

```bash
Task: "Write placement tests in tests/lib/dog-tower-defense/placement.test.ts"
Task: "Write combat tests in tests/lib/dog-tower-defense/combat.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: place dogs, confirm both intruder types are fought automatically
5. Deploy/demo if ready — a winnable-but-not-yet-restartable game is already a fun demo

### Incremental Delivery

1. Setup + Foundational → shared types/paths ready
2. Add US1 → validate → deploy (core defending loop)
3. Add US2 → validate → deploy (win/lose + restart closes the loop)
4. Polish → final build and cross-feature check

## Notes

- [P] tasks touch different files with no dependency on an incomplete task.
- Commit after each task or logical group.

## Status & Next Step

**Current state**: Implemented. All 19 tasks complete; 18/18 project-wide
tests pass (15 for this feature), lint is clean, `npm run build` succeeds.
Manually verified in a real headless browser: homepage lists "Dog Tower
Defense" as a working link, the canvas renders the yard/pond/both paths/
placement spots, clicking a spot places a dog that automatically defeats
nearby squirrels and frogs, bones deduct on placement and increase on
kills, and a full playthrough reaches both a "You lose" (poor placement)
and a "You win! 🎉" (good placement near the path convergence) state, each
with a working "Play again" restart. No console errors observed.

**Implementation notes**:

- Combat is instant-defeat-on-range (no HP/damage system) — the spec
  never specifies multi-hit combat, and this is the simplest rule that
  satisfies FR-003.
- Game constants (starting lives: 5, starting bones: 6, dog cost: 3, dog
  range: 90, wave: 7 intruders) are implementation choices not dictated by
  the spec; verified empirically to make the game both losable (careless
  placement) and winnable (deliberate placement near the path
  convergence near the porch).

**Next step**: Both `002-site-shell` and `003-dog-tower-defense` are now
fully implemented. `001-dota-tracker-mvp` is the only remaining feature —
it still needs its constitution conflict resolved, then `/speckit-plan`,
`/speckit-tasks`, and `/speckit-implement`.
