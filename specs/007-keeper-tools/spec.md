# Feature Specification: Keeper Tools

**Feature Branch**: `007-keeper-tools`

**Created**: 2026-11-06

**Status**: Implemented

**Input**: User description: "Create all the keeps, simple as can be first, with a to-do list for potential improvements. Keep to-dos with each code module, but make sure docs stay current in the central page in the best pattern you can."

## Requirements

### Daily Fetch

- **FR-001**: Each calendar date MUST give every visitor the same dog distance and wind.
- **FR-002**: A visitor MUST get one throw per day, remembered in their browser, and MUST be able to copy their score. Clearing browser storage allows another throw, which is accepted for now.
- **FR-003**: A catch within 1 m MUST be possible on every day.

### Lunch Roulette

- **FR-004**: Visitors MUST be able to spin their own list of places, which is saved in their browser.
- **FR-005**: The first veto MUST be free. Later vetoes MUST add a penalty, and vetoes MUST end when the penalties run out.

### Work Backward

- **FR-006**: From an arrival time and ordered steps with durations, the tool MUST show when each step starts, including steps that start on an earlier day.

### True Cost of a Car

- **FR-007**: The tool MUST compare two cars by total, monthly and per-mile cost.
- **FR-008**: The total MUST be value lost, loan interest paid during ownership, gas, insurance and upkeep. Loan payments MUST NOT be added on top, because that counts the price twice.

### Emoji Search

- **FR-011**: Visitors MUST be able to browse emoji by category and copy one with a click.
- **FR-012**: Search MUST match names and keywords, require every typed word, rank the best match first, accept shortcodes and pasted emoji, and fall back to close spellings only when nothing else matches.
- **FR-013**: Search MUST run in the browser with no network requests, and typing MUST stay responsive.

### To-do lists

- **FR-009**: Each available app MUST keep its possible improvements in `lib/<slug>/todos.ts`, and show them as cards on its page.
- **FR-010**: Each app's entry in `lib/apps.ts` MUST require its to-do list, and `/docs/todos` MUST be built from those entries, so there's only one copy to update.

## Assumptions

- None of these tools need a backend, an account or an API key.
- True Cost of a Car uses made-up starting numbers, and gives an estimate rather than financial advice.
- Everything else these tools could do is on their to-do lists.

## Status

Implemented.
