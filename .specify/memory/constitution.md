<!--
Sync Impact Report
- Version change: [TEMPLATE] → 1.0.0 (initial ratification)
- Modified principles: n/a (first version)
- Added sections: Core Principles (5), Technology Constraints, Governance
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
TypeScript is used everywhere. Types flow from the Supabase schema through
API routes to the UI without being widened or re-declared along the way.
`any` is not used to route around a type error; the underlying type is fixed
instead.

### III. App Isolation
Each sub-app under `apps/*` owns its own routes, components, and logic.
Code only moves into `lib/` once it is genuinely shared by more than one
sub-app. Sub-apps do not import from one another directly.

### IV. Pragmatic Testing
Critical logic — API routes, data transforms, anything that touches the
database — is covered by tests. Exhaustive UI/component test coverage is
NOT required; this is a personal project maintained by one person, and test
effort should go where correctness actually matters (data integrity,
external API integration) rather than into coverage percentage.

### V. Always Deployable
`main` always builds and deploys cleanly to Vercel. Broken states are kept
to short-lived branches, never left on `main`.

## Technology Constraints

- **Framework**: Next.js + React + TypeScript
- **Data**: Supabase (PostgreSQL)
- **Hosting**: Vercel
- **External APIs**: OpenDota API (dota-tracker app), others as sub-apps require them

Sub-apps may introduce app-specific dependencies (e.g. a charting library for
one app) without requiring a constitution amendment, as long as they don't
conflict with these constraints or leak into other sub-apps.

## Governance

This constitution supersedes ad hoc practice for anything it covers.
Amendments are made by re-running the constitution workflow as the project's
needs evolve — versioned per semantic versioning (MAJOR: principle removed
or redefined incompatibly; MINOR: principle or section added; PATCH:
clarification/wording). There is no separate compliance-review process
beyond the author's own judgment, consistent with Principle I.

**Version**: 1.0.0 | **Ratified**: 2026-08-09 | **Last Amended**: 2026-08-09
