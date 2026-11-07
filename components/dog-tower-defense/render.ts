import { BREEDS, dogStats, type Breed } from "@/lib/dog-tower-defense/breeds";
import { INTRUDERS } from "@/lib/dog-tower-defense/intruders";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  PATH_WIDTH,
  POND,
  PORCH,
  WAYPOINTS,
} from "@/lib/dog-tower-defense/paths";
import { DOG_RADIUS } from "@/lib/dog-tower-defense/placement";
import type { Dog, GameState, Point } from "@/lib/dog-tower-defense/types";

const TAU = Math.PI * 2;

/** Draws a dog's face. Used on the yard and on the shop cards, so both always match. */
export function drawDogHead(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  art: Breed["art"]
) {
  ctx.save();
  ctx.translate(x, y);

  // ears
  ctx.fillStyle = art.earColor ?? shade(art.fur, -28);
  if (art.ears === "pointy" || art.ears === "big") {
    const width = art.ears === "big" ? 0.62 : 0.42;
    const height = art.ears === "big" ? 1.45 : 1.35;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(side * r * 0.25, -r * 0.65);
      ctx.lineTo(side * r * (0.35 + width), -r * height);
      ctx.lineTo(side * r * (0.35 + width + 0.1), -r * 0.2);
      ctx.closePath();
      ctx.fill();
    }
  } else if (art.ears === "floppy") {
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(side * r * 0.86, -r * 0.05, r * 0.32, r * 0.68, side * -0.25, 0, TAU);
      ctx.fill();
    }
  }

  // head
  ctx.fillStyle = art.fur;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.88, 0, TAU);
  ctx.fill();

  // marking across the top of the head
  if (art.cap) {
    ctx.fillStyle = art.cap;
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.6, r * 0.62, r * 0.28, 0, 0, TAU);
    ctx.fill();
  }

  // muzzle
  ctx.fillStyle = art.accent;
  ctx.beginPath();
  ctx.ellipse(0, r * 0.32, r * 0.48, r * 0.38, 0, 0, TAU);
  ctx.fill();

  // eyes
  ctx.fillStyle = "#1e1a17";
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(side * r * 0.33, -r * 0.14, r * 0.11, 0, TAU);
    ctx.fill();
  }

  // nose
  ctx.fillStyle = "#0b0807";
  ctx.beginPath();
  ctx.ellipse(0, r * 0.2, r * 0.15, r * 0.11, 0, 0, TAU);
  ctx.fill();

  ctx.restore();
}

function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const channel = (value: number) => Math.max(0, Math.min(255, value + amount));
  const r = channel((n >> 16) & 255);
  const g = channel((n >> 8) & 255);
  const b = channel(n & 255);
  return `rgb(${r}, ${g}, ${b})`;
}

function tracePath(ctx: CanvasRenderingContext2D, points: Point[]) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (const point of points.slice(1)) ctx.lineTo(point.x, point.y);
}

/** The parts of the yard that never change, drawn once per frame from an offscreen copy. */
export function drawYard(ctx: CanvasRenderingContext2D) {
  // mowed grass stripes
  for (let i = 0; i < 16; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#8ec276" : "#86bb6e";
    ctx.fillRect((i * CANVAS_WIDTH) / 16, 0, CANVAS_WIDTH / 16 + 1, CANVAS_HEIGHT);
  }

  // scattered flowers and tufts, at fixed spots
  const decor: [number, number, string][] = [
    [60, 230, "#f6d55c"], [90, 420, "#ffffff"], [150, 300, "#f28ca8"], [280, 70, "#ffffff"],
    [300, 280, "#f6d55c"], [340, 440, "#f28ca8"], [440, 290, "#ffffff"], [570, 80, "#f6d55c"],
    [600, 420, "#ffffff"], [700, 360, "#f28ca8"], [720, 110, "#ffffff"], [40, 40, "#f28ca8"],
  ];
  for (const [x, y, color] of decor) {
    ctx.fillStyle = color;
    for (let petal = 0; petal < 5; petal++) {
      const angle = (petal / 5) * TAU;
      ctx.beginPath();
      ctx.arc(x + Math.cos(angle) * 3, y + Math.sin(angle) * 3, 2, 0, TAU);
      ctx.fill();
    }
    ctx.fillStyle = "#b9862c";
    ctx.beginPath();
    ctx.arc(x, y, 1.6, 0, TAU);
    ctx.fill();
  }

  // paths: dark edge, then dirt, then a lighter centre
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const passes: [string, number][] = [
    ["#a58c62", PATH_WIDTH + 4],
    ["#d4bb8c", PATH_WIDTH],
    ["#ddc79c", PATH_WIDTH - 12],
  ];
  for (const [color, width] of passes) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    tracePath(ctx, WAYPOINTS.yard);
    ctx.stroke();
    tracePath(ctx, WAYPOINTS.pond);
    ctx.stroke();
  }

  // pond
  const cx = POND.x + POND.width / 2;
  const cy = POND.y + POND.height / 2;
  ctx.fillStyle = "#6d9a5a";
  ctx.beginPath();
  ctx.ellipse(cx, cy, POND.width / 2 + 5, POND.height / 2 + 5, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#4fa8cf";
  ctx.beginPath();
  ctx.ellipse(cx, cy, POND.width / 2, POND.height / 2, 0, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "#ffffff55";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(cx - 12, cy - 6, 22, 9, 0, 0, TAU);
  ctx.stroke();

  // porch and house
  ctx.fillStyle = "#6e4a30";
  ctx.fillRect(PORCH.x - 22, PORCH.y - 26, 62, 52);
  ctx.fillStyle = "#8d6242";
  ctx.fillRect(PORCH.x - 18, PORCH.y - 22, 58, 44);
  ctx.strokeStyle = "#6e4a30";
  ctx.lineWidth = 2;
  for (let y = PORCH.y - 12; y < PORCH.y + 22; y += 10) {
    ctx.beginPath();
    ctx.moveTo(PORCH.x - 18, y);
    ctx.lineTo(PORCH.x + 40, y);
    ctx.stroke();
  }
  ctx.font = "20px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🏠", PORCH.x + 10, PORCH.y);
}

export interface Overlay {
  selectedDogId: number | null;
  /** The ghost shown while choosing where to put a new dog. */
  ghost: { point: Point; breed: Breed; valid: boolean } | null;
}

function drawRange(ctx: CanvasRenderingContext2D, point: Point, range: number, color: string) {
  ctx.beginPath();
  ctx.arc(point.x, point.y, range, 0, TAU);
  ctx.fillStyle = `${color}26`;
  ctx.fill();
  ctx.strokeStyle = `${color}aa`;
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function drawDog(ctx: CanvasRenderingContext2D, dog: Dog, selected: boolean, alpha: boolean) {
  const data = BREEDS[dog.breed];

  // ground shadow and base
  ctx.fillStyle = "#00000030";
  ctx.beginPath();
  ctx.ellipse(dog.x, dog.y + DOG_RADIUS - 2, DOG_RADIUS - 2, 4, 0, 0, TAU);
  ctx.fill();

  if (selected || alpha) {
    ctx.strokeStyle = alpha ? "#ffb01f" : "#ffffff";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(dog.x, dog.y, DOG_RADIUS + 3, 0, TAU);
    ctx.stroke();
  }

  drawDogHead(ctx, dog.x, dog.y, DOG_RADIUS, data.art);

  // upgrade pips
  const pips = dog.tiers[0] + dog.tiers[1];
  for (let i = 0; i < pips; i++) {
    ctx.fillStyle = "#ffd447";
    ctx.beginPath();
    ctx.arc(dog.x - ((pips - 1) * 5) / 2 + i * 5, dog.y + DOG_RADIUS + 2, 2, 0, TAU);
    ctx.fill();
  }

  if (dog.stunnedMs > 0) {
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#000000";
    ctx.fillText("💫", dog.x, dog.y - DOG_RADIUS - 6);
  }
}

function drawEffects(ctx: CanvasRenderingContext2D, state: GameState) {
  for (const effect of state.effects) {
    const t = effect.remainingMs / effect.totalMs;
    if (effect.kind === "howl" || effect.kind === "spray" || effect.kind === "alpha") {
      const color =
        effect.kind === "howl" ? "#bfe6ff" : effect.kind === "spray" ? "#b8d94a" : "#ffb01f";
      ctx.strokeStyle = color;
      ctx.globalAlpha = t * 0.9;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(effect.from.x, effect.from.y, effect.radius * (1 - t * 0.6), 0, TAU);
      ctx.stroke();
      if (effect.kind === "spray") {
        ctx.fillStyle = "#b8d94a33";
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    } else if (effect.kind === "ball") {
      const x = effect.to.x + (effect.from.x - effect.to.x) * t;
      const y = effect.to.y + (effect.from.y - effect.to.y) * t;
      ctx.fillStyle = "#d7ec3a";
      ctx.strokeStyle = "#7f8c1b";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, TAU);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.strokeStyle = "#fff4d6";
      ctx.globalAlpha = t;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(effect.from.x, effect.from.y);
      ctx.lineTo(effect.to.x, effect.to.y);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }
}

export function drawGame(
  ctx: CanvasRenderingContext2D,
  yard: CanvasImageSource,
  state: GameState,
  overlay: Overlay
) {
  ctx.drawImage(yard, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const selected = state.dogs.find((d) => d.id === overlay.selectedDogId);
  if (selected) drawRange(ctx, selected, dogStats(selected).range, "#ffffff");
  if (overlay.ghost) {
    drawRange(
      ctx,
      overlay.ghost.point,
      overlay.ghost.breed.base.range,
      overlay.ghost.valid ? "#ffffff" : "#e5484d"
    );
  }

  for (const dog of state.dogs) {
    drawDog(ctx, dog, dog.id === overlay.selectedDogId, state.alphaMs > 0);
  }

  if (overlay.ghost) {
    ctx.globalAlpha = 0.75;
    drawDogHead(ctx, overlay.ghost.point.x, overlay.ghost.point.y, DOG_RADIUS, overlay.ghost.breed.art);
    ctx.globalAlpha = 1;
  }

  for (const intruder of state.intruders) {
    const data = INTRUDERS[intruder.type];
    const size = data.boss ? (intruder.type === "swan" ? 40 : 30) : 20;
    ctx.font = `${size}px sans-serif`;
    // Emoji pick up the fill color's transparency, so it must be opaque here.
    ctx.fillStyle = "#000000";
    ctx.globalAlpha = data.hidden ? 0.55 : 1;
    ctx.fillText(data.emoji, intruder.x, intruder.y);
    ctx.globalAlpha = 1;

    if (intruder.slowed) {
      ctx.fillStyle = "#3ba7ff99";
      ctx.beginPath();
      ctx.arc(intruder.x, intruder.y + size / 2, 3, 0, TAU);
      ctx.fill();
    }

    if (intruder.hp < data.hp || data.boss) {
      const width = data.boss ? 44 : 20;
      const top = intruder.y - size / 2 - 7;
      ctx.fillStyle = "#00000080";
      ctx.fillRect(intruder.x - width / 2, top, width, 4);
      ctx.fillStyle = data.boss ? "#ff5d5d" : "#6ee36e";
      ctx.fillRect(intruder.x - width / 2, top, (width * Math.max(0, intruder.hp)) / data.hp, 4);
    }
  }

  drawEffects(ctx, state);
}
