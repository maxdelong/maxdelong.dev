# Feature Specification: Hero Roulette

**Feature Branch**: `006-hero-roulette`

**Created**: 2026-11-06

**Status**: Implemented

**Input**: User description: "Hero Roulette is a good idea. Keep the build high level and a fun idea. Can eventually integrate other APIs to see what builds people are using and use AI to analyze them at some cadence, but first pass let's make it simple, then make todo cards."

## Requirements

- **FR-001**: A spin MUST give a random Dota 2 hero, a loosely described build, a lane and a silly house rule.
- **FR-002**: A build MUST suit one of the hero's roles, except that about 15% of spins are deliberately mismatched and labeled "Cursed build".
- **FR-003**: Builds MUST stay high level and be clearly described as written for fun, not real item data.
- **FR-004**: The first reroll MUST be free. Each later one MUST add a penalty, and rerolls MUST end when the penalties run out.
- **FR-005**: A reroll MUST NOT give the same hero twice in a row.
- **FR-006**: The visitor MUST be able to lock in a result and then spin again, which clears their rerolls and penalties.
- **FR-007**: Penalties MUST be harmless to teammates.
- **FR-008**: The page MUST show later work as to-do cards.
- **FR-009**: The app MUST work with no network requests, accounts or API keys.

## Assumptions

- The hero list is a checked-in snapshot of OpenDota's `/heroes` endpoint.
- Live build data, other APIs and AI analysis are out of scope for this version. They are to-do cards in `lib/hero-roulette/todos.ts`.
- Nothing is saved between visits.

## Status

Implemented.
