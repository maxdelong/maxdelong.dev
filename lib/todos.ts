/**
 * A possible improvement to an app. Each app lists its own in `lib/<slug>/todos.ts`
 * and passes them to its entry in `lib/apps.ts`. The app's page and the central
 * /docs/todos page both read from there, so there's only one copy to keep current.
 */
export interface TodoCard {
  title: string;
  summary: string;
  /** Rough effort: S is an evening, M is a weekend, L needs a backend or a login. */
  size: "S" | "M" | "L";
}
