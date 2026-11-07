# About this site

A personal site for tools, games and experiments, built and maintained by one
person. The source is on
[GitHub](https://github.com/maxdelong/maxdelong.dev).

## How it's built

- Next.js, React and TypeScript, hosted on Vercel
- Tailwind for styling, with light and dark themes that follow your system
- No database yet. Supabase is the plan once something needs to save data.

Everything is one Next.js app. Each app keeps its code in its own folders:

| Folder | Holds |
| --- | --- |
| `app/<slug>/` | Routes |
| `components/<slug>/` | UI |
| `lib/<slug>/` | Logic, kept free of React where possible |
| `tests/` | Vitest tests |
| `docs/` | The pages in this docs section |
| `specs/` | Spec Kit feature specs |

To add an app, create its folders and add one entry to `lib/apps.ts`. The sidebar
and home page pick it up from there.

Each app lists its possible improvements in `lib/<slug>/todos.ts`, and that's the only
copy. Its entry in `lib/apps.ts` has to include the list, which then appears on the
app's page and on the central [to-do list](/docs/todos).

## Run it locally

You need Node 24. No environment variables are required.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Checks

CI runs these on `main` and on pull requests:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## How these docs work

These pages are the Markdown files in the repo, rendered when the site builds. To
add one, write the file and add an entry to `lib/docs.ts`.
