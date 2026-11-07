import { INTRUDERS } from "@/lib/dog-tower-defense/intruders";
import { TOTAL_ROUNDS, roundPreview } from "@/lib/dog-tower-defense/waves";
import type { GameState } from "@/lib/dog-tower-defense/types";

function Stat({ label, value }: Readonly<{ label: string; value: string | number }>) {
  return (
    <span className="flex items-baseline gap-1 text-sm">
      <span aria-hidden>{label}</span>
      <span className="font-semibold tabular-nums text-ink">{value}</span>
    </span>
  );
}

export function Hud({
  state,
  speed,
  autoStart,
  onStart,
  onToggleSpeed,
  onToggleAuto,
}: Readonly<{
  state: GameState;
  speed: number;
  autoStart: boolean;
  onStart: () => void;
  onToggleSpeed: () => void;
  onToggleAuto: () => void;
}>) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-lg border border-line bg-panel px-3 py-1.5">
      <span title="Round" className="text-sm font-semibold text-ink">
        Round {state.round}
        <span className="font-normal text-muted">/{TOTAL_ROUNDS}</span>
      </span>
      <span title="Lives">
        <Stat label="❤️" value={state.lives} />
      </span>
      <span title="Bones">
        <Stat label="🦴" value={state.bones} />
      </span>

      <div className="ml-auto flex items-center gap-1.5">
        <label className="flex cursor-pointer items-center gap-1 text-xs text-muted">
          <input type="checkbox" checked={autoStart} onChange={onToggleAuto} className="accent-accent" />
          Auto
        </label>
        <button
          type="button"
          onClick={onToggleSpeed}
          aria-label={`Game speed ${speed}x. Click to change.`}
          className="rounded-md border border-line px-2 py-0.5 text-xs font-semibold tabular-nums text-ink hover:bg-hover"
        >
          {speed}×
        </button>
        <button
          type="button"
          disabled={state.status !== "building"}
          onClick={onStart}
          className="rounded-md bg-accent px-3 py-0.5 text-xs font-semibold text-on-accent transition-opacity enabled:hover:opacity-90 disabled:opacity-40"
        >
          {state.status === "wave" ? "Wave running" : "Start round"}
        </button>
      </div>
    </div>
  );
}

export function NextRound({ round }: Readonly<{ round: number }>) {
  const groups = roundPreview(round);
  const hasHidden = groups.some((g) => INTRUDERS[g.type].hidden);
  const hasPrickly = groups.some((g) => INTRUDERS[g.type].prickly);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
      <span className="font-medium">Round {round}:</span>
      {groups.map(({ type, count }) => (
        <span key={type} title={`${INTRUDERS[type].name}: ${INTRUDERS[type].note}`}>
          {INTRUDERS[type].emoji} ×{count}
        </span>
      ))}
      {hasHidden && <span className="font-medium text-amber-700 dark:text-amber-300">👁 Hidden intruders</span>}
      {hasPrickly && <span className="font-medium text-amber-700 dark:text-amber-300">🦔 Prickly intruders</span>}
    </div>
  );
}
