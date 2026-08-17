# Feature Specification: Site Shell & Landing Page

**Feature Branch**: `002-site-shell`

**Created**: 2026-08-16

**Status**: Draft

**Input**: User description: "Site shell and landing page: convert this project to run as one unified Next.js website. A homepage at "/" with a left sidebar that lists and links to each available app/tool (starting with Dota Tracker). Each app is segmented into its own folder under a shared app registry so new apps can be added by dropping in a folder and one registry entry, without touching existing apps' code. This replaces the assumption of separately-deployable sub-apps under apps/* — everything ships as a single Vercel deployment."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discover available apps from the homepage (Priority: P1)

A visitor arrives at the site's root URL and sees a homepage with a left
sidebar listing every app/tool currently available on the site (starting
with Dota Tracker). They select an app from the sidebar to open it.

**Why this priority**: This is the entire point of the feature — a single
entry point that ties the site's tools together. Without it there is no
unified site, just disconnected pages.

**Independent Test**: Load the site root, confirm the sidebar lists Dota
Tracker, click it, and confirm the app loads within the same site (no
external redirect or separate domain).

**Acceptance Scenarios**:

1. **Given** the visitor loads the site root, **When** the page finishes
   loading, **Then** a homepage with a left sidebar listing all available
   apps is shown.
2. **Given** the sidebar, **When** the visitor selects an app, **Then**
   that app's page loads within the same site and the sidebar remains
   reachable.
3. **Given** the sidebar, **When** the visitor selects the app they are
   already viewing, **Then** they remain on that app's page with no error.

---

### User Story 2 - Switch between apps without leaving the site (Priority: P2)

While inside one app, a visitor decides to check out another app on the
site and uses the sidebar to jump directly to it.

**Why this priority**: Reinforces that this is one cohesive site rather
than a landing page visitors bounce off of. Matters once more than one app
exists, but isn't blocking for an initial launch with a single working app.

**Independent Test**: From within Dota Tracker, use the sidebar to
navigate to another listed app or back to the homepage, and confirm the
switch happens within the site.

**Acceptance Scenarios**:

1. **Given** the visitor is inside an app, **When** they select a
   different app from the sidebar, **Then** the new app loads and the
   sidebar still shows the full app list.
2. **Given** the visitor is inside an app, **When** they select the
   home link, **Then** they return to the homepage.

---

### User Story 3 - Add a new app without touching existing ones (Priority: P3)

The site maintainer makes a new app appear in the sidebar and become
reachable by visitors by adding it in a single, well-defined place, without
editing any other app's code.

**Why this priority**: Supports the site's future growth (explicitly
requested), but isn't needed for the initial landing page launch.

**Independent Test**: Add a new app entry and confirm it appears in the
sidebar and is reachable, while every existing app's behavior and code are
unaffected.

**Acceptance Scenarios**:

1. **Given** a new app has been added to the site's app list, **When** a
   visitor loads the homepage, **Then** the new app appears in the sidebar
   alongside existing apps.
2. **Given** a new app has been added, **When** existing apps are used,
   **Then** their behavior and code are unaffected.

---

### Edge Cases

- What happens if a visitor navigates directly to an app's URL without
  going through the homepage or sidebar? (The app loads directly, and the
  sidebar is still present for further navigation.)
- What happens on a narrow/mobile screen where a persistent left sidebar
  doesn't fit?
- What happens if an individual app fails to load — does the sidebar and
  the rest of the site remain usable?
- What happens if a visitor tries to reach a "coming soon" app directly by
  URL rather than through the sidebar? (Same "coming soon" treatment
  applies — no working page is exposed at that route either.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST present a homepage at the site's root URL.
- **FR-002**: Homepage MUST display a left-hand sidebar listing every
  currently available app/tool on the site.
- **FR-003**: Each sidebar entry MUST link directly to its corresponding
  app.
- **FR-004**: Selecting an app from the sidebar MUST navigate the visitor
  to that app within the same site (same domain, no external redirect).
- **FR-005**: The sidebar MUST remain accessible while a visitor is using
  an individual app, so they can switch to another app or return home
  without relying on the browser's back button.
- **FR-006**: System MUST support adding a new app to the sidebar by
  adding a single, self-contained entry, without requiring changes to any
  other app's code.
- **FR-007**: On narrow/mobile screen widths, the sidebar MUST remain
  reachable (e.g., collapsible) rather than being cut off or unusable.
- **FR-008**: If an individual app fails to load, the sidebar and homepage
  MUST remain usable rather than the whole site breaking.
- **FR-009**: An app that has no working implementation yet MUST still
  appear in the sidebar, visibly marked "coming soon," and MUST NOT be
  clickable/navigable until it becomes available.

### Key Entities

- **App (registry entry)**: Represents one tool/sub-app on the site;
  carries a name, a path, and a status of either "available" or
  "coming soon."

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can identify and reach any available
  app from the homepage in a single click, without needing instructions.
- **SC-002**: A visitor can switch from one app to another in a single
  interaction, without being forced back to the homepage or to an external
  URL.
- **SC-003**: Adding a new app to the site requires editing only one
  registration point, with zero changes to any existing app's files.
- **SC-004**: The homepage and sidebar remain fully usable — readable,
  all links clickable — on both a typical mobile-width screen and a
  typical desktop-width screen.

## Assumptions

- This feature governs only the shared site shell (homepage, sidebar, app
  registry). The functionality of individual apps — e.g., Dota Tracker's
  player search — is specified separately per app and is out of scope
  here.
- At launch, Dota Tracker is the only app with a spec in progress. Blog,
  Portfolio, and Spotify Tracker are placeholder entries with no working
  implementation yet ("coming soon" per FR-009); their own feature specs
  are out of scope for this feature.
- The site has a single visitor type with no accounts or roles; sidebar
  content does not vary per visitor.
- No app requires a distinct top-level domain or subdomain; all apps live
  under this one site's routes.
- This feature supersedes the previous assumption (in project docs) that
  sub-apps under `apps/*` are separately deployable; everything ships as
  one deployment.

## Status & Next Step

**Current state**: Implemented and verified — tests pass, lint is clean,
production build succeeds. See [tasks.md](./tasks.md) for the full task
list and implementation notes.

**Next step**: Implement `003-dog-tower-defense`
(`/speckit-implement`) — its Setup phase depends on the `lib/apps.ts`
this feature created.
