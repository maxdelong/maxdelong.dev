# maxdelong.dev

Personal website with tools and experiments. Built with Next.js, TypeScript, Supabase, hosted on Vercel.

## Features

- **Dota 2 Tracker**: Player stats and match analysis (see `apps/dota-tracker/README.md`)
- Blog (planned)
- Portfolio (planned)

## Tech Stack

- Next.js + React + TypeScript
- Supabase (PostgreSQL)
- Vercel hosting

## Setup

```bash
git clone https://github.com/maxdelong/maxdelong.dev.git
cd maxdelong.dev
npm install
```

Set `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

```bash
npm run dev  # Local: http://localhost:3000
npm run build && vercel deploy  # Deploy to Vercel
```

## Structure

```
├── app/                 # Main Next.js app
├── apps/
│   ├── dota-tracker/    # Dota 2 tracker
│   ├── blog/
│   └── portfolio/
├── lib/                 # Shared utilities
└── .env.local
```

See [Dota 2 Tracker README](./apps/dota-tracker/README.md) for details.
