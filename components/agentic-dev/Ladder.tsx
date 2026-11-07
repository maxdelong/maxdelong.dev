"use client";

import { useState } from "react";
import { LEVELS } from "@/lib/agentic-dev/content";
import { Cite } from "./Cite";

export function Ladder() {
  const [selected, setSelected] = useState(3);
  const level = LEVELS[selected];

  return (
    <div className="grid gap-3 md:grid-cols-[15rem_1fr]">
      <ol className="flex flex-col gap-1">
        {LEVELS.map((item, index) => (
          <li key={item.name}>
            <button
              type="button"
              onClick={() => setSelected(index)}
              aria-pressed={selected === index}
              className={`flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-[13px] font-medium transition-colors ${
                selected === index
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line bg-panel text-ink hover:bg-hover"
              }`}
            >
              <span
                aria-hidden
                className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                  selected === index ? "bg-accent text-on-accent" : "bg-hover text-muted"
                }`}
              >
                {index + 1}
              </span>
              {item.name}
            </button>
          </li>
        ))}
      </ol>

      <div aria-live="polite" className="rounded-xl border border-line bg-panel p-4">
        <p className="text-xs text-muted">{level.when}</p>
        <h3 className="mt-0.5 text-lg font-semibold tracking-tight text-ink">{level.yourJob}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {level.summary}
          <Cite sources={level.sources} />
        </p>
        <p className="mt-3 rounded-lg bg-canvas px-3 py-2 text-[13px] text-ink">
          <span className="font-semibold">For example: </span>
          {level.example}
        </p>
      </div>
    </div>
  );
}
