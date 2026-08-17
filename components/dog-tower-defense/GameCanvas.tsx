"use client";

import { useEffect, useRef, useState } from "react";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  FROG_PATH,
  POND,
  PORCH,
  SQUIRREL_PATH,
  pointAtProgress,
} from "@/lib/dog-tower-defense/paths";
import { createInitialGameState, restart, tick, tryPlaceDog } from "@/lib/dog-tower-defense/gameState";
import type { GameState } from "@/lib/dog-tower-defense/types";
import { Hud } from "./Hud";

const SPOT_HIT_RADIUS = 24;

function drawPath(ctx: CanvasRenderingContext2D, waypoints: { x: number; y: number }[], color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 28;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(waypoints[0].x, waypoints[0].y);
  for (const wp of waypoints.slice(1)) ctx.lineTo(wp.x, wp.y);
  ctx.stroke();
}

function draw(ctx: CanvasRenderingContext2D, state: GameState) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // yard background
  ctx.fillStyle = "#dcefdc";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawPath(ctx, SQUIRREL_PATH.waypoints, "#c9b28a");
  drawPath(ctx, FROG_PATH.waypoints, "#c9b28a");

  // pond
  ctx.fillStyle = "#5eb3d6";
  ctx.beginPath();
  ctx.ellipse(
    POND.bounds.x + POND.bounds.width / 2,
    POND.bounds.y + POND.bounds.height / 2,
    POND.bounds.width / 2,
    POND.bounds.height / 2,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // porch
  ctx.fillStyle = "#8a5a3b";
  ctx.fillRect(PORCH.x - 16, PORCH.y - 16, 32, 32);

  // placement spots
  for (const spot of state.spots) {
    ctx.beginPath();
    ctx.arc(spot.position.x, spot.position.y, 14, 0, Math.PI * 2);
    ctx.fillStyle = spot.occupiedBy ? "#f2b705" : "#ffffffaa";
    ctx.fill();
    ctx.strokeStyle = "#00000033";
    ctx.stroke();
  }

  // dogs
  for (const dog of state.dogs) {
    const spot = state.spots.find((s) => s.id === dog.spotId);
    if (!spot) continue;
    ctx.font = "22px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🐶", spot.position.x, spot.position.y);
  }

  // intruders
  for (const intruder of state.intruders) {
    if (!intruder.alive) continue;
    const path = intruder.type === "squirrel" ? SQUIRREL_PATH : FROG_PATH;
    const pos = pointAtProgress(path, intruder.pathProgress);
    ctx.font = "20px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(intruder.type === "squirrel" ? "🐿️" : "🐸", pos.x, pos.y);
  }
}

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<GameState>(() => createInitialGameState());
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    let frameId: number;
    const loop = () => {
      setState((prev) => (prev.status === "playing" ? tick(prev) : prev));
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) draw(ctx, state);
  }, [state]);

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
    const y = ((e.clientY - rect.top) / rect.height) * CANVAS_HEIGHT;

    const nearest = stateRef.current.spots.find(
      (spot) => Math.hypot(spot.position.x - x, spot.position.y - y) <= SPOT_HIT_RADIUS
    );
    if (!nearest) return;

    setState((prev) => tryPlaceDog(prev, nearest.id));
  }

  return (
    <div className="flex flex-col gap-4">
      <Hud state={state} onRestart={() => setState(restart())} />
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onClick={handleClick}
        className="w-full max-w-3xl rounded border border-gray-300"
      />
    </div>
  );
}
