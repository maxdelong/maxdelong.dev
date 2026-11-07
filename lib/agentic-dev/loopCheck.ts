export interface LoopItem {
  id: string;
  label: string;
  /** Without this, a loop shouldn't run unattended, however good the rest is. */
  essential: boolean;
}

export const LOOP_ITEMS: LoopItem[] = [
  { id: "goal", label: "A machine can check when it's done", essential: true },
  { id: "brakes", label: "Iteration limit and a spending cap", essential: true },
  { id: "sandbox", label: "Sandboxed, with no lethal trifecta", essential: true },
  { id: "review", label: "A person reviews before anything ships", essential: true },
  { id: "trigger", label: "It starts by itself, on a schedule or an event", essential: false },
  { id: "sensors", label: "Tests, types and linters run on every pass", essential: false },
  { id: "checker", label: "A separate agent judges the work", essential: false },
  { id: "state", label: "Progress is saved in the repo", essential: false },
  { id: "isolation", label: "It works in its own branch or worktree", essential: false },
];

export interface LoopVerdict {
  title: string;
  advice: string;
  /** Essentials still missing, most important first. */
  missing: string[];
  score: number;
}

export function judgeLoop(checked: ReadonlySet<string>): LoopVerdict {
  const score = LOOP_ITEMS.filter((item) => checked.has(item.id)).length;
  const missing = LOOP_ITEMS.filter((item) => item.essential && !checked.has(item.id)).map(
    (item) => item.label
  );

  if (score === 0) {
    return {
      title: "That's not a loop yet",
      advice: "Tick what your setup already has to see how close it is.",
      missing,
      score,
    };
  }
  if (missing.length > 0) {
    return {
      title: "Don't leave this running alone",
      advice: "Stay at the keyboard until the essentials below are in place.",
      missing,
      score,
    };
  }
  if (score < LOOP_ITEMS.length) {
    return {
      title: "Safe to try on a small job",
      advice: "The essentials are covered. Add the rest as the job gets bigger.",
      missing,
      score,
    };
  }
  return {
    title: "Ready to run",
    advice: "Now measure whether it actually saves you time. Nobody has proven that for you yet.",
    missing,
    score,
  };
}
