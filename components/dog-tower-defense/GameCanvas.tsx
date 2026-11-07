"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { BREEDS, BREED_LIST } from "@/lib/dog-tower-defense/breeds";
import {
  activateAlpha,
  advance,
  buyDog,
  createInitialGameState,
  restart,
  sellDog,
  setTargeting,
  startRound,
  upgradeDog,
} from "@/lib/dog-tower-defense/gameState";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/lib/dog-tower-defense/paths";
import { DOG_RADIUS, canPlaceAt } from "@/lib/dog-tower-defense/placement";
import { TOTAL_ROUNDS } from "@/lib/dog-tower-defense/waves";
import type { BreedId, GameState, Point } from "@/lib/dog-tower-defense/types";
import { DogPanel } from "./DogPanel";
import { Hud, NextRound } from "./Hud";
import { drawGame, drawYard } from "./render";
import { Shop } from "./Shop";

/** How often the React panels refresh; the canvas itself redraws every frame. */
const PANEL_REFRESH_MS = 100;
const SPEEDS = [1, 2, 3];

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameState>(createInitialGameState());
  const [game, setGame] = useState<GameState>(gameRef.current);
  const [placing, setPlacing] = useState<BreedId | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [speed, setSpeed] = useState(1);
  const [autoStart, setAutoStart] = useState(false);
  const pointerRef = useRef<Point | null>(null);

  // The animation loop reads these without restarting whenever they change.
  const viewRef = useRef({ placing, selectedId, speed, autoStart });
  useEffect(() => {
    viewRef.current = { placing, selectedId, speed, autoStart };
  }, [placing, selectedId, speed, autoStart]);

  const update = useCallback((action: (state: GameState) => GameState) => {
    gameRef.current = action(gameRef.current);
    setGame(gameRef.current);
  }, []);

  useEffect(() => {
    const yard = document.createElement("canvas");
    yard.width = CANVAS_WIDTH;
    yard.height = CANVAS_HEIGHT;
    const yardCtx = yard.getContext("2d");
    if (yardCtx) drawYard(yardCtx);

    let frameId = 0;
    let last: number | null = null;
    let sinceRefresh = 0;

    const loop = (time: number) => {
      const elapsed = last === null ? 0 : time - last;
      last = time;
      const view = viewRef.current;

      const before = gameRef.current;
      let next = advance(before, elapsed * view.speed);
      if (next.status === "building" && view.autoStart) next = startRound(next);
      gameRef.current = next;

      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        const breed = view.placing ? BREEDS[view.placing] : null;
        const point = pointerRef.current;
        drawGame(ctx, yard, next, {
          selectedDogId: view.selectedId,
          ghost:
            breed && point
              ? { point, breed, valid: canPlaceAt(point, next.dogs) }
              : null,
        });
      }

      sinceRefresh += elapsed;
      if (sinceRefresh >= PANEL_REFRESH_MS || next.status !== before.status) {
        sinceRefresh = 0;
        setGame(next);
      }
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;
      if (event.key === "Escape") {
        setPlacing(null);
        setSelectedId(null);
        return;
      }
      const breed = BREED_LIST[Number(event.key) - 1];
      if (breed && gameRef.current.bones >= breed.cost) {
        setSelectedId(null);
        setPlacing(breed.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function canvasPoint(event: React.MouseEvent<HTMLCanvasElement>): Point {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * CANVAS_HEIGHT,
    };
  }

  function handleClick(event: React.MouseEvent<HTMLCanvasElement>) {
    const point = canvasPoint(event);
    const current = gameRef.current;

    if (placing) {
      if (!canPlaceAt(point, current.dogs)) {
        // Touch has no hover, so show the player why nothing happened.
        pointerRef.current = point;
        return;
      }
      const next = buyDog(current, placing, point);
      if (next !== current) {
        update(() => next);
        setPlacing(null);
        pointerRef.current = null;
      }
      return;
    }

    const hit = current.dogs.find(
      (dog) => Math.hypot(dog.x - point.x, dog.y - point.y) <= DOG_RADIUS + 6
    );
    setSelectedId(hit ? hit.id : null);
  }

  const selected = game.dogs.find((d) => d.id === selectedId) ?? null;
  const over = game.status === "won" || game.status === "lost";

  return (
    <div className="flex flex-col gap-2">
      <Hud
        state={game}
        speed={speed}
        autoStart={autoStart}
        onStart={() => update(startRound)}
        onToggleSpeed={() => setSpeed((s) => SPEEDS[(SPEEDS.indexOf(s) + 1) % SPEEDS.length])}
        onToggleAuto={() => setAutoStart((v) => !v)}
      />

      <div className="flex flex-col gap-2 lg:flex-row lg:items-start">
        <div className="relative min-w-0 flex-1">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onClick={handleClick}
            onMouseMove={(e) => {
              pointerRef.current = canvasPoint(e);
            }}
            onMouseLeave={() => {
              pointerRef.current = null;
            }}
            aria-label="Backyard with two paths leading to the porch. Choose a dog from the shop, then click the grass to place it."
            className={`block w-full rounded-lg border border-line ${placing ? "cursor-copy" : "cursor-pointer"}`}
          />
          {over && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/45 p-4">
              <div className="rounded-xl bg-panel px-6 py-4 text-center shadow-xl">
                <div className="text-lg font-bold text-ink">
                  {game.status === "won" ? "The yard is safe! 🎉" : "They got to the porch"}
                </div>
                <p className="mt-1 text-sm text-muted">
                  {game.status === "won"
                    ? `You cleared all ${TOTAL_ROUNDS} rounds with ${game.lives} lives left.`
                    : `You reached round ${game.round}.`}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    update(restart);
                    setPlacing(null);
                    setSelectedId(null);
                    // Otherwise the next game would start before any dogs are placed.
                    setAutoStart(false);
                    viewRef.current.autoStart = false;
                  }}
                  className="mt-3 rounded-md bg-accent px-4 py-1.5 text-sm font-semibold text-on-accent hover:opacity-90"
                >
                  Play again
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="flex w-full shrink-0 flex-col gap-2 lg:w-64">
          {selected ? (
            <DogPanel
              key={selected.id}
              dog={selected}
              bones={game.bones}
              alphaMs={game.alphaMs}
              onUpgrade={(path) => update((s) => upgradeDog(s, selected.id, path))}
              onSell={() => {
                update((s) => sellDog(s, selected.id));
                setSelectedId(null);
              }}
              onTarget={(targeting) => update((s) => setTargeting(s, selected.id, targeting))}
              onAlpha={() => update((s) => activateAlpha(s, selected.id))}
              onClose={() => setSelectedId(null)}
            />
          ) : (
            <Shop
              bones={game.bones}
              placing={placing}
              onChoose={(breed) => setPlacing((current) => (current === breed ? null : breed))}
            />
          )}
          <p className="text-[11px] leading-snug text-muted">
            {placing
              ? `Click the grass to place your ${BREEDS[placing].name}. Esc cancels.`
              : selected
                ? "Click empty grass to go back to the shop."
                : "Pick a dog, or click one in the yard to upgrade it. "}
            {!placing && !selected && (
              <Link href="/docs/dog-tower-defense" className="underline hover:text-ink">
                Field guide
              </Link>
            )}
          </p>
        </aside>
      </div>

      {game.status === "building" && <NextRound round={game.round} />}
    </div>
  );
}
