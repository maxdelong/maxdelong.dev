import { DOG_COST } from "@/lib/dog-tower-defense/placement";
import type { GameState } from "@/lib/dog-tower-defense/types";

const BUTTON_CLASS =
  "rounded bg-gray-900 px-3 py-1 text-sm font-medium text-white hover:bg-gray-700";

export function Hud({
  state,
  onStart,
  onRestart,
}: {
  state: GameState;
  onStart: () => void;
  onRestart: () => void;
}) {
  const intrudersLeft = state.intruders.filter((i) => i.alive).length;

  return (
    <div className="flex min-h-11 flex-wrap items-center gap-x-6 gap-y-2">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-gray-800">
        <span>❤️ Lives: {state.lives}</span>
        <span>🦴 Bones: {state.bones}</span>
        <span>🐾 Intruders left: {intrudersLeft}</span>
      </div>

      {state.status === "ready" && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-600">
            Click a white spot to place a dog ({DOG_COST} bones), then start. Guard both paths!
          </span>
          <button type="button" onClick={onStart} className={BUTTON_CLASS}>
            Start wave
          </button>
        </div>
      )}

      {state.status === "playing" && (
        <span className="text-sm text-gray-600">
          Defeats earn bones. A new dog costs {DOG_COST}.
        </span>
      )}

      {(state.status === "won" || state.status === "lost") && (
        <div className="flex items-center gap-3 rounded border border-gray-300 bg-white px-4 py-2 shadow-sm">
          <span className="font-semibold">
            {state.status === "won" ? "You win! 🎉" : "You lose"}
          </span>
          <button type="button" onClick={onRestart} className={BUTTON_CLASS}>
            Play again
          </button>
        </div>
      )}
    </div>
  );
}
