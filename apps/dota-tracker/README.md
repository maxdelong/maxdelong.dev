# Dota 2 Tracker

Track player stats and match data from the OpenDota API.

## Tech Stack

- Next.js + React + TypeScript
- Supabase (PostgreSQL)
- OpenDota API
- Vercel

## Features

### MVP
- [ ] Player search by name/Steam ID
- [ ] Display player stats (MMR, win rate, total matches)
- [ ] Show recent matches
- [ ] Display hero pool

### Phase 2
- [ ] Track multiple players (save in DB)
- [ ] Friend leaderboard
- [ ] MMR history tracking
- [ ] Notifications for MMR changes

### Phase 3
- [ ] Hero comparison
- [ ] Match analyzer
- [ ] Personalized recommendations

## Database Schema

```sql
CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  steam_id BIGINT UNIQUE NOT NULL,
  name VARCHAR(255),
  mmr INT,
  win_rate FLOAT,
  total_matches INT,
  last_updated TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE mmr_history (
  id SERIAL PRIMARY KEY,
  player_id INT REFERENCES players(id),
  mmr INT,
  recorded_at TIMESTAMP DEFAULT NOW()
);
```

## API Routes

- `GET /api/players/[id]` – Fetch player stats
- `GET /api/matches/[playerId]` – Recent matches
- `POST /api/friends` – Add tracked player
- `GET /api/friends` – Get tracked players

## Setup

See parent README at `../../README.md`

## Resources

- [OpenDota API](https://docs.opendota.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
