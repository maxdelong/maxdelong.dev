# Quickstart: Dota Tracker MVP

Validation guide for confirming player search works end-to-end. See
[data-model.md](./data-model.md) and
[contracts/opendota-client.md](./contracts/opendota-client.md).

## Prerequisites

- Node.js 20 LTS
- Repo dependencies installed: `npm install`
- `002-site-shell` implemented (this feature replaces its `dota-tracker`
  coming-soon placeholder)
- Network access to `api.opendota.com` (no API key needed)

## Run

```bash
npm run dev
```

Open `http://localhost:3000/dota-tracker` (or via the sidebar).

## Validation scenarios

1. **Search by name** (User Story 1 / FR-001, FR-002)
   Enter a known public player's name (e.g. a well-known pro player's
   handle). Confirm it routes to that player's page showing MMR (or "MMR
   unavailable"), win rate, and total matches within ~10 seconds (SC-001).

2. **Search by Steam ID** (FR-001)
   Enter the same player's SteamID64 and their OpenDota account ID
   separately. Confirm both resolve to the same player page.

3. **Not found** (FR-005)
   Search a nonsense query. Confirm a clear "player not found" message —
   no error page, no blank screen.

4. **Private/unavailable profile** (FR-006)
   Search a real account ID known to have no public match data (or
   simulate by temporarily pointing at an invalid endpoint). Confirm a
   "stats unavailable" message rather than broken/empty fields.

5. **Recent matches and hero pool render together** (User Stories 2/3,
   SC-003)
   On a found player's page, confirm recent matches (with win/loss) and
   hero pool (games + win rate per hero) are both visible without
   navigating anywhere else.

6. **No account/login required** (FR-007)
   Confirm the entire flow works with no sign-in prompt anywhere.

7. **Unit tests**
   ```bash
   npm test
   ```
   Confirm `tests/lib/dota-tracker/*.test.ts` passes: search-input
   classification, SteamID64 conversion, win-rate math, and OpenDota
   error classification.

8. **Sidebar integration**
   Confirm the "Dota Tracker" sidebar entry is now a clickable link
   (no longer "coming soon") and correctly opens this page.
