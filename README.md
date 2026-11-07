# maxdelong.dev

Personal website with tools and experiments.

## Apps

- **Dota Tracker**: player stats, recent matches and hero pool from the OpenDota API.
  Known problems are listed in [follow-ups](./specs/001-dota-tracker-mvp/follow-ups.md).
- **Dog Tower Defense**: a browser game with seven upgradeable breeds and twenty
  rounds. See the [field guide](./docs/dog-tower-defense.md).
- **Daily Fetch**: one throw a day, with the same dog and wind for everyone.
- **Hero Roulette**: spins a random Dota 2 hero and a loose game plan, and punishes
  rerolls.
- **Lunch Roulette**: spins your own list of lunch places, and punishes vetoes.
- **True Cost of a Car**: compares two cars by what they really cost.
- **Work Backward**: works out when to start each step to arrive on time.
- **Emoji Search**: finds any emoji by name, keyword or category, and copies it.
- **Agentic Dev**: a sourced guide to loops, harnesses and recommended tools.
- **Spotify Tracker**: coming soon.
- **Docs**: the Markdown files listed in `lib/docs.ts`, published at `/docs`, plus a
  to-do list built from every app's `lib/<slug>/todos.ts`.

## Tech stack

- Next.js + React + TypeScript
- Vercel hosting
- Supabase (PostgreSQL) when a feature needs persistence; nothing uses it yet

## Setup

Requires Node 24. No environment variables are needed.

```bash
git clone https://github.com/maxdelong/maxdelong.dev.git
cd maxdelong.dev
npm install
npm run dev  # http://localhost:3000
```

## Checks

CI runs these on `main` and on pull requests:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Structure

The site is one Next.js app. Each app has its own folder in each of these:

```
├── app/<slug>/         # Routes
├── components/<slug>/  # UI
├── lib/<slug>/         # Logic
├── lib/apps.ts         # App registry that feeds the sidebar
├── lib/docs.ts         # Which Markdown files are published at /docs
├── docs/               # Field guide, changelog, ideas and more
├── tests/              # Vitest tests
└── specs/              # Spec Kit feature specs
```

To add an app, create its folders, list possible improvements in
`lib/<slug>/todos.ts`, and add one entry to `lib/apps.ts`. To publish a doc, add its file to `lib/docs.ts`. Colors come from the theme tokens in
`app/globals.css`.

See [tool ideas](./docs/ideas.md) for what might come next, and
[the backlog](./BACKLOG.md) for maintenance still to do.
