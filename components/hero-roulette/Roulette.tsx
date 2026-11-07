"use client";

import { useEffect, useRef, useState } from "react";
import { HEROES } from "@/lib/hero-roulette/heroes";
import { canReroll, MAX_REROLLS, penaltiesFor, spin } from "@/lib/hero-roulette/roulette";
import type { Attribute, Spin } from "@/lib/hero-roulette/types";

const SPIN_MS = 900;
const FLICKER_MS = 70;

const ATTRIBUTE_ICONS: Record<Attribute, string> = {
  strength: "💪",
  agility: "🏹",
  intelligence: "🧠",
  universal: "🌀",
};

const PRIMARY =
  "rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-on-accent transition-opacity hover:opacity-90 disabled:opacity-50";
const SECONDARY =
  "rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-hover disabled:opacity-50";

function randomHeroName(): string {
  return HEROES[Math.floor(Math.random() * HEROES.length)].name;
}

function rerollLabel(rerolls: number): string {
  if (!canReroll(rerolls)) return "No rerolls left";
  return rerolls === 0 ? "Reroll (free)" : "Reroll (costs you)";
}

export function Roulette() {
  const [result, setResult] = useState<Spin | null>(null);
  const [flicker, setFlicker] = useState<string | null>(null);
  const [rerolls, setRerolls] = useState(0);
  const [locked, setLocked] = useState(false);
  const timers = useRef<{ flicker?: number; stop?: number }>({});

  useEffect(() => {
    const active = timers.current;
    return () => {
      window.clearInterval(active.flicker);
      window.clearTimeout(active.stop);
    };
  }, []);

  function roll(previousHero?: string) {
    const next = spin(Math.random, previousHero);
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setResult(next);
      return;
    }
    setResult(null);
    setFlicker(randomHeroName());
    timers.current.flicker = window.setInterval(() => setFlicker(randomHeroName()), FLICKER_MS);
    timers.current.stop = window.setTimeout(() => {
      window.clearInterval(timers.current.flicker);
      setFlicker(null);
      setResult(next);
    }, SPIN_MS);
  }

  function startOver() {
    setRerolls(0);
    setLocked(false);
    roll();
  }

  function reroll() {
    if (!result || !canReroll(rerolls)) return;
    setRerolls(rerolls + 1);
    roll(result.hero.name);
  }

  const spinning = flicker !== null;
  const penalties = penaltiesFor(rerolls);

  return (
    <section aria-label="Hero Roulette" className="rounded-xl border border-line bg-panel p-4">
      {spinning && (
        <p aria-hidden className="py-8 text-center text-3xl font-semibold tracking-tight text-muted">
          {flicker}
        </p>
      )}

      {!spinning && !result && (
        <p className="py-8 text-center text-sm text-muted">
          One spin, one hero, one plan. You can reroll, but it will cost you.
        </p>
      )}

      <div aria-live="polite">
        {!spinning && result && (
          <div className="flex flex-col gap-3">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-ink">{result.hero.name}</h2>
              <p className="mt-1 text-[13px] text-muted">
                <span aria-hidden>{ATTRIBUTE_ICONS[result.hero.attribute]} </span>
                <span className="capitalize">{result.hero.attribute}</span> · {" "}
                <span className="capitalize">{result.hero.attack}</span> · Legs: {result.hero.legs}
              </p>
            </div>

            <div className="rounded-lg bg-canvas p-3">
              <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink">
                {result.build.name}
                {result.cursed && (
                  <span className="rounded bg-accent-soft px-1.5 py-px text-[11px] font-medium text-accent">
                    Cursed build
                  </span>
                )}
                <span className="rounded bg-hover px-1.5 py-px text-[11px] font-medium text-muted">
                  {result.lane}
                </span>
              </p>
              <p className="mt-1 text-[13px] text-muted">{result.build.plan}</p>
            </div>

            <p className="text-[13px] text-ink">
              <span className="font-semibold">House rule: </span>
              {result.twist}
            </p>

            {penalties.length > 0 && (
              <div>
                <h3 className="text-[13px] font-semibold text-ink">
                  What you owe for rerolling {rerolls} times
                </h3>
                <ul className="mt-1 flex list-inside list-disc flex-col gap-0.5 text-[13px] text-muted">
                  {penalties.map((penalty) => (
                    <li key={penalty}>{penalty}</li>
                  ))}
                </ul>
              </div>
            )}

            {locked && (
              <p className="text-sm font-semibold text-accent">Locked in. No backing out now.</p>
            )}
            {!locked && !canReroll(rerolls) && (
              <p className="text-[13px] text-muted">
                That&apos;s {MAX_REROLLS} rerolls. The wheel has stopped taking your calls.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(!result || locked) && (
          <button type="button" className={PRIMARY} onClick={startOver} disabled={spinning}>
            {locked ? "Spin again" : "Spin"}
          </button>
        )}
        {result && !locked && (
          <>
            <button type="button" className={PRIMARY} onClick={() => setLocked(true)} disabled={spinning}>
              Lock it in
            </button>
            <button type="button" className={SECONDARY} onClick={reroll} disabled={spinning || !canReroll(rerolls)}>
              {rerollLabel(rerolls)}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
