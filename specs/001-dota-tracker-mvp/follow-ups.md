# Dota Tracker: follow-ups

Known problems found on 2026-11-04 by checking the code against the live
OpenDota API. Nothing here has been fixed yet.

## Broken today

1. **MMR never displays.** `lib/dota-tracker/opendota.ts` reads
   `mmr_estimate`, which OpenDota no longer returns, so every player shows
   "MMR unavailable" (FR-002). Use `computed_mmr` (sometimes null) and/or
   `rank_tier` (for example 80 is Immortal) instead, and update
   `research.md` and `contracts/opendota-client.md`.
2. **Name search can open the wrong player.** `app/dota-tracker/actions.ts`
   redirects to the first result. The API returns many exact matches: the
   form's own example, `Miracle-`, returned 50 results all scoring 1, and the
   pro's account (105248644) was not among them. Add a results page that
   lets the visitor choose.
3. **The result sort does nothing.** `searchPlayers` sorts by `similarity`,
   but the API field is now `sml`. Rename it. This doesn't solve item 2.

## Failures shown as the wrong message

4. **A failed search says "No player found".** `actions.ts` treats rate-limit
   and outage results the same as an empty result. `research.md` calls for a
   retry-suggesting message when rate limited.
5. **Failed sections look empty.** `app/dota-tracker/[accountId]/page.tsx`
   turns failed match and hero requests into "No recent matches" and
   "No hero history". Show an "unavailable" message instead.
6. **Bad IDs don't return 404.** `/dota-tracker/abc` and
   `/dota-tracker/999999999` return HTTP 200 and "Stats are unavailable".
   OpenDota answers 400 or an empty 200 for these rather than 404. Validate
   the ID and call `notFound()`.

## Reliability

7. **A failed `/heroes` call is cached.** `getHeroNameMap` stores the empty
   map, so names stay "Hero 1" until the server instance restarts. Only cache
   successful responses.
8. **Unexpected responses crash the page.** Responses are cast with `as T`
   and never checked; a 200 with a non-array body throws in
   `getPlayerMatches`, `getPlayerHeroPool` and `searchPlayers`. This cast is
   also why items 1 and 3 went unnoticed. Validate the fields actually used.
9. **Requests have no timeout.** Add `AbortSignal.timeout` to `fetchJson`.
10. **No `error.tsx`.** Add one so a thrown error keeps the sidebar visible
    (site-shell FR-008). This is expected Next.js behaviour; confirm it when
    fixing.
11. **Nothing is cached.** Each player view makes 4-5 OpenDota calls with
    `no-store`. Rate-limit headers suggest about 60 calls a minute and 3,000 a
    day. SC-004 allows data up to 24 hours old, so use `revalidate`.

## Tests

12. `tests/lib/dota-tracker/opendota.test.ts` only covers the status
    classifier. Add tests with recorded real API responses covering items 1,
    3, 7 and 8.

## Small improvements

- Show a loading state while searching (`useFormStatus`, `loading.tsx`).
- Give player pages their own title (`generateMetadata`).
- Accept pasted Steam profile URLs and `[U:1:...]` IDs, which are currently
  treated as names.
- Reject SteamID64 values below the offset, which produce negative account
  IDs.
- Show the hero in the recent matches list; `heroId` is fetched but unused.
- Dates use the server's locale and timezone.

## Possible later phase

Saving players and tracking MMR history would use a `players` and
`mmr_history` schema. An earlier draft is in git history at
`apps/dota-tracker/README.md`.
