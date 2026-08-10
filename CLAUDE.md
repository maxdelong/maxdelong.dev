# CLAUDE.md

Guidance for Claude Code working in this repo.

## What this is

Personal website with tools and experiments, built solo. See `README.md`
for the full pitch.

## Stack

- Next.js + React + TypeScript
- Supabase (PostgreSQL)
- Vercel hosting

## Structure

Monorepo-style: each sub-app under `apps/*` is self-contained (routes,
components, logic). Shared code only goes in `lib/`. Current/planned
sub-apps:

- `apps/dota-tracker/` — Dota 2 player stats via the OpenDota API
- `apps/blog/`, `apps/portfolio/` — planned

## Commands

```bash
npm install
npm run dev                    # local dev, http://localhost:3000
npm run build && vercel deploy # deploy
```

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
