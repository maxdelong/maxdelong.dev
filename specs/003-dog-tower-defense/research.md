# Research: Dog Tower Defense

## Rendering approach

**Decision**: HTML5 Canvas 2D API, driven by a `requestAnimationFrame`
loop inside a single client component.

**Rationale**: The scene is small (two paths, a pond, ≤ ~15 sprites at
once) — well within what Canvas 2D handles trivially, with no extra
library. Canvas also cleanly separates "drawing" from "game rules" (the
loop reads plain state and paints it), which keeps the pure-logic modules
in `lib/dog-tower-defense/` framework-free and unit-testable.

**Alternatives considered**: Absolutely-positioned DOM elements animated
via CSS/JS — rejected; works for this scale too, but hit-testing "did the
visitor click a valid placement spot" and animating multiple independent
paths is more natural with canvas coordinates than DOM layout math. A
game engine/library (e.g. Phaser) — rejected as overkill (YAGNI) for a
one-wave, one-tower-type game.

## Placement spots

**Decision**: A small, fixed list of predefined placement coordinates
(not freeform click-anywhere-off-path placement).

**Rationale**: Validating "is this pixel far enough from both path
polylines and the pond" is real geometry work for no real gameplay
benefit at this scope. A fixed set of spots (e.g. 6–8 marked tiles beside
the paths) satisfies FR-001/FR-011 with a simple lookup instead of
geometric distance checks, and is easy to unit test exhaustively.

**Alternatives considered**: Freeform placement with distance-based
validation against path/pond geometry — rejected as unnecessary
complexity for one wave and one dog type.

## Two paths sharing one destination

**Decision**: The squirrel path and the frog/pond path are two independent
fixed waypoint lists that both terminate at the same porch coordinate.
Both are advanced by the same per-frame update logic (a generic
"move intruder along its own path" function), parameterized by which path
each intruder was spawned on.

**Rationale**: Keeps `gameState.ts` free of squirrel-specific vs
frog-specific branching — an intruder just carries a reference to its
path and a progress value; the update logic doesn't care which path it
is. This directly supports FR-003's "dogs attack any intruder regardless
of type" requirement, since intruders are structurally uniform aside from
their path and sprite.

**Alternatives considered**: Separate update functions per intruder type —
rejected; would duplicate logic for no behavioral difference between
squirrels and frogs beyond their path and appearance.

## Testing framework

**Decision**: Vitest, matching `002-site-shell`'s choice, for consistency
across the repo's first two real features.

**Rationale**: No reason to introduce a second test runner; same
rationale as `002-site-shell`'s research.md applies here.

**Alternatives considered**: None re-evaluated — see `002-site-shell`'s
research.md for the original comparison against Jest.
