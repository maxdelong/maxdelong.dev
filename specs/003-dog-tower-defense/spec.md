# Feature Specification: Dog Tower Defense

**Feature Branch**: `003-dog-tower-defense`

**Created**: 2026-08-16

**Status**: Draft

**Input**: User description: "A tiny, dog-themed tower defense game as a new app on the site (registered in the shell's app registry alongside Dota Tracker and Spotify Tracker, this one shipping as "available" not "coming soon"). Keep it extremely simple: dogs are the "towers" defending a yard from a single wave-based line of intruders (e.g. squirrels) walking a fixed path toward a goal (e.g. a bone or the porch). One dog type, one intruder type, no accounts, no API keys, no backend — pure client-side game state. This is a lightweight spec — keep it terse, don't over-elaborate scope."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Defend the yard (Priority: P1)

A visitor opens the game and places dogs around the yard to stop squirrels
and frogs — the frogs emerging from a pond — from reaching the porch.

**Why this priority**: This is the whole game — placement plus automatic
defending is the entire core loop.

**Independent Test**: Load the game, place a dog next to either path,
start the wave, and confirm the dog automatically engages a squirrel or
frog that walks into range.

**Acceptance Scenarios**:

1. **Given** the game has loaded, **When** the visitor selects a valid
   spot next to either path, **Then** a dog is placed there (if enough
   bones are available).
2. **Given** a placed dog, **When** a squirrel or frog walks within its
   range, **Then** the dog automatically attacks it without further
   input.
3. **Given** an intruder (squirrel or frog) is defeated, **When** it's
   removed from the yard, **Then** the visitor's bone count increases.
4. **Given** an intruder reaches the porch, **Then** the visitor's lives
   decrease by one and the intruder is removed.

---

### User Story 2 - See the outcome and play again (Priority: P2)

Having played through the one wave, the visitor sees whether they won or
lost and can immediately start a new game.

**Why this priority**: Closes the loop so the game is replayable, but the
core defending loop (Story 1) is what has to exist first.

**Independent Test**: Let a wave finish (win or lose) and confirm a clear
result is shown with a restart control that starts a fresh game.

**Acceptance Scenarios**:

1. **Given** all squirrels and frogs in the wave are defeated and at
   least one life remains, **When** the wave ends, **Then** a "you win"
   state is shown.
2. **Given** lives reach zero, **When** that happens, **Then** a "you
   lose" state is shown immediately, without waiting for the wave to
   finish.
3. **Given** a win or lose state is shown, **When** the visitor chooses to
   restart, **Then** a new game begins with lives, bones, and the yard
   reset to their starting state.

---

### Edge Cases

- What happens when the visitor tries to place a dog without enough
  bones? (Placement is rejected; existing state is unchanged.)
- What happens when the visitor tries to place a dog off the yard, on a
  path, or on the pond? (Placement is rejected — the pond is not a valid
  placement spot.)
- What happens if the visitor closes and reopens the game mid-wave? (The
  game restarts fresh — no state is saved between sessions.)
- What happens when a dog is within range of both the squirrel path and
  the frog path? (It attacks whichever intruder is in range; type doesn't
  matter — see FR-003.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST let the visitor place a dog at a valid yard spot
  by clicking/tapping it.
- **FR-002**: Placing a dog MUST cost bones from the visitor's current
  bone count; placement MUST be rejected if the visitor doesn't have
  enough.
- **FR-003**: Placed dogs MUST automatically attack any intruder
  (squirrel or frog) that comes within range, with no further visitor
  input required.
- **FR-004**: System MUST spawn a single wave containing both squirrels,
  which walk a fixed path toward the porch, and frogs, which emerge from
  a pond and walk their own fixed path toward the porch.
- **FR-005**: Defeating an intruder MUST award the visitor bones.
- **FR-006**: An intruder reaching the porch MUST reduce the visitor's
  lives by one and be removed from play.
- **FR-007**: System MUST show a win state when the wave is fully cleared
  (all squirrels and frogs defeated) with at least one life remaining.
- **FR-008**: System MUST show a lose state immediately when lives reach
  zero.
- **FR-009**: From a win or lose state, the visitor MUST be able to start
  a new game in one action, resetting lives, bones, and dog placements.
- **FR-010**: System MUST NOT require an account, login, or any API key
  to play.
- **FR-011**: The pond MUST be shown as a fixed feature of the yard and
  MUST NOT be a valid dog-placement spot.

### Key Entities

- **Dog**: A placed defender; carries a position, an attack range, and
  attacks any intruder within range automatically, regardless of type.
- **Squirrel**: An intruder following the fixed ground path from start to
  porch; removed on defeat or on reaching the porch.
- **Frog**: An intruder that emerges from the pond and follows its own
  fixed path to the porch; removed on defeat or on reaching the porch.
- **Pond**: A fixed feature of the yard; the frogs' spawn point and not a
  valid dog-placement spot.
- **Yard**: The two fixed paths (squirrel and frog), the pond, and the
  valid placement spots alongside the paths.
- **Game State**: The visitor's current lives and bone count for the
  in-progress game; resets on restart or reload.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can place a dog and see it engage an
  intruder within 10 seconds of the game loading, without instructions.
- **SC-002**: Every playthrough ends in a clear win or lose state — no
  playthrough gets stuck without a result.
- **SC-003**: A visitor can start a new game in a single action after any
  win or loss.
- **SC-004**: The game is fully playable after the initial page load with
  no further network requests, accounts, or API keys.

## Assumptions

- One dog type; two intruder types (squirrels and frogs), each on its own
  fixed path; one wave — no difficulty levels or progression in this
  version.
- The pond is purely visual/spatial (the frog path's origin and a
  no-placement zone) — it has no gameplay behavior of its own.
- No persistence: game state resets on reload or restart; no scores are
  saved or compared across visits.
- Visual style (illustration vs. simple shapes) is an implementation
  detail left to the planning/implementation phase, not specified here.
- This app is registered in the site shell's app registry
  (`002-site-shell`) with status `available`, alongside the existing
  `coming-soon` entries.

## Status & Next Step

**Current state**: Implemented and verified — tests pass, lint is clean,
production build succeeds, and the game was manually played through to
both a win and a loss in a real browser. See [tasks.md](./tasks.md) for
details.

**Next step**: `001-dota-tracker-mvp` is the only remaining feature.
