---

description: "Task list template for feature implementation"
---

# Tasks: Site Shell & Landing Page

**Input**: Design documents from `/specs/002-site-shell/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/app-registry.md](./contracts/app-registry.md), [quickstart.md](./quickstart.md)

**Tests**: Included — plan.md's Technical Context explicitly designs for a Vitest test on the registry's available/coming-soon logic (Pragmatic Testing principle: this is the one piece of real logic in the feature).

**Organization**: Tasks are grouped by user story so each can be implemented and tested independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

## Path Conventions

Single Next.js project at the repository root (see plan.md's Project Structure) — this is the **first code in the repo**; Phase 1 bootstraps the project itself.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Bootstrap the Next.js project — nothing exists yet.

- [X] T001 Initialize a Next.js 14+ App Router + TypeScript project at the repository root (`package.json`, `tsconfig.json`, `next.config.ts`, `app/` directory, `.gitignore` covering `node_modules/` and `.next/`)
- [X] T002 [P] Configure Tailwind CSS: `tailwind.config.ts`, `postcss.config.js`, Tailwind directives in `app/globals.css`
- [X] T003 [P] Configure Vitest + React Testing Library: `vitest.config.ts`, `test` script in `package.json`, `tests/` directory
- [X] T004 [P] Configure ESLint per Next.js defaults (`eslint.config.mjs`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The app registry and base layout every user story builds on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 [P] Define `AppStatus` (`"available" | "coming-soon"`) and `AppEntry` types in `lib/apps.ts` per [data-model.md](./data-model.md) and [contracts/app-registry.md](./contracts/app-registry.md)
- [X] T006 Populate the `apps` registry array in `lib/apps.ts` with two entries: `{ slug: "dota-tracker", name: "Dota Tracker", status: "coming-soon" }` and `{ slug: "spotify-tracker", name: "Spotify Tracker", status: "coming-soon" }` (depends on T005)
- [X] T007 [P] Create the root layout in `app/layout.tsx`: imports `app/globals.css`, sets base page metadata, renders `{children}` inside `<html>`/`<body>`

**Checkpoint**: Registry and base layout exist — user story implementation can begin.

---

## Phase 3: User Story 1 - Discover available apps from the homepage (Priority: P1) 🎯 MVP

**Goal**: A homepage at `/` with a left sidebar listing every registered app; `available` entries are clickable links, `coming-soon` entries are visibly disabled.

**Independent Test**: Load `/`, confirm the sidebar lists "Dota Tracker" and "Spotify Tracker", both shown as coming-soon and not clickable, and the homepage content renders.

### Implementation for User Story 1

- [X] T008 [P] [US1] Create `SidebarEntry` component in `components/sidebar/SidebarEntry.tsx`: renders a Next.js `<Link>` when `status === "available"`, or a disabled/greyed span labeled "coming soon" when `status === "coming-soon"` (FR-003, FR-009)
- [X] T009 [US1] Create `Sidebar` component in `components/sidebar/Sidebar.tsx`: reads `apps` from `lib/apps.ts`, renders one `SidebarEntry` per registry entry, includes a home link, and a mobile-width collapse toggle driven by local component state (FR-002, FR-005, FR-007) (depends on T008)
- [X] T010 [US1] Mount `<Sidebar />` in `app/layout.tsx` alongside `{children}` in a flex layout (sidebar + main content area) (FR-002, FR-005) (depends on T007, T009)
- [X] T011 [P] [US1] Create the homepage in `app/page.tsx` with welcome/intro content for the site root (FR-001)
- [X] T012 [P] [US1] Write a registry rendering test in `tests/lib/apps.test.ts`: given the registry, `available` entries are identified as linkable and `coming-soon` entries are identified as non-clickable (FR-009) (depends on T005)

**Checkpoint**: User Story 1 is fully functional and independently testable — homepage and sidebar work, entries reflect their status correctly.

---

## Phase 4: User Story 2 - Switch between apps without leaving the site (Priority: P2)

**Goal**: The sidebar persists across every route, and a `coming-soon` app reached directly by URL shows the same placeholder rather than a 404 (spec Edge Cases).

**Independent Test**: Visit `/dota-tracker` directly, confirm the coming-soon placeholder renders with the sidebar still visible, then use the home link to return to `/`.

### Implementation for User Story 2

- [X] T013 [P] [US2] Create a shared placeholder component in `components/ComingSoonPlaceholder.tsx` that displays an app name and a "coming soon" message
- [X] T014 [P] [US2] Create `app/dota-tracker/page.tsx` rendering `<ComingSoonPlaceholder appName="Dota Tracker" />` (depends on T013)
- [X] T015 [P] [US2] Create `app/spotify-tracker/page.tsx` rendering `<ComingSoonPlaceholder appName="Spotify Tracker" />` (depends on T013)

**Checkpoint**: User Stories 1 and 2 both work — the sidebar persists on every route, and direct URLs to coming-soon apps behave correctly.

> **Known limitation for this pass**: both registered apps ship `coming-soon`, so the full "click from one available app to another" flow can't be end-to-end verified until at least one entry is `available` (e.g. once `003-dog-tower-defense` ships and adds itself to the registry). For now, US2 is validated via the direct-URL scenario and the home-link scenario above.

---

## Phase 5: User Story 3 - Add a new app without touching existing ones (Priority: P3)

**Goal**: Prove a new app can be added via one registry entry with zero changes to any existing app's files.

**Independent Test**: Add a temporary entry to a test copy of the registry and confirm existing entries' rendering is unaffected.

### Implementation for User Story 3

- [X] T016 [US3] Extend `tests/lib/apps.test.ts` with a case that adds an extra `AppEntry` to a test registry array and asserts the existing entries' rendering output is unchanged (SC-003, FR-006) (depends on T012)

**Checkpoint**: All three user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T017 [P] Add page metadata (title, description, favicon) in `app/layout.tsx`
- [X] T018 [P] Manually run through every scenario in [quickstart.md](./quickstart.md), including the mobile-viewport check (SC-004)
- [X] T019 Run `npm run build` to confirm the project builds cleanly (constitution Principle V: Always Deployable)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Setup — blocks all user stories.
- **User Stories (Phase 3-5)**: All depend on Foundational. US1 has no dependency on US2/US3. US2 depends on US1 only insofar as it reuses the layout/sidebar T009/T010 already built. US3 extends the test file from US1 (T012) but adds no new production code.
- **Polish (Phase 6)**: Depends on the user stories you choose to complete.

### Parallel Opportunities

- T002, T003, T004 (Setup) can run in parallel.
- T005 and T007 (Foundational) can run in parallel; T006 depends on T005.
- T008, T011, T012 (US1) can run in parallel; T009 depends on T008; T010 depends on T007 and T009.
- T013 (US2) can start in parallel with US1 work; T014 and T015 depend on T013 and can run in parallel with each other.

---

## Parallel Example: User Story 1

```bash
Task: "Create SidebarEntry component in components/sidebar/SidebarEntry.tsx"
Task: "Create homepage in app/page.tsx"
Task: "Write registry rendering test in tests/lib/apps.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: load `/`, confirm the sidebar and homepage work
5. Deploy/demo if ready — this alone is a working landing page

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. Add US1 → validate → deploy (MVP: homepage + sidebar)
3. Add US2 → validate → deploy (direct-URL + persistent nav)
4. Add US3 → validate (registry extensibility proven by test)
5. Polish → final build check

---

## Notes

- [P] tasks touch different files with no dependency on an incomplete task.
- Commit after each task or logical group.
- Stop at any checkpoint to validate a story independently before continuing.

## Status & Next Step

**Current state**: Implemented. All 19 tasks complete; tests pass (3/3),
lint is clean, and `npm run build` succeeds.

**Implementation deviations from the plan** (all functionally equivalent):

- TypeScript pinned to `6.0.3` instead of the newest `7.0.2` —
  `typescript-eslint` doesn't yet support TS 7's native compiler.
- ESLint config uses `@next/eslint-plugin-next`'s native flat config +
  `typescript-eslint` directly, instead of `eslint-config-next` via
  `FlatCompat` — the compat shim crashed on a circular plugin reference
  when combined with this ESLint/Next version pairing.
- No `tailwind.config.ts` file — Tailwind v4 needs no config file for this
  project's needs (CSS-first `@import "tailwindcss"` in `globals.css` is
  sufficient); content detection is automatic.
- The registry test file is `tests/lib/apps.test.tsx` (not `.ts`) since it
  renders JSX via React Testing Library.

**Next step**: Implement `003-dog-tower-defense` (`/speckit-implement`) —
its Setup phase adds one line to the `lib/apps.ts` created here, and once
it ships as an `available` app, User Story 2's full "switch between two
available apps" flow becomes end-to-end testable for the first time.
