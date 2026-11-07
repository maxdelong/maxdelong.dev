"use client";

import { useState } from "react";
import { dayLabel, formatClock, parseClock, planBackward } from "@/lib/work-backward/plan";

interface StepDraft {
  id: number;
  name: string;
  minutes: string;
}

const STARTER_STEPS: StepDraft[] = [
  { id: 1, name: "Get ready", minutes: "30" },
  { id: 2, name: "Drive", minutes: "25" },
  { id: 3, name: "Park and walk in", minutes: "10" },
];

const INPUT = "rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-[13px] text-ink";

export function WorkBackward() {
  const [arrival, setArrival] = useState("09:00");
  const [steps, setSteps] = useState(STARTER_STEPS);
  const [nextId, setNextId] = useState(STARTER_STEPS.length + 1);

  function updateStep(id: number, change: Partial<StepDraft>) {
    setSteps(steps.map((step) => (step.id === id ? { ...step, ...change } : step)));
  }

  function addStep() {
    setSteps([...steps, { id: nextId, name: "", minutes: "10" }]);
    setNextId(nextId + 1);
  }

  const arrivalMinutes = parseClock(arrival);
  const plan =
    arrivalMinutes === null
      ? null
      : planBackward(
          arrivalMinutes,
          steps.map((step) => ({
            name: step.name.trim() || "Unnamed step",
            minutes: Math.max(0, Number(step.minutes) || 0),
          }))
        );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section aria-label="Your plan" className="rounded-xl border border-line bg-panel p-4">
        <label className="flex items-center justify-between gap-3 text-sm font-semibold text-ink">
          Be there at
          <input
            type="time"
            value={arrival}
            onChange={(event) => setArrival(event.target.value)}
            className={INPUT}
          />
        </label>

        <h2 className="mt-4 text-sm font-semibold text-ink">What comes first, in order</h2>
        <ul className="mt-2 flex flex-col gap-2">
          {steps.map((step, index) => (
            <li key={step.id} className="flex items-center gap-2">
              <input
                value={step.name}
                onChange={(event) => updateStep(step.id, { name: event.target.value })}
                placeholder="Step name"
                aria-label={`Step ${index + 1} name`}
                className={`${INPUT} min-w-0 flex-1`}
              />
              <input
                type="number"
                min={0}
                value={step.minutes}
                onChange={(event) => updateStep(step.id, { minutes: event.target.value })}
                aria-label={`Step ${index + 1} minutes`}
                className={`${INPUT} w-16`}
              />
              <span className="text-[13px] text-muted">min</span>
              <button
                type="button"
                onClick={() => setSteps(steps.filter((other) => other.id !== step.id))}
                aria-label={`Remove step ${index + 1}`}
                className="rounded px-1.5 text-muted hover:bg-hover hover:text-ink"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={addStep}
          className="mt-3 rounded-lg border border-line px-3 py-1.5 text-[13px] font-medium text-ink hover:bg-hover"
        >
          Add a step
        </button>
      </section>

      <section aria-label="Schedule" aria-live="polite" className="rounded-xl border border-line bg-panel p-4">
        {!plan && <p className="text-sm text-muted">Enter a time to see your schedule.</p>}
        {plan && (
          <>
            <p className="text-[13px] text-muted">Start at</p>
            <p className="text-3xl font-semibold tracking-tight text-ink">
              {formatClock(plan[0]?.start ?? arrivalMinutes!)}
              {plan[0] && dayLabel(plan[0].dayOffset) && (
                <span className="ml-2 text-sm font-normal text-muted">{dayLabel(plan[0].dayOffset)}</span>
              )}
            </p>
            <ol className="mt-3 flex flex-col divide-y divide-line text-[13px]">
              {plan.map((step, index) => (
                <li key={steps[index].id} className="flex items-baseline gap-3 py-1.5">
                  <span className="w-20 shrink-0 font-medium text-ink tabular-nums">{formatClock(step.start)}</span>
                  <span className="min-w-0 flex-1 break-words text-ink">{step.name}</span>
                  <span className="text-muted">{dayLabel(step.dayOffset) || `${step.minutes} min`}</span>
                </li>
              ))}
              <li className="flex items-baseline gap-3 py-1.5 font-semibold text-accent">
                <span className="w-20 shrink-0 tabular-nums">{formatClock(arrivalMinutes!)}</span>
                <span>Be there</span>
              </li>
            </ol>
          </>
        )}
      </section>
    </div>
  );
}
