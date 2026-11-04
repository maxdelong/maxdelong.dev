"use client";

import { useEffect, useRef, useState } from "react";
import { dogPosition, intruderPosition, isInYard } from "@/lib/dog-tower-defense/combat";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  FROG_PATH,
  POND,
  PORCH,
  SQUIRREL_PATH,
} from "@/lib/dog-tower-defense/paths";
import {
  createInitialGameState,
  restart,
  startWave,
  tick,
  tryPlaceDog,
} from "@/lib/dog-tower-defense/gameState";
import type { GameState } from "@/lib/dog-tower-defense/types";
import { Hud } from "./Hud";

const SPOT_HIT_RADIUS = 32;

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

  // dog ranges
  ctx.lineWidth = 1;
  for (const dog of state.dogs) {
    const position = dogPosition(dog);
    ctx.beginPath();
    ctx.arc(position.x, position.y, dog.range, 0, Math.PI * 2);
    ctx.fillStyle = "#f2b70522";
    ctx.fill();
    ctx.strokeStyle = "#f2b70588";
    ctx.stroke();
  }

  // placement spots
  for (const spot of state.spots) {
    ctx.beginPath();
    ctx.arc(spot.position.x, spot.position.y, 14, 0, Math.PI * 2);
    ctx.fillStyle = spot.occupiedBy ? "#f2b705" : "#ffffffaa";
    ctx.fill();
    ctx.strokeStyle = "#00000033";
    ctx.stroke();
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // dogs
  ctx.font = "22px sans-serif";
  for (const dog of state.dogs) {
    const position = dogPosition(dog);
    ctx.fillText("🐶", position.x, position.y);
  }

  // intruders
  ctx.font = "20px sans-serif";
  for (const intruder of state.intruders) {
    if (!isInYard(intruder, state.elapsedMs)) continue;
    const position = intruderPosition(intruder);
    ctx.fillText(intruder.type === "squirrel" ? "🐿️" : "🐸", position.x, position.y);
  }

  // attacks
  ctx.strokeStyle = "#d9480f";
  ctx.lineWidth = 3;
  for (const attack of state.attacks) {
    ctx.beginPath();
    ctx.moveTo(attack.from.x, attack.from.y);
    ctx.lineTo(attack.to.x, attack.to.y);
    ctx.stroke();
  }
}

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<GameState>(() => createInitialGameState());

  useEffect(() => {
    let frameId: number;
    let lastTime: number | null = null;
    const loop = (time: number) => {
      const deltaMs = lastTime === null ? 0 : time - lastTime;
      lastTime = time;
      setState((prev) => tick(prev, deltaMs));
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

    const nearest = state.spots.find(
      (spot) => Math.hypot(spot.position.x - x, spot.position.y - y) <= SPOT_HIT_RADIUS
    );
    if (!nearest) return;

    setState((prev) => tryPlaceDog(prev, nearest.id));
  }

  return (
    <div className="flex flex-col gap-4">
      <Hud
        state={state}
        onStart={() => setState(startWave)}
        onRestart={() => setState(restart())}
      />
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onClick={handleClick}
        aria-label="Yard with two paths leading to the porch. Click a white spot to place a dog."
        className="w-full max-w-3xl cursor-pointer rounded border border-gray-300"
      />
    </div>
  );
}
