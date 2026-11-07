import { METR_RESULTS } from "@/lib/agentic-dev/content";

// The scale runs from 40% faster to 40% slower, so zero sits in the middle.
const RANGE = 40;
const position = (value: number) => ((value + RANGE) / (RANGE * 2)) * 100;

function describe(value: number): string {
  return value > 0 ? `${value}% slower` : `${Math.abs(value)}% faster`;
}

/** Estimates with their confidence intervals. The range matters as much as the dot. */
export function MetrChart() {
  return (
    <figure className="rounded-xl border border-line bg-panel p-4">
      <figcaption className="text-sm font-semibold text-ink">
        Experienced developers&apos; task time with AI, compared with without it
      </figcaption>

      <div className="mt-3 flex flex-col gap-3">
        {METR_RESULTS.map((result) => {
          const summary = `${describe(result.estimate)}, likely between ${describe(result.low)} and ${describe(result.high)}`;
          return (
            <div
              key={result.detail}
              title={summary}
              className="grid items-center gap-x-3 gap-y-1 sm:grid-cols-[10rem_1fr_11rem]"
            >
              <p className="text-[13px] text-ink">
                {result.label}
                <span className="block text-[11px] text-muted">{result.detail}</span>
              </p>
              <div aria-hidden className="relative h-6">
                <span className="absolute inset-y-0 left-1/2 w-px bg-muted" />
                <span
                  className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-accent/40"
                  style={{
                    left: `${position(result.low)}%`,
                    width: `${position(result.high) - position(result.low)}%`,
                  }}
                />
                <span
                  className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-2 ring-panel"
                  style={{ left: `${position(result.estimate)}%` }}
                />
              </div>
              <p className="text-[12px] text-muted sm:text-right">
                <span className="font-semibold text-ink">{describe(result.estimate)}</span>
                <span className="block text-[11px]">
                  Range: {result.low > 0 ? "+" : ""}
                  {result.low}% to {result.high > 0 ? "+" : ""}
                  {result.high}%
                </span>
              </p>
            </div>
          );
        })}
      </div>

      <div
        aria-hidden
        className="mt-1 flex justify-between text-[11px] text-muted sm:ml-[10.75rem] sm:mr-[11.75rem]"
      >
        <span>← 40% faster</span>
        <span>No change</span>
        <span>40% slower →</span>
      </div>
    </figure>
  );
}
