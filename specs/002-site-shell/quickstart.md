# Quickstart: Site Shell & Landing Page

Validation guide for confirming the site shell works end-to-end. See
[data-model.md](./data-model.md) for the registry shape and
[contracts/app-registry.md](./contracts/app-registry.md) for how new apps
are added.

## Prerequisites

- Node.js 20 LTS
- Repo dependencies installed: `npm install`

## Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Validation scenarios

1. **Homepage loads with sidebar** (User Story 1 / FR-001, FR-002)
   Visit `/`. Confirm a left sidebar is visible listing "Dota Tracker" and
   "Spotify Tracker".

2. **Coming-soon entries are not clickable** (FR-009)
   Confirm both "Dota Tracker" and "Spotify Tracker" render visibly
   disabled (e.g., greyed out, "coming soon" label) and clicking them does
   nothing / navigates nowhere.

3. **Direct URL to a coming-soon app** (Edge Case)
   Visit `/dota-tracker` directly. Confirm it shows the same "coming soon"
   placeholder rather than a 404 or broken page.

4. **Sidebar persists across pages** (User Story 2 / FR-005)
   From `/dota-tracker`, confirm the sidebar is still visible and the
   homepage link returns you to `/`.

5. **Mobile viewport** (FR-007 / SC-004)
   Resize the browser (or use device emulation) to a mobile width (e.g.
   375px). Confirm the sidebar collapses behind a visible toggle rather
   than being cut off, and expands/collapses correctly when tapped.

6. **Registry unit tests** (SC-003)
   ```bash
   npm test
   ```
   Confirm `tests/lib/apps.test.ts` passes: `available` entries produce a
   link, `coming-soon` entries do not.

## Adding a third app (proves SC-003)

Follow the steps in [contracts/app-registry.md](./contracts/app-registry.md)
to add one more `AppEntry`. Confirm it appears in the sidebar and that no
other app's page or behavior changed.
