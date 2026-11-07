"use client";

import { useState } from "react";
import { TOOL_CHOICES, TOOLS } from "@/lib/agentic-dev/content";
import { Cite } from "./Cite";

export function ToolPicker() {
  const [selected, setSelected] = useState(0);
  const choice = TOOL_CHOICES[selected];
  const tool = TOOLS.find((item) => item.name === choice.pick);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {TOOL_CHOICES.map((item, index) => (
          <button
            key={item.need}
            type="button"
            onClick={() => setSelected(index)}
            aria-pressed={selected === index}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              selected === index
                ? "border-accent bg-accent-soft text-accent"
                : "border-line bg-panel text-ink hover:bg-hover"
            }`}
          >
            {item.need}
          </button>
        ))}
      </div>

      <div aria-live="polite" className="rounded-xl border border-accent bg-panel p-4">
        <p className="text-xs text-muted">Start with</p>
        <p className="text-2xl font-semibold tracking-tight text-ink">{choice.pick}</p>
        <p className="mt-1 text-sm text-muted">
          {choice.why}
          {tool && <Cite sources={tool.sources} />}
        </p>
        {tool && (
          <p className="mt-2 text-[13px] text-ink">
            <span className="font-semibold">For loops: </span>
            {tool.loops}
          </p>
        )}
      </div>
    </div>
  );
}
