"use client";

import { useState } from "react";
import { judgeLoop, LOOP_ITEMS } from "@/lib/agentic-dev/loopCheck";

export function LoopCheck() {
  const [checked, setChecked] = useState<ReadonlySet<string>>(new Set());
  const verdict = judgeLoop(checked);

  function toggle(id: string) {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setChecked(next);
  }

  return (
    <div className="grid gap-3 md:grid-cols-[1fr_17rem]">
      <fieldset className="rounded-xl border border-line bg-panel p-3">
        <legend className="sr-only">What your loop has</legend>
        <div className="flex flex-col gap-0.5">
          {LOOP_ITEMS.map((item) => (
            <label
              key={item.id}
              className="flex cursor-pointer items-center gap-2.5 rounded-md px-1.5 py-1.5 text-[13px] text-ink hover:bg-hover"
            >
              <input
                type="checkbox"
                checked={checked.has(item.id)}
                onChange={() => toggle(item.id)}
                className="size-4 shrink-0 accent-accent"
              />
              <span className="min-w-0 flex-1">{item.label}</span>
              {item.essential && (
                <span className="rounded bg-accent-soft px-1.5 py-px text-[10px] font-medium text-accent">
                  Essential
                </span>
              )}
            </label>
          ))}
        </div>
      </fieldset>

      <div aria-live="polite" className="rounded-xl border border-line bg-panel p-4">
        <p className="text-xs text-muted tabular-nums">
          {verdict.score} of {LOOP_ITEMS.length}
        </p>
        <div aria-hidden className="mt-1 h-1.5 overflow-hidden rounded-full bg-hover">
          <div
            className="h-full rounded-full bg-accent transition-[width]"
            style={{ width: `${(verdict.score / LOOP_ITEMS.length) * 100}%` }}
          />
        </div>
        <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink">{verdict.title}</h3>
        <p className="mt-1 text-[13px] text-muted">{verdict.advice}</p>
        {verdict.score > 0 && verdict.missing.length > 0 && (
          <ul className="mt-2 flex list-inside list-disc flex-col gap-0.5 text-[13px] text-ink">
            {verdict.missing.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
