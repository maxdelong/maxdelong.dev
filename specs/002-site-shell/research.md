# Research: Site Shell & Landing Page

## Next.js routing model: App Router vs. Pages Router

**Decision**: App Router (`app/` directory).

**Rationale**: App Router is the current Next.js default and the
recommended path for new projects; nested layouts make the persistent
sidebar-plus-page-content shell (root `layout.tsx` wrapping every route)
straightforward without a custom `_app`/`_document` setup. Since this repo
has zero existing Next.js code, there's no migration cost to weigh.

**Alternatives considered**: Pages Router — rejected; it's the legacy
model and offers no advantage here, only extra boilerplate for the shared
layout.

## Styling approach

**Decision**: Tailwind CSS.

**Rationale**: The sidebar needs a responsive/collapsible behavior (FR-007)
across mobile and desktop widths. Tailwind's utility classes and built-in
breakpoint system (`sm:`, `md:`, etc.) cover this with no custom CSS
authoring or breakpoint bookkeeping. It's also already referenced as the
intended stack in `apps/dota-tracker/README.md`, so it's not introducing an
unfamiliar tool.

**Alternatives considered**: Hand-written CSS Modules — rejected as more
boilerplate for equivalent responsive behavior, with no offsetting benefit
for a project this size (YAGNI).

## Mobile sidebar collapse mechanism

**Decision**: A small client component (`"use client"`) holding open/closed
state via `useState`, toggled by a hamburger button below the `md:`
breakpoint; the sidebar is always visible (no toggle) at `md:` and above.

**Rationale**: Simplest mechanism that satisfies FR-007 ("sidebar MUST
remain reachable... rather than being cut off") without a routing library,
global state, or animation dependency.

**Alternatives considered**: CSS-only `<details>`/checkbox-driven toggle —
rejected; slightly less discoverable/accessible than a labeled button, and
saves no real complexity here since the component is tiny either way.

## Testing framework

**Decision**: Vitest + React Testing Library.

**Rationale**: Fast, minimal-config, and the modern default pairing for
Next.js/React projects; no existing test setup in the repo to be consistent
with, so no switching cost. Matches the constitution's Pragmatic Testing
principle: cover the one piece of real logic (registry-driven
available/coming-soon rendering) without mandating exhaustive UI test
coverage.

**Alternatives considered**: Jest — rejected only on the margin (slightly
heavier config for ESM/TypeScript in a fresh Next.js project); either would
have satisfied the requirement.

## "Coming soon" apps: route existence

**Decision**: Each `coming-soon` registry entry still gets a real route
folder (e.g. `app/dota-tracker/page.tsx`) rendering a shared "coming soon"
placeholder component, rather than having no route at all.

**Rationale**: Spec edge case: a visitor navigating directly to a
coming-soon app's URL must see the same "coming soon" treatment, not a
404 (spec.md Edge Cases). A route that exists and renders a placeholder
satisfies this directly; a missing route would require a catch-all/404
override to fake the same behavior.

**Alternatives considered**: Omit the route and let Next.js 404 —
rejected; contradicts the spec's edge case explicitly.
