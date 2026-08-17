# Quickstart: Dog Tower Defense

Validation guide for confirming the game works end-to-end. See
[data-model.md](./data-model.md) for entity shapes and
[contracts/site-registration.md](./contracts/site-registration.md) for how
this app plugs into the site shell.

## Prerequisites

- Node.js 20 LTS
- Repo dependencies installed: `npm install`
- `002-site-shell` implemented (this feature needs the sidebar/registry to
  be reachable from)

## Run

```bash
npm run dev
```

Open `http://localhost:3000/dog-tower-defense` (or reach it via the
sidebar from `/`).

## Validation scenarios

1. **Place a dog** (User Story 1 / FR-001, FR-002)
   Click a valid placement spot with enough bones. Confirm a dog appears
   there and the bone count decreases. Try again with insufficient bones
   and confirm placement is rejected.

2. **Automatic combat, either intruder type** (FR-003)
   Start the wave. Confirm a placed dog attacks a squirrel and a frog
   automatically, with no further clicks, when either comes into range.

3. **Bones and lives update correctly** (FR-005, FR-006)
   Confirm bones increase when an intruder is defeated, and lives
   decrease by exactly one when an intruder reaches the porch.

4. **Pond is not placeable** (FR-011)
   Try clicking on the pond area. Confirm no dog is placed there.

5. **Win and lose states** (User Story 2 / FR-007, FR-008)
   Let a wave play out to a full clear (win) in one run, and let enough
   intruders through to hit zero lives (lose) in another. Confirm the
   correct state is shown in each case, and that a loss is shown
   immediately at zero lives without waiting for the wave to finish.

6. **Restart** (FR-009)
   From either a win or lose state, use the restart control. Confirm
   lives, bones, and dog placements all return to their starting values.

7. **No network dependency** (FR-010, SC-004)
   With devtools' network tab open, confirm no requests fire after the
   initial page load — no accounts, no API keys, nothing external.

8. **Unit tests**
   ```bash
   npm test
   ```
   Confirm `tests/lib/dog-tower-defense/*.test.ts` passes: placement
   validity, combat range detection, and win/lose evaluation.
