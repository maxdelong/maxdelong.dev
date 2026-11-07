"use client";

import dynamic from "next/dynamic";

// The game depends on the visitor's date and saved throw, so it only renders in the browser.
export const DailyFetchLoader = dynamic(
  () => import("./DailyFetch").then((module) => module.DailyFetch),
  {
    ssr: false,
    loading: () => <p className="py-8 text-center text-sm text-muted">Finding the dog…</p>,
  }
);
