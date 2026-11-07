"use client";

import { useEffect, useRef, useState } from "react";
import {
  type Aim,
  dateKey,
  dayFor,
  flightFor,
  MAX_ANGLE,
  MAX_POWER,
  MIN_ANGLE,
  MIN_POWER,
  positionAt,
  shareText,
  verdictFor,
} from "@/lib/daily-fetch/game";

const STORAGE_PREFIX = "daily-fetch:";

// The yard is drawn from 10 m behind the thrower to 80 m in front, at about 9 pixels a meter.
const WIDTH = 800;
const HEIGHT = 320;
const GROUND_Y = 296;
const METERS_BEHIND = 10;
const PIXELS_PER_METER = WIDTH / 90;
const PLAYBACK_SPEED = 1.5;

const toX = (meters: number) => (meters + METERS_BEHIND) * PIXELS_PER_METER;
const toY = (meters: number) => GROUND_Y - meters * PIXELS_PER_METER;

function loadThrow(key: string): Aim | null {
  try {
    const saved = window.localStorage.getItem(STORAGE_PREFIX + key);
    return saved ? (JSON.parse(saved) as Aim) : null;
  } catch {
    return null;
  }
}

function saveThrow(key: string, aim: Aim) {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(aim));
  } catch {
    // Without storage, the throw just isn't remembered after a reload.
  }
}

function windLabel(wind: number): string {
  if (wind === 0) return "No wind";
  return `${wind > 0 ? "Tailwind →" : "← Headwind"} ${Math.abs(wind).toFixed(1)}`;
}

export function DailyFetch() {
  const [key] = useState(() => dateKey(new Date()));
  const [day] = useState(() => dayFor(key));
  const [thrown, setThrown] = useState(() => loadThrow(key));
  const [aim, setAim] = useState<Aim>({ angle: 45, power: 15 });
  const [time, setTime] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const flight = thrown ? flightFor(thrown, day) : null;
  const flying = time !== null;
  const ball = thrown ? positionAt(thrown, day, time ?? flight!.duration) : { x: 0, y: 0 };

  function handleThrow() {
    saveThrow(key, aim);
    setThrown(aim);
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const { duration } = flightFor(aim, day);
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = ((now - start) / 1000) * PLAYBACK_SPEED;
      if (elapsed >= duration) {
        setTime(null);
        return;
      }
      setTime(elapsed);
      frame.current = requestAnimationFrame(step);
    };
    setTime(0);
    frame.current = requestAnimationFrame(step);
  }

  async function handleCopy() {
    if (!flight) return;
    try {
      await navigator.clipboard.writeText(shareText(key, flight.miss));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section aria-label="Daily Fetch" className="rounded-xl border border-line bg-panel p-4">
      <p className="flex flex-wrap justify-between gap-2 text-[13px] text-muted">
        <span>{key}</span>
        <span>Dog at {day.dogDistance} m</span>
        <span>{windLabel(day.wind)}</span>
      </p>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={`A yard with the dog ${day.dogDistance} meters from you`}
        className="mt-2 w-full rounded-lg bg-canvas"
      >
        <line x1={0} x2={WIDTH} y1={GROUND_Y} y2={GROUND_Y} className="stroke-muted" strokeWidth={2} />
        <text x={toX(0)} y={GROUND_Y - 4} textAnchor="middle" fontSize={26}>
          🧍
        </text>
        <text x={toX(day.dogDistance)} y={GROUND_Y - 4} textAnchor="middle" fontSize={30}>
          🐕
        </text>
        {thrown && (
          <circle cx={toX(ball.x)} cy={toY(ball.y) - 5} r={6} className="fill-accent" />
        )}
      </svg>

      {!thrown && (
        <div className="mt-3 flex flex-col gap-3">
          <label className="flex items-center gap-3 text-[13px] text-ink">
            <span className="w-24">Angle: {aim.angle}°</span>
            <input
              type="range"
              min={MIN_ANGLE}
              max={MAX_ANGLE}
              value={aim.angle}
              onChange={(event) => setAim({ ...aim, angle: Number(event.target.value) })}
              className="min-w-0 flex-1 accent-accent"
            />
          </label>
          <label className="flex items-center gap-3 text-[13px] text-ink">
            <span className="w-24">Power: {aim.power}</span>
            <input
              type="range"
              min={MIN_POWER}
              max={MAX_POWER}
              value={aim.power}
              onChange={(event) => setAim({ ...aim, power: Number(event.target.value) })}
              className="min-w-0 flex-1 accent-accent"
            />
          </label>
          <div>
            <button
              type="button"
              onClick={handleThrow}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-on-accent transition-opacity hover:opacity-90"
            >
              Throw (you only get one)
            </button>
          </div>
        </div>
      )}

      <div aria-live="polite">
        {flight && !flying && (
          <div className="mt-3 flex flex-col gap-2">
            <p className="text-2xl font-semibold tracking-tight text-ink">
              {flight.miss.toFixed(1)} m from the dog
            </p>
            <p className="text-sm text-muted">{verdictFor(flight.miss)} Come back tomorrow for a new yard.</p>
            <div>
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-hover"
              >
                {copied ? "Copied" : "Copy your score"}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
