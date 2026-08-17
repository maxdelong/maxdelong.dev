# Implementation Plan: Dog Tower Defense

**Branch**: `003-dog-tower-defense` | **Date**: 2026-08-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-dog-tower-defense/spec.md`

## Summary

A single-page browser game at `/dog-tower-defense`, built the same way as
the rest of the site (Next.js App Router, TypeScript, no backend). Game
logic (placement validation, range detection, bone economy, win/lose) is
written as plain, framework-free TypeScript functions so it's testable
without touching the canvas; a thin React component owns the render loop
and draws the yard, both paths, the pond, dogs, and intruders on an HTML
canvas. This app plugs into the site shell (`002-site-shell`) by adding one
entry to the shared registry (`lib/apps.ts`), per that feature's
`contracts/app-registry.md` — no other app's code changes.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode) — same as `002-site-shell`

**Primary Dependencies**: Next.js 14+ (App Router), React 18+. No canvas
library or game engine — the HTML5 Canvas 2D API is sufficient for this
scope (two paths, ~10 intruders, one dog type).

**Storage**: N/A — no persistence, matching FR-010 and the spec's
Assumptions (state resets on reload).

**Testing**: Vitest for the pure game-logic functions (placement
validity, range detection, bone spend/award, win/lose evaluation). The
canvas rendering itself is not unit tested, consistent with the
constitution's Pragmatic Testing principle and the same choice made for
`002-site-shell`.

**Target Platform**: Web, same single Vercel deployment as the rest of the
site — this is a route within it, not a separate deployment.

**Project Type**: Single Next.js web application (adds one route + its own
component/logic folders; no new project).

**Performance Goals**: Smooth animation at typical device refresh rate
(60fps) for the small number of on-screen entities involved (≤ ~15 sprites
at once); no specific numeric target given the trivial scene complexity.

**Constraints**: No accounts, no API keys, no network calls after initial
page load (FR-010, SC-004); must not require changes to any other app's
files (App Isolation principle; site-shell FR-006).

**Scale/Scope**: One wave, one dog type, two intruder types, two fixed
paths, a handful of fixed placement spots — deliberately small per the
spec's Assumptions.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Evaluated against `.specify/memory/constitution.md` (root constitution —
this is a site sub-app, not `apps/dota-tracker`, so the conflicting
`apps/dota-tracker/CONSTITUTION.md` doesn't apply here):

- **I. Simplicity & YAGNI**: PASS. No game engine, no state library, no
  persistence, no difficulty system — the spec's own Assumptions already
  bound scope tightly, and this plan doesn't add anything beyond it.
- **II. Type Safety End-to-End**: PASS. TypeScript strict mode; game state
  and entities (Dog, Intruder, Path) are defined once as typed interfaces
  and shared between logic and rendering.
- **III. App Isolation**: PASS. All game code lives under its own route
  and folders; the only shared touchpoint is the one registry line defined
  by `002-site-shell`'s contract, not ad hoc imports from other apps.
- **IV. Pragmatic Testing**: PASS. Tests cover the actual game rules
  (placement, combat range, economy, win/lose) as pure functions; the
  canvas drawing code is intentionally left untested.
- **V. Always Deployable**: Applies at merge time; noted as an
  implementation constraint, not a design gate.

**Post-Phase 1 re-check**: The data model (below) is still just typed,
in-memory objects — no new dependency, no persistence, no network surface
introduced by the design artifacts. All gates still hold.

## Project Structure

### Documentation (this feature)

```text
specs/003-dog-tower-defense/
├── plan.md               # This file (/speckit-plan command output)
├── research.md            # Phase 0 output (/speckit-plan command)
├── data-model.md           # Phase 1 output (/speckit-plan command)
├── quickstart.md           # Phase 1 output (/speckit-plan command)
├── contracts/              # Phase 1 output (/speckit-plan command)
└── tasks.md                # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
app/
└── dog-tower-defense/
    └── page.tsx                    # Route entry; renders the game component

components/
└── dog-tower-defense/
    ├── GameCanvas.tsx               # Client component: owns the render loop, draws yard/paths/pond/dogs/intruders
    └── Hud.tsx                       # Lives, bones, win/lose overlay, restart button

lib/
├── apps.ts                          # (from 002-site-shell) one entry added: dog-tower-defense, status "available"
└── dog-tower-defense/
    ├── types.ts                      # Dog, Intruder, GameState, Path, Pond types
    ├── paths.ts                      # Fixed waypoint lists for the squirrel path and frog/pond path
    ├── placement.ts                  # Valid-spot + affordability checks (FR-001, FR-002, FR-011)
    ├── combat.ts                     # Range detection + attack resolution (FR-003)
    └── gameState.ts                  # Spawn/advance/win/lose logic (FR-004–FR-009)

tests/
└── lib/
    └── dog-tower-defense/
        ├── placement.test.ts
        ├── combat.test.ts
        └── gameState.test.ts
```

**Structure Decision**: Same single Next.js project as `002-site-shell`;
this feature adds one route folder plus its own `components/` and `lib/`
subfolders, following the App Isolation pattern already established.

## Complexity Tracking

No constitution violations requiring justification — table omitted.

## Status & Next Step

**Current state**: Implemented. See [tasks.md](./tasks.md) for
implementation notes (combat model, tuned game constants).

**Next step**: `001-dota-tracker-mvp` is the only remaining feature.
