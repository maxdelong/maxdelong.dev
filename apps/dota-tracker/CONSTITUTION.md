# Dota 2 Tracker Constitution

## Core Principles

### I. API-Driven Architecture
All player data flows through OpenDota API. Local cache (Supabase) is supplementary—never the source of truth. API calls are prioritized for accuracy; caching is used for performance optimization only.

### II. Type Safety First
TypeScript is mandatory. All API responses must be typed. No `any` types except in integration boundaries. Type safety extends to database queries via ORM or query builders.

### III. User-Centric Features
Every feature must solve a real user problem: finding player stats, analyzing performance trends, or comparing heroes. Experimental features are isolated in feature flags.

### IV. Data Freshness
Real-time stat accuracy matters. MMR history is tracked; matches are fetched within 1 hour of completion. Stale data triggers a visual indicator (e.g., "Last updated 2 hours ago").

### V. Test Coverage on Critical Paths
API integration tests required for player lookup and stats retrieval. UI tests for search and stat display. Database schema migrations must have rollback tests.

## Technology Stack

- **Frontend**: Next.js 14+, React 18+, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Node.js
- **Database**: Supabase (PostgreSQL)
- **External API**: OpenDota API (public, no auth required)
- **Hosting**: Vercel (frontend + backend)
- **Testing**: Jest (unit), React Testing Library (components)

## Development Workflow

1. **Feature Creation**: Branch naming `feature/player-compare` or `fix/mmr-display`
2. **Type First**: Define TypeScript types before implementation
3. **API Integration**: Create typed API client first, then UI components
4. **Testing**: Write tests for data fetching, display logic, and edge cases
5. **Review**: Code review by project maintainer before merge
6. **Deployment**: Auto-deploy to Vercel on main branch merge

## Code Standards

- **Naming**: Camel case for variables/functions, PascalCase for components and types
- **Folder Structure**: `/app` (pages), `/components` (UI), `/lib` (utilities), `/api` (routes), `/types` (TypeScript definitions)
- **Error Handling**: Try-catch with specific error messages; user-facing errors are user-friendly
- **Logging**: Console logging for development; structured logging for production issues
- **Comments**: Only for "why" decisions, not "what" the code does

## Database Standards

- **Naming**: Snake case for columns (e.g., `steam_id`, `mmr_history`)
- **IDs**: UUIDs for primary keys where appropriate; serial for simple cases
- **Timestamps**: Always include `created_at` and `updated_at` with timezone awareness
- **Constraints**: Foreign keys for all relationships; indexes on frequently queried columns (steam_id, player_id)
- **Migrations**: Use Supabase migrations; version control all schema changes

## API Integration Guidelines

- **Rate Limiting**: Respect OpenDota rate limits; implement backoff strategy
- **Error Handling**: Differentiate between rate limit (retry), not found (user-friendly), and server errors (log and alert)
- **Caching**: Cache player stats for 5 minutes; recent matches for 1 minute
- **Fallback**: Display cached data if API is unavailable; clearly indicate stale data to user

## Quality Gates

- All PRs require passing tests
- TypeScript compilation must succeed (no errors)
- Code review approval before merge
- Vercel preview deployment must succeed

## Governance

This constitution is the source of truth for dota-tracker development. All code changes must comply. Amendments require documented justification and team approval.

**Version**: 1.0.0 | **Ratified**: 2026-07-03 | **Last Amended**: 2026-07-03
