"use client";

import { memo, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { CATEGORIES, EMOJI } from "@/lib/emoji-search/data";
import { buildIndex, type IndexedEmoji, searchEmoji } from "@/lib/emoji-search/search";

const INDEX = buildIndex(EMOJI);
const GRID = "grid grid-cols-[repeat(auto-fill,minmax(5.25rem,1fr))] gap-1.5";

const Tile = memo(function Tile({
  entry,
  onCopy,
}: Readonly<{ entry: IndexedEmoji; onCopy: (entry: IndexedEmoji) => void }>) {
  return (
    <button
      type="button"
      onClick={() => onCopy(entry)}
      title={entry.name}
      aria-label={`Copy ${entry.name}`}
      className="flex h-[5.25rem] min-w-0 flex-col items-center justify-start gap-1 rounded-lg border border-line bg-panel px-1 pt-2 transition-colors [contain-intrinsic-size:auto_5.25rem] [content-visibility:auto] hover:border-accent hover:bg-hover"
    >
      <span aria-hidden className="text-2xl leading-none">
        {entry.emoji}
      </span>
      <span className="line-clamp-2 w-full text-center text-[11px] leading-tight text-muted">{entry.name}</span>
    </button>
  );
});

function Pill({
  active,
  onClick,
  icon,
  label,
  count,
}: Readonly<{ active: boolean; onClick: () => void; icon?: string; label: string; count: number }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
        active ? "border-accent bg-accent-soft text-accent" : "border-line bg-panel text-ink hover:bg-hover"
      } ${count === 0 && !active ? "opacity-50" : ""}`}
    >
      {icon && <span aria-hidden>{icon}</span>}
      {label}
      <span className="font-normal text-muted tabular-nums">{count}</span>
    </button>
  );
}

export function EmojiSearch() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const statusTimer = useRef(0);

  // Typing stays instant because React can interrupt redrawing the results.
  const deferredQuery = useDeferredValue(query);
  const deferredCategory = useDeferredValue(category);
  const { emoji: matches, fuzzy } = useMemo(() => searchEmoji(INDEX, deferredQuery), [deferredQuery]);

  const counts = useMemo(() => {
    const totals = CATEGORIES.map(() => 0);
    for (const entry of matches) totals[entry.category]++;
    return totals;
  }, [matches]);

  const visible = useMemo(
    () => (deferredCategory === null ? matches : matches.filter((entry) => entry.category === deferredCategory)),
    [matches, deferredCategory]
  );

  const copy = useCallback(async (entry: IndexedEmoji) => {
    window.clearTimeout(statusTimer.current);
    try {
      await navigator.clipboard.writeText(entry.emoji);
      setStatus(`Copied ${entry.emoji} ${entry.name}`);
    } catch {
      setStatus(`Couldn't copy. Select this instead: ${entry.emoji}`);
    }
    statusTimer.current = window.setTimeout(() => setStatus(""), 2500);
  }, []);

  useEffect(() => {
    // Jump straight to the search box, except on touch screens where it opens the keyboard.
    if (window.matchMedia?.("(pointer: fine)").matches) input.current?.focus();

    function handleSlash(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(target.tagName)) {
        event.preventDefault();
        input.current?.focus();
      }
    }
    window.addEventListener("keydown", handleSlash);
    return () => {
      window.removeEventListener("keydown", handleSlash);
      window.clearTimeout(statusTimer.current);
    };
  }, []);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter" && visible[0]) void copy(visible[0]);
    if (event.key === "Escape") setQuery("");
  }

  const browsing = !deferredQuery.trim() && deferredCategory === null;

  return (
    <div className="flex flex-col gap-3">
      <div className="sticky top-12 z-[5] flex flex-col gap-2 bg-canvas py-1 md:top-0">
        <input
          ref={input}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search by name, feeling or thing"
          aria-label="Search emoji"
          autoComplete="off"
          spellCheck={false}
          className="w-full rounded-xl border border-line bg-panel px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-accent"
        />
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          <Pill active={category === null} onClick={() => setCategory(null)} label="All" count={matches.length} />
          {CATEGORIES.map((item, index) => (
            <Pill
              key={item.name}
              active={category === index}
              onClick={() => setCategory(category === index ? null : index)}
              icon={item.icon}
              label={item.name}
              count={counts[index]}
            />
          ))}
        </div>
        <p aria-live="polite" className="min-h-4 text-xs text-muted">
          {status ||
            (fuzzy && visible.length > 0
              ? "No exact matches, so here are close spellings."
              : `${visible.length.toLocaleString("en-US")} emoji. Click one to copy it, or press Enter for the first.`)}
        </p>
      </div>

      {visible.length === 0 && (
        <p className="py-8 text-center text-sm text-muted">
          {matches.length > 0
            ? "Nothing in this category. Try All."
            : `Nothing matches "${deferredQuery.trim()}". Try a simpler word.`}
        </p>
      )}

      {browsing ? (
        CATEGORIES.map((item, index) => (
          <section key={item.name}>
            <h2 className="mb-1.5 text-sm font-semibold text-ink">
              <span aria-hidden>{item.icon} </span>
              {item.name}
            </h2>
            <div className={GRID}>
              {visible
                .filter((entry) => entry.category === index)
                .map((entry) => (
                  <Tile key={entry.order} entry={entry} onCopy={copy} />
                ))}
            </div>
          </section>
        ))
      ) : (
        <div className={GRID}>
          {visible.map((entry) => (
            <Tile key={entry.order} entry={entry} onCopy={copy} />
          ))}
        </div>
      )}
    </div>
  );
}
