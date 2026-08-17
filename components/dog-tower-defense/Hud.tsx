import type { GameState } from "@/lib/dog-tower-defense/types";

export function Hud({
  state,
  onRestart,
}: {
  state: GameState;
  onRestart: () => void;
}) {
  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-4 text-sm font-medium text-gray-800">
        <span>❤️ Lives: {state.lives}</span>
        <span>🦴 Bones: {state.bones}</span>
      </div>

      {state.status !== "playing" && (
        <div className="flex items-center gap-3 rounded border border-gray-300 bg-white px-4 py-2 shadow-sm">
          <span className="font-semibold">
            {state.status === "won" ? "You win! 🎉" : "You lose"}
          </span>
          <button
            type="button"
            onClick={onRestart}
            className="rounded bg-gray-900 px-3 py-1 text-sm font-medium text-white hover:bg-gray-700"
          >
            Play again
          </button>
        </div>
      )}
    </div>
  );
}
