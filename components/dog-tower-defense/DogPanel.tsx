import { BREEDS, MAX_TIER, dogStats, nextUpgrade } from "@/lib/dog-tower-defense/breeds";
import { sellValue } from "@/lib/dog-tower-defense/gameState";
import type { Dog, PathIndex, Targeting } from "@/lib/dog-tower-defense/types";
import { DogIcon } from "./DogIcon";

const TARGETING: { id: Targeting; label: string }[] = [
  { id: "first", label: "First" },
  { id: "last", label: "Last" },
  { id: "strong", label: "Strong" },
  { id: "close", label: "Close" },
];

function statLine(dog: Dog): string {
  const stats = dogStats(dog);
  const parts: string[] = [];
  if (stats.attack !== "none") {
    parts.push(`${stats.damage} dmg`, `${(1000 / stats.cooldownMs).toFixed(1)}/s`);
    if (stats.attack !== "howl" && stats.pierce > 1) parts.push(`hits ${stats.pierce}`);
    if (stats.attack === "howl") parts.push("hits all");
  }
  parts.push(`${Math.round(stats.range)} range`);
  if (stats.slow > 0) parts.push(`${Math.round(stats.slow * 100)}% slow`);
  if (stats.bonesPerRound > 0) parts.push(`+${stats.bonesPerRound} 🦴/round`);
  return parts.join(" · ");
}

export function DogPanel({
  dog,
  bones,
  alphaMs,
  onUpgrade,
  onSell,
  onTarget,
  onAlpha,
  onClose,
}: Readonly<{
  dog: Dog;
  bones: number;
  alphaMs: number;
  onUpgrade: (path: PathIndex) => void;
  onSell: () => void;
  onTarget: (targeting: Targeting) => void;
  onAlpha: () => void;
  onClose: () => void;
}>) {
  const breed = BREEDS[dog.breed];
  const stats = dogStats(dog);

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-line bg-panel p-2">
      <div className="flex items-center gap-2">
        <DogIcon art={breed.art} size={34} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-ink">{breed.name}</div>
          <div className="text-[11px] text-muted">{dog.defeats} defeats</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dog details"
          className="rounded px-1.5 text-muted hover:bg-hover hover:text-ink"
        >
          ✕
        </button>
      </div>

      <p className="text-[11px] leading-snug text-muted">{statLine(dog)}</p>
      <div className="flex flex-wrap gap-1 text-[10px] font-medium">
        {stats.seesHidden && <span className="rounded bg-hover px-1.5 py-0.5 text-muted">👁 Sees hidden</span>}
        {(stats.hitsPrickly || stats.attack === "howl") && (
          <span className="rounded bg-hover px-1.5 py-0.5 text-muted">🦔 Hits prickly</span>
        )}
      </div>

      {([0, 1] as const).map((path) => {
        const tier = dog.tiers[path];
        const upgrade = nextUpgrade(dog, path);
        const maxed = tier >= MAX_TIER;
        return (
          <div key={path}>
            <div className="mb-0.5 flex items-center justify-between text-[11px] text-muted">
              <span className="font-medium">{breed.pathNames[path]}</span>
              <span aria-label={`Tier ${tier} of ${MAX_TIER}`} className="tracking-widest text-accent">
                {"●".repeat(tier)}
                <span className="text-line">{"●".repeat(MAX_TIER - tier)}</span>
              </span>
            </div>
            <button
              type="button"
              disabled={!upgrade || bones < upgrade.cost}
              onClick={() => onUpgrade(path)}
              className="w-full rounded-md border border-line bg-canvas px-2 py-1 text-left transition-colors enabled:hover:border-accent enabled:hover:bg-accent-soft disabled:opacity-55"
            >
              {upgrade ? (
                <>
                  <span className="flex justify-between gap-2 text-xs font-medium text-ink">
                    <span className="truncate">{upgrade.name}</span>
                    <span className="shrink-0">🦴 {upgrade.cost}</span>
                  </span>
                  <span className="block text-[11px] leading-snug text-muted">{upgrade.description}</span>
                </>
              ) : (
                <span className="text-xs text-muted">{maxed ? "Maxed out" : "Locked by the other path"}</span>
              )}
            </button>
          </div>
        );
      })}

      {stats.hasAbility && (
        <button
          type="button"
          disabled={dog.abilityCooldownMs > 0}
          onClick={onAlpha}
          className="rounded-md bg-amber-500 px-2 py-1.5 text-xs font-semibold text-black transition-colors enabled:hover:bg-amber-400 disabled:opacity-60"
        >
          {alphaMs > 0
            ? "Alpha Command active!"
            : dog.abilityCooldownMs > 0
              ? `Alpha Command in ${Math.ceil(dog.abilityCooldownMs / 1000)}s`
              : "Alpha Command"}
        </button>
      )}

      {stats.attack !== "none" && stats.attack !== "howl" && (
        <div className="flex gap-0.5 rounded-md bg-hover p-0.5" role="group" aria-label="Targeting">
          {TARGETING.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={dog.targeting === id}
              onClick={() => onTarget(id)}
              className={`flex-1 rounded px-1 py-0.5 text-[11px] font-medium ${
                dog.targeting === id ? "bg-panel text-ink shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onSell}
        className="rounded-md border border-line px-2 py-1 text-xs font-medium text-muted transition-colors hover:border-red-400 hover:text-red-600 dark:hover:text-red-400"
      >
        Sell for 🦴 {sellValue(dog)}
      </button>
    </div>
  );
}
