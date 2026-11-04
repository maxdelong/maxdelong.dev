<!--
Sync Impact Report
- Version change: 1.0.0 → 2.0.0 (MAJOR: Principle III redefined incompatibly)
- Modified principles:
  - II. Type Safety End-to-End: types flow from the data source, not specifically Supabase
  - III. App Isolation: sub-apps under apps/* replaced by feature folders in one Next.js app
  - V. Always Deployable: CI now checks main and pull requests
- Modified sections: Technology Constraints (Supabase is for when persistence is needed)
- Added sections: none
- Removed sections: none
- Follow-up TODOs: none
-->

# maxdelong.dev Constitution

## Core Principles

### I. Simplicity & YAGNI
Ship working features before polish. Do not build speculative abstractions,
config layers, or infrastructure for needs that do not yet exist. This is a
solo-maintained side project — every layer of indirection has to be justified
by a problem it solves today, not one it might solve later.

### II. Type Safety End-to-End
TypeScript is used everywhere. Types flow from the data source (an external
API or a database schema) through to the UI without being widened or
re-declared along the way. `any` is not used to route around a type error;
the underlying type is fixed instead.

### III. App Isolation
The site is one Next.js app and one deployment. Each app's code lives in its
own feature folders: `app/<slug>/`, `components/<slug>/`, and `lib/<slug>/`.
Code only moves to the top level of `lib/` or `components/` once it is
genuinely shared by more than one app. Apps do not import from one another.

### IV. Pragmatic Testing
Critical logic — API routes, data transforms, anything that touches the
database — is covered by tests. Exhaustive UI/component test coverage is
NOT required; this is a personal project maintained by one person, and test
effort should go where correctness actually matters (data integrity,
external API integration) rather than into coverage percentage.

### V. Always Deployable
`main` always builds and deploys cleanly to Vercel. CI checks `main` and
pull requests. Broken states are kept to short-lived branches, never left on
`main`.

## Technology Constraints

- **Framework**: Next.js + React + TypeScript
- **Data**: Supabase (PostgreSQL) when a feature needs persistence; no feature uses it yet
- **Hosting**: Vercel
- **External APIs**: OpenDota API (dota-tracker app), others as apps require them

Apps may introduce app-specific dependencies (e.g. a charting library for
one app) without requiring a constitution amendment, as long as they don't
conflict with these constraints or leak into other apps.

## Governance

This constitution supersedes ad hoc practice for anything it covers.
Amendments are made by re-running the constitution workflow as the project's
needs evolve — versioned per semantic versioning (MAJOR: principle removed
or redefined incompatibly; MINOR: principle or section added; PATCH:
clarification/wording). There is no separate compliance-review process
beyond the author's own judgment, consistent with Principle I.

**Version**: 2.0.0 | **Ratified**: 2026-08-09 | **Last Amended**: 2026-11-04
