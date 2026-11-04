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
- `dog-tower-defense` — browser game; rules are pure functions in `lib/`
- `spotify-tracker` — coming-soon placeholder

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
