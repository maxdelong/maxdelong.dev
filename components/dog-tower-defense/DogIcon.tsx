"use client";

import { useEffect, useRef } from "react";
import type { Breed } from "@/lib/dog-tower-defense/breeds";
import { drawDogHead } from "./render";

const RESOLUTION = 3;

export function DogIcon({ art, size = 32 }: Readonly<{ art: Breed["art"]; size?: number }>) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(RESOLUTION, 0, 0, RESOLUTION, 0, 0);
    ctx.clearRect(0, 0, size, size);
    drawDogHead(ctx, size / 2, size / 2 + size * 0.08, size * 0.36, art);
  }, [art, size]);

  return (
    <canvas
      ref={ref}
      width={size * RESOLUTION}
      height={size * RESOLUTION}
      style={{ width: size, height: size }}
      aria-hidden
    />
  );
}
