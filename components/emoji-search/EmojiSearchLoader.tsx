"use client";

import dynamic from "next/dynamic";

// Keeps the emoji list out of the page's first download, so it loads quickly.
export const EmojiSearchLoader = dynamic(
  () => import("./EmojiSearch").then((module) => module.EmojiSearch),
  {
    ssr: false,
    loading: () => <p className="py-8 text-center text-sm text-muted">Loading emoji…</p>,
  }
);
