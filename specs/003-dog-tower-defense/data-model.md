# Data Model: Dog Tower Defense

No database or persistence (spec Assumptions). All entities are in-memory,
client-side objects that reset on reload or restart.

## Path

An ordered list of waypoints one intruder type follows from spawn to the
porch.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `"squirrel" \| "frog"` | Which intruder type this path belongs to. |
| `waypoints` | `{ x: number; y: number }[]` | Ordered points; the last one is always the shared porch coordinate. |

## Pond

| Field | Type | Notes |
|-------|------|-------|
| `bounds` | `{ x: number; y: number; width: number; height: number }` | The pond's fixed area; the frog path's first waypoint sits at its edge. Not a valid placement spot (FR-011). |

## PlacementSpot

A predefined valid location for a dog (see research.md: fixed list, not
freeform).

| Field | Type | Notes |
|-------|------|-------|
| `id` | `string` | Stable identifier, e.g. `"spot-1"`. |
| `position` | `{ x: number; y: number }` | Where a dog placed here is drawn. |
| `occupiedBy` | `string \| null` | The `Dog.id` placed here, or `null` if free. |

## Dog

| Field | Type | Notes |
|-------|------|-------|
| `id` | `string` | Unique per placed dog. |
| `spotId` | `string` | The `PlacementSpot.id` it occupies. |
| `range` | `number` | Fixed attack radius (same for every dog — one dog type). |
| `cooldownMs` | `number` | Time until it can attack again; 0 = ready (FR-014). |

## Intruder

| Field | Type | Notes |
|-------|------|-------|
| `id` | `string` | Unique per spawned intruder. |
| `type` | `"squirrel" \| "frog"` | Determines which `Path` it follows and its sprite. |
| `pathProgress` | `number` (0–1) | Position along its path; 1 = reached the porch. |
| `alive` | `boolean` | `false` once defeated or once it reaches the porch. |
| `spawnAtMs` | `number` | Wave time at which it enters the yard (FR-013). |

## GameState

| Field | Type | Notes |
|-------|------|-------|
| `lives` | `number` | Starts at a fixed value; game-over at 0 (FR-008). |
| `bones` | `number` | Starts at a fixed value; spent on placement (FR-002), earned on defeat (FR-005). |
| `dogs` | `Dog[]` | Currently placed dogs. |
| `intruders` | `Intruder[]` | All intruders in the current wave, alive or not. |
| `attacks` | `Attack[]` | Recent attacks, kept briefly so the canvas can draw them. |
| `elapsedMs` | `number` | Time since the wave started. |
| `status` | `"ready" \| "playing" \| "won" \| "lost"` | Drives the Start button and win/lose message (FR-007, FR-008, FR-012). |

## State transitions

- `status` starts `"ready"` and moves to `"playing"` when the visitor starts
  the wave (FR-012). It then moves to `"lost"` the instant `lives`
  reaches 0 (checked on every intruder-reaches-porch event), or to
  `"won"` once every intruder in `intruders` is no longer `alive` and
  `lives > 0`.
- Restart (FR-009) discards the current `GameState` and creates a fresh
  one with starting `lives`/`bones`, an empty `dogs` list, and a freshly
  spawned `intruders` list — nothing carries over.
