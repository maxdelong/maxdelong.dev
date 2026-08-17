# Feature Specification: Dota Tracker MVP

**Feature Branch**: `001-dota-tracker-mvp`

**Created**: 2026-08-09

**Status**: Draft

**Input**: User description: "Dota 2 Tracker MVP — a player can search for a Dota 2 player by name or Steam ID and see their stats (MMR, win rate, total matches), recent matches, and hero pool. Based on the MVP checklist in apps/dota-tracker/README.md. Multi-player tracking/saving, leaderboards, and MMR history are explicitly out of scope for this MVP (they're Phase 2/3)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Look up a player's stats (Priority: P1)

A visitor wants to check a specific Dota 2 player's overall performance. They
enter that player's name or Steam ID and see their current MMR, win rate,
and total match count.

**Why this priority**: This is the core reason the tool exists — without it
there's no product. Every other story depends on a player having been found
first.

**Independent Test**: Can be fully tested by searching for a known public
player and confirming their MMR, win rate, and total matches are displayed
correctly. Delivers value on its own even with no other stories implemented.

**Acceptance Scenarios**:

1. **Given** the search page, **When** a visitor enters a valid player name
   or Steam ID and submits, **Then** the player's MMR, win rate, and total
   match count are displayed.
2. **Given** the search page, **When** a visitor enters a name/ID that
   doesn't match any player, **Then** a clear "player not found" message is
   shown instead of an error page or blank screen.
3. **Given** a found player, **When** their profile data is not public,
   **Then** the page explains that stats are unavailable rather than
   showing broken or empty fields.

---

### User Story 2 - View recent matches (Priority: P2)

Having found a player, a visitor wants to see that player's recent match
history to understand their current form.

**Why this priority**: Adds meaningful context beyond a single stat line,
but only matters once a player can already be found (Story 1).

**Independent Test**: Can be tested by searching for a known player with
match history and confirming a list of their recent matches renders with
per-match outcome (win/loss) and basic details.

**Acceptance Scenarios**:

1. **Given** a found player with match history, **When** their profile
   loads, **Then** a list of their most recent matches is shown, each
   indicating win or loss.
2. **Given** a found player with no recorded recent matches, **When** their
   profile loads, **Then** the recent matches section shows an empty state
   rather than an error.

---

### User Story 3 - View hero pool (Priority: P3)

Having found a player, a visitor wants to see which heroes that player
plays most and how well they perform on them.

**Why this priority**: Useful supporting detail for understanding a
player's style, but least critical to the tool's core value.

**Independent Test**: Can be tested by searching for a known player and
confirming their most-played heroes are listed with basic performance
info (e.g., games played, win rate on that hero).

**Acceptance Scenarios**:

1. **Given** a found player, **When** their profile loads, **Then** their
   most-played heroes are listed with games played and win rate per hero.
2. **Given** a found player with a very limited match history, **When**
   their profile loads, **Then** the hero pool section shows whatever data
   exists without erroring.

---

### Edge Cases

- What happens when the search query is empty or malformed (e.g., not a
  valid Steam ID format and not a plausible name)?
- How does the system handle the underlying player-data source being slow
  or temporarily unavailable?
- What happens when a player exists but has zero recorded matches (new
  account)?
- How does the system handle rate limits from the external data source
  during a traffic spike?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Users MUST be able to search for a Dota 2 player by player
  name or Steam ID.
- **FR-002**: System MUST display, for a found player: current MMR, win
  rate, and total match count.
- **FR-003**: System MUST display a list of the player's recent matches,
  each showing at least the outcome (win/loss).
- **FR-004**: System MUST display the player's hero pool: most-played
  heroes with games played and win rate per hero.
- **FR-005**: System MUST show a clear "not found" message when a search
  does not match any player, rather than an error page or silent failure.
- **FR-006**: System MUST show a clear "stats unavailable" message when a
  found player's data cannot be retrieved (e.g., private profile), rather
  than displaying broken or empty fields.
- **FR-007**: System MUST NOT require the visitor to create an account or
  log in to search for and view a player's stats.
- **FR-008**: System MUST NOT persist searched players between sessions in
  this MVP (saving/tracking multiple players is out of scope — see
  Assumptions).

### Key Entities

- **Player**: A Dota 2 player identified by Steam ID and display name;
  carries current MMR, win rate, and total match count.
- **Match**: A single recent match belonging to a player; carries at least
  a win/loss outcome and enough detail to distinguish it from other
  matches (e.g., when it was played).
- **Hero Pool Entry**: A hero a given player has played; carries games
  played and win rate for that player on that hero.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can go from landing on the search page to seeing a
  found player's MMR, win rate, and total matches in under 10 seconds.
- **SC-002**: 100% of searches resolve to either a populated player view or
  a clear not-found/unavailable message — no dead ends or unhandled error
  states.
- **SC-003**: A visitor can see a player's stats, recent matches, and hero
  pool without navigating away from that player's page.
- **SC-004**: Displayed stats reflect the player's real-world data as of no
  more than 24 hours prior, for players whose data source updates at least
  daily.

## Assumptions

- No persistence in this MVP: every search is a fresh lookup. Saving and
  tracking multiple players is explicitly Phase 2 per the sub-app roadmap
  and is out of scope here.
- Player stats (MMR, win rate, matches, heroes) are sourced from an
  existing third-party Dota 2 statistics provider; this feature depends on
  that provider being available and its data being reasonably accurate.
- Only players with public profiles are supported in the MVP; there is no
  private-profile opt-in or authorization flow.
- The search flow is unauthenticated — no visitor account or login is
  required.
