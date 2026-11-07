"use client";

import { type FormEvent, useState } from "react";
import {
  addPlace,
  canVeto,
  MAX_VETOES,
  penaltiesFor,
  pickPlace,
  STARTER_PLACES,
} from "@/lib/lunch-roulette/roulette";

const STORAGE_KEY = "lunch-roulette:places";

const PRIMARY =
  "rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-on-accent transition-opacity hover:opacity-90 disabled:opacity-50";
const SECONDARY =
  "rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-hover disabled:opacity-50";

function loadPlaces(): string[] {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
    return Array.isArray(saved) ? saved.filter((place) => typeof place === "string") : STARTER_PLACES;
  } catch {
    return STARTER_PLACES;
  }
}

function savePlaces(places: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
  } catch {
    // Without storage, the list just resets on the next visit.
  }
}

export function LunchRoulette() {
  const [places, setPlaces] = useState(loadPlaces);
  const [draft, setDraft] = useState("");
  const [pick, setPick] = useState<string | null>(null);
  const [vetoes, setVetoes] = useState(0);
  const [locked, setLocked] = useState(false);

  function updatePlaces(next: string[]) {
    setPlaces(next);
    savePlaces(next);
  }

  function handleAdd(event: FormEvent) {
    event.preventDefault();
    updatePlaces(addPlace(places, draft));
    setDraft("");
  }

  function handleRemove(place: string) {
    updatePlaces(places.filter((other) => other !== place));
    if (pick === place) {
      setPick(null);
      setLocked(false);
    }
  }

  function spin() {
    setVetoes(0);
    setLocked(false);
    setPick(pickPlace(places));
  }

  function veto() {
    if (!pick || !canVeto(vetoes, places.length)) return;
    setVetoes(vetoes + 1);
    setPick(pickPlace(places, Math.random, pick));
  }

  const penalties = penaltiesFor(vetoes);
  const vetoAllowed = canVeto(vetoes, places.length);

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_16rem]">
      <section aria-label="Lunch Roulette" className="rounded-xl border border-line bg-panel p-4">
        <div aria-live="polite">
          {pick ? (
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-[13px] text-muted">{locked ? "It's decided" : "The wheel says"}</p>
                <h2 className="text-3xl font-semibold tracking-tight break-words text-ink">{pick}</h2>
              </div>
              {penalties.length > 0 && (
                <div>
                  <h3 className="text-[13px] font-semibold text-ink">
                    What you owe for vetoing {vetoes} times
                  </h3>
                  <ul className="mt-1 flex list-inside list-disc flex-col gap-0.5 text-[13px] text-muted">
                    {penalties.map((penalty) => (
                      <li key={penalty}>{penalty}</li>
                    ))}
                  </ul>
                </div>
              )}
              {!locked && vetoes >= MAX_VETOES && (
                <p className="text-[13px] text-muted">That&apos;s all your vetoes. Go eat.</p>
              )}
              {locked && <p className="text-sm font-semibold text-accent">Enjoy your lunch.</p>}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted">
              {places.length > 0
                ? "Can't decide? Spin. Your first veto is free."
                : "Add at least one place to spin."}
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(!pick || locked) && (
            <button type="button" className={PRIMARY} onClick={spin} disabled={places.length === 0}>
              {locked ? "Spin again" : "Spin"}
            </button>
          )}
          {pick && !locked && (
            <>
              <button type="button" className={PRIMARY} onClick={() => setLocked(true)}>
                Lock it in
              </button>
              <button type="button" className={SECONDARY} onClick={veto} disabled={!vetoAllowed}>
                {!vetoAllowed ? "No vetoes left" : vetoes === 0 ? "Veto (free)" : "Veto (costs you)"}
              </button>
            </>
          )}
        </div>
      </section>

      <section aria-label="Your places" className="rounded-xl border border-line bg-panel p-4">
        <h2 className="text-sm font-semibold text-ink">Your places</h2>
        <form onSubmit={handleAdd} className="mt-2 flex gap-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={60}
            placeholder="Add a place"
            aria-label="Add a place"
            className="min-w-0 flex-1 rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-[13px] text-ink"
          />
          <button type="submit" className="rounded-lg border border-line px-2.5 text-[13px] font-medium text-ink hover:bg-hover">
            Add
          </button>
        </form>
        <ul className="mt-2 flex flex-col gap-0.5">
          {places.map((place) => (
            <li key={place} className="flex items-center justify-between gap-2 text-[13px] text-ink">
              <span className="min-w-0 break-words">{place}</span>
              <button
                type="button"
                onClick={() => handleRemove(place)}
                aria-label={`Remove ${place}`}
                className="rounded px-1.5 text-muted hover:bg-hover hover:text-ink"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
