# Implementation Plan: Site Shell & Landing Page

**Branch**: `002-site-shell` | **Date**: 2026-08-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-site-shell/spec.md`

## Summary

Build the site's single Next.js homepage and persistent left sidebar that
lists every app on the site. This is the first real code in the repo — no
`package.json` exists yet, so this plan also bootstraps the Next.js project
itself. The sidebar reads from one typed registry (`lib/apps.ts`) that maps
an app slug to a display name and a status of `available` or `coming-soon`;
adding a future app means adding one registry entry and a route folder,
touching nothing else (FR-006, SC-003).

For this initial build pass, the registry ships with two entries: **Dota
Tracker** (`coming-soon` — its own MVP spec, `001-dota-tracker-mvp`, isn't
being built in this pass) and **Spotify Tracker** (`coming-soon` — a
lightweight/wireframe placeholder added specifically to prove the registry
pattern works for a second app). Per FR-009, both render as visibly
disabled, non-clickable sidebar entries — landing on either page directly
by URL also shows the same "coming soon" placeholder rather than a working
app or a 404. Blog and Portfolio (mentioned in the spec's Assumptions as
future placeholders) are intentionally **not** added to the registry in
this pass — the user's build request named only these two apps, and adding
the others is a one-line registry change whenever they're wanted.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode), Node.js 20 LTS

**Primary Dependencies**: Next.js 14+ (App Router), React 18+, Tailwind CSS
(utility-first styling for the responsive/collapsible sidebar with minimal
custom CSS)

**Storage**: N/A — this feature has no persistence; nothing touches
Supabase

**Testing**: Vitest + React Testing Library for the app registry's
available/coming-soon rendering logic (the one piece of real logic in this
feature). Per the constitution's Pragmatic Testing principle, the sidebar's
visual layout itself is not exhaustively tested.

**Target Platform**: Web, deployed to Vercel (single deployment, no
separate backend)

**Project Type**: Single Next.js web application (frontend and routing
unified; no separate backend project)

**Performance Goals**: No performance targets are specified in the spec
beyond usability (SC-001–SC-004). Using the industry-standard default for a
mostly-static Next.js page: sub-2-second time-to-interactive on a typical
broadband connection.

**Constraints**: Must remain usable on both mobile-width and desktop-width
viewports (FR-007); no visitor accounts/auth (spec Assumption); single
Vercel deployment, no subdomains per app (spec Assumption).

**Scale/Scope**: Personal-site scale — a handful of registry entries at
most; no concurrency or load concerns.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Evaluated against `.specify/memory/constitution.md` (the root project
constitution — this feature is the site shell itself, not a sub-app under
`apps/*`, so the root constitution governs it):

- **I. Simplicity & YAGNI**: PASS. No database, no auth, no state
  management library, no test framework beyond one lightweight tool for the
  one piece of real logic (the registry). Blog/Portfolio are deliberately
  left out of the registry rather than pre-built as unused scaffolding.
- **II. Type Safety End-to-End**: PASS. TypeScript strict mode; the app
  registry is a single typed source (`AppEntry[]`) that both the sidebar
  and route structure read from — no re-declaration of app metadata
  elsewhere.
- **III. App Isolation**: PASS. Each app (Dota Tracker, Spotify Tracker)
  owns its own route folder under `app/`; shared code (the registry, the
  sidebar component) lives in `lib/` and `components/` because it's
  genuinely shared by more than one app, not because it's convenient.
- **IV. Pragmatic Testing**: PASS. Tests target the registry's
  available/coming-soon logic (the only non-presentational logic here);
  the sidebar's visual rendering is not exhaustively covered.
- **V. Always Deployable**: Applies at merge time, not to this plan
  directly — noted as an implementation constraint (Vercel preview must
  succeed) rather than a design gate.

**Known open issue (not a gate blocker for this feature)**: A second,
conflicting document exists at `apps/dota-tracker/CONSTITUTION.md`
(mandatory UI tests, maintainer code review, 1-hour data freshness, etc.)
that contradicts the root constitution on several points. It does not
govern this feature (site shell, not Dota Tracker's own functionality), so
it isn't a gate here — but it should be reconciled or retired before
`001-dota-tracker-mvp` is planned, since that feature *does* fall under it.

**Post-Phase 1 re-check**: The Phase 1 design artifacts (data-model.md,
contracts/app-registry.md) add nothing beyond a single typed in-code
registry — no database, no network API, no new external dependency. All
five gate evaluations above still hold; no new violations introduced.

## Project Structure

### Documentation (this feature)

```text
specs/002-site-shell/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md         # Phase 1 output (/speckit-plan command)
├── quickstart.md         # Phase 1 output (/speckit-plan command)
├── contracts/            # Phase 1 output (/speckit-plan command)
└── tasks.md              # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
package.json
tsconfig.json
next.config.ts
tailwind.config.ts

app/
├── layout.tsx              # Root layout: renders <Sidebar /> alongside page content
├── page.tsx                 # Homepage ("/") — welcome content + relies on the sidebar for nav
├── globals.css
├── dota-tracker/
│   └── page.tsx               # "Coming soon" placeholder (registry status: coming-soon)
└── spotify-tracker/
    └── page.tsx               # Wireframe/"coming soon" placeholder

components/
└── sidebar/
    ├── Sidebar.tsx             # Persistent left nav; collapsible on mobile widths
    └── SidebarEntry.tsx        # Renders one registry entry: <Link> if available, disabled span if coming-soon

lib/
└── apps.ts                    # App registry — single source of truth for FR-006/SC-003

tests/
└── lib/
    └── apps.test.ts           # Registry logic: available entries link out, coming-soon entries don't
```

**Structure Decision**: Single Next.js App Router project (Option A from
earlier discussion) — one deployment, one `app/` route tree. Each sub-app
gets its own top-level route folder and owns everything under it; the only
shared surface is the registry (`lib/apps.ts`) and the sidebar component.
This supersedes the old assumption in `apps/dota-tracker/README.md` /
`CONSTITUTION.md` that sub-apps live under a separate `apps/*` directory
tree and could be deployed independently — per the site-shell spec's
Assumptions, everything now ships as one deployment.

## Complexity Tracking

No constitution violations requiring justification — table omitted.

## Status & Next Step

**Current state**: Implemented. See [tasks.md](./tasks.md) for the task
checklist and a short list of implementation deviations (TypeScript
pinned to 6.0.3 for `typescript-eslint` compatibility; ESLint uses a
native flat config instead of `eslint-config-next`'s `FlatCompat` shim; no
`tailwind.config.ts` needed under Tailwind v4).

**Next step**: Implement `003-dog-tower-defense`.
