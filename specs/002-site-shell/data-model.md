# Data Model: Site Shell & Landing Page

No database or persistence is involved (see spec Assumptions). The only
data shape is the in-code app registry.

## AppEntry

Represents one tool/sub-app on the site (spec Key Entities: "App (registry
entry)").

| Field | Type | Notes |
|-------|------|-------|
| `slug` | `string` | URL path segment, e.g. `"dota-tracker"`. Must match the route folder name under `app/`. Unique across the registry. |
| `name` | `string` | Display name shown in the sidebar, e.g. `"Dota Tracker"`. |
| `status` | `"available" \| "coming-soon"` | Drives FR-009: `available` entries render as links; `coming-soon` entries render disabled and unclickable. |
| `description` | `string` (optional) | Short one-line description, for the homepage or a sidebar tooltip. Not required by any FR; included for a friendlier homepage. |

## Validation rules

- `slug` values are unique within the registry (enforced by code review /
  a registry unit test, not a runtime check — this is a static, developer-
  maintained list, not user input).
- `slug` must be a valid URL path segment (lowercase, hyphen-separated) so
  it maps 1:1 to its route folder.

## State transitions

An entry moves from `coming-soon` to `available` exactly once, when that
app's own feature is actually built (e.g., when `001-dota-tracker-mvp` is
implemented, `dota-tracker`'s status flips to `available`). This is a
manual code edit, not a runtime state machine.

## Initial registry contents (this build pass)

| slug | name | status |
|------|------|--------|
| `dota-tracker` | Dota Tracker | `coming-soon` |
| `spotify-tracker` | Spotify Tracker | `coming-soon` |
