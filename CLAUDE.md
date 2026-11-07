# CLAUDE.md

Guidance for Claude Code working in this repo.

## What this is

Personal website with tools and experiments, built solo. See `README.md`
for the full pitch.

## Stack

- Next.js + React + TypeScript
- Vercel hosting
- Supabase (PostgreSQL) when a feature needs persistence; nothing uses it yet

## Structure

One Next.js app and one deployment. Each app's code lives in
`app/<slug>/`, `components/<slug>/`, and `lib/<slug>/`, and apps don't import
from one another. Registering an app takes one entry in `lib/apps.ts`.

- `dota-tracker` — Dota 2 player stats via the OpenDota API; known problems
  are in `specs/001-dota-tracker-mvp/follow-ups.md`
- `dog-tower-defense` — browser game; rules are pure functions in `lib/`, and
  `tests/lib/dog-tower-defense/balance.test.ts` plays whole games to enforce
  balance, including the German Shepherd staying the best breed
- `hero-roulette` — random Dota 2 hero and loose plan, using a checked-in hero list
- `daily-fetch` — one throw a day; the date seeds the day, and the throw is saved in
  the browser
- `lunch-roulette` — spins a list saved in the browser
- `car-cost` — compares two cars; total cost deliberately excludes loan payments
- `work-backward` — works out step start times from an arrival time
- `emoji-search` — searches a checked-in Emojibase snapshot in the browser; ranking is
  in `lib/emoji-search/search.ts`
- `agentic-dev` — dated research snapshot; content and sources are in `lib/agentic-dev/`.
  Update `LAST_CHECKED` when changing it, and only cite sources that were actually read
- `spotify-tracker` — coming-soon placeholder
- `docs` — publishes Markdown files listed in `lib/docs.ts` at `/docs`

Each app keeps its possible improvements in `lib/<slug>/todos.ts`. Its `lib/apps.ts`
entry must include them, which feeds the cards on its page and `/docs/todos`. Change
the app's list rather than adding a second copy, and put site-wide work in
`BACKLOG.md`.

When something user-visible changes, update `docs/changelog.md`. Game rule changes
also go in `docs/dog-tower-defense.md`; a test checks its prices and stats against
the game data. Colors come from the theme tokens in `app/globals.css`, so use
classes like `text-ink` and `bg-panel` rather than fixed colors.

## Commands

```bash
npm install
npm run dev       # local dev, http://localhost:3000
npm run lint
npm run typecheck
npm test
npm run build
```

CI runs lint, typecheck, tests and build on `main` and on pull requests.
Vercel deploys from GitHub.

## Conventions

Full principles live in `.specify/memory/constitution.md` (simplicity/YAGNI,
end-to-end type safety, app isolation, pragmatic testing, always-deployable
`main`). Worth internalizing since they're intentionally light-touch by
design — this is a solo project, not a large-team codebase.

## Working on features

This repo uses Spec Kit for spec-driven development. For anything beyond a
small fix, prefer the workflow over jumping straight to code:

`/speckit-specify` → `/speckit-clarify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`

Specs live under `specs/<NNN>-<feature-name>/`. Skills are defined in
`.claude/skills/speckit-*/`.
