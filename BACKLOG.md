# Backlog

Site-wide work to do later. Improvements to a specific app live with its code in
`lib/<slug>/todos.ts`, and are gathered on the [to-do list](/docs/todos).

## Site and deployment

- **Set up the production URL.** `maxdelong.dev` doesn't resolve,
  `maxdelong-dev.vercel.app` returns 404, and per-deployment URLs redirect to a
  Vercel login. Check the project's domains and Deployment Protection settings
  in Vercel, and check that the domain is registered.
- **Require CI before merging to `main`.** Add a branch protection rule that
  requires the `check` job, so a PR with failing checks can't be merged. Allow
  a bypass if direct pushes to `main` should keep working.

## Dependencies

- **Bump TypeScript to 7** once `typescript-eslint` supports it (it currently
  requires below 6.1). Dependabot is set to skip this major bump, so it has to
  be done by hand.
- **Bump `@types/node`** when the Node version in `package.json` changes.
  Dependabot skips its major bumps too.
