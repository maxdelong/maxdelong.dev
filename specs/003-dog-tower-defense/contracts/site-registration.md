# Contract: Site Registration

This feature's only touchpoint with the rest of the site is the shared app
registry defined by `002-site-shell` (see that feature's
`contracts/app-registry.md`). Everything else in this feature is
self-contained under `app/dog-tower-defense/`, `components/dog-tower-defense/`,
and `lib/dog-tower-defense/`.

## What this feature adds to `lib/apps.ts`

```typescript
{
  slug: "dog-tower-defense",
  name: "Dog Tower Defense",
  status: "available",
  description: "Defend the yard from squirrels and frogs.",
}
```

This is the one line added to the shared registry array — no other
existing entry (`dota-tracker`, `spotify-tracker`) is touched, and no other
app's files are edited, per the site shell's App Isolation guarantee.

## Guarantee this feature provides back to the shell

- `app/dog-tower-defense/page.tsx` exists and renders a complete, working
  page — unlike the `coming-soon` entries, the sidebar link for this app
  is safe to treat as always-working once this feature ships (per the
  site shell's contract: `"available"` entries are never re-verified by
  the sidebar).
