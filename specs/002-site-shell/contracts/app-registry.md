# Contract: App Registry

This is the internal contract between the site shell (sidebar, layout) and
anyone adding a new app to the site (FR-006). It's not a network API — it's
the one file a future app author edits, and the one shape every consumer
(the sidebar, the route tree) agrees on.

## Interface

```typescript
// lib/apps.ts

export type AppStatus = "available" | "coming-soon";

export interface AppEntry {
  slug: string;          // URL path segment; must match the app/<slug>/ route folder
  name: string;           // Display name shown in the sidebar
  status: AppStatus;      // "available" -> clickable link; "coming-soon" -> disabled, unclickable
  description?: string;   // Optional one-line description
}

export const apps: AppEntry[] = [
  // ...registry entries
];
```

## Adding a new app (the contract a future author follows)

1. Add one `AppEntry` object to the `apps` array in `lib/apps.ts`.
2. Create `app/<slug>/page.tsx` (a "coming soon" placeholder is fine to
   start with `status: "coming-soon"`).
3. Do not edit any other app's route folder or the registry entries for
   other apps.

The sidebar and homepage read `apps` and require no other changes — this
is what satisfies FR-006 and SC-003.

## Guarantees consumers can rely on

- Every entry in `apps` has a route folder at `app/<slug>/`.
- `status: "coming-soon"` entries are never rendered as a clickable link
  by the sidebar (FR-009), and their route renders the shared "coming
  soon" placeholder rather than a broken or missing page.
- `status: "available"` entries are always safe to link to — the sidebar
  does not re-verify that the route works.
