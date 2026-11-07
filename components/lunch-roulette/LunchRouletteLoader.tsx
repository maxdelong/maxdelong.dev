"use client";

import dynamic from "next/dynamic";

// The list is saved in the visitor's browser, so this only renders there.
export const LunchRouletteLoader = dynamic(
  () => import("./LunchRoulette").then((module) => module.LunchRoulette),
  {
    ssr: false,
    loading: () => <p className="py-8 text-center text-sm text-muted">Checking the menu…</p>,
  }
);
