# Feature Specification: Site Refresh and Docs

**Feature Branch**: `005-site-refresh-and-docs`

**Created**: 2026-11-06

**Status**: Implemented

**Input**: User description: "Make the website feel compact and modern but not too barebones. Keep docs updated and maybe surface docs on the site itself. What are some other fun tool ideas?"

## Requirements

### Design

- **FR-001**: Colors MUST come from shared theme tokens in `app/globals.css`, and light and dark themes MUST follow the system setting.
- **FR-002**: The sidebar MUST show which page is active, group apps separately from site pages, and collapse behind a menu on narrow screens.
- **FR-003**: The home page MUST feature one app, list the others as cards, and show recent changes from the changelog.
- **FR-004**: Pages MUST NOT scroll sideways at phone width.

### Docs

- **FR-005**: `/docs` MUST list every page in the `lib/docs.ts` registry, and `/docs/<slug>` MUST render its Markdown file, with an unknown slug giving a 404.
- **FR-006**: Published pages MUST be the repo's own Markdown files, so there's one copy to keep updated.
- **FR-007**: Published pages MUST NOT contain relative Markdown links, because they wouldn't work on the site. A test enforces this.
- **FR-008**: Tool ideas MUST be published in `docs/ideas.md`.

## Assumptions

- Docs are read when the site builds, so publishing a change takes a new deploy.
- Rendered HTML is trusted because the Markdown only comes from this repo.

## Status

Implemented, and checked in headless Chrome at desktop and phone widths in both themes.
