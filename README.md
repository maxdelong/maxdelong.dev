# maxdelong.dev

Personal website with tools and experiments.

## Apps

- **Dota Tracker**: player stats, recent matches and hero pool from the OpenDota API.
  Known problems are listed in [follow-ups](./specs/001-dota-tracker-mvp/follow-ups.md).
- **Dog Tower Defense**: a small browser game. Place dogs to stop squirrels and frogs.
- **Spotify Tracker**: coming soon.

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
├── tests/              # Vitest tests
└── specs/              # Spec Kit feature specs
```

To add an app, create its folders and add one entry to `lib/apps.ts`.
