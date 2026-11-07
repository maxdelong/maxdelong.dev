import { readFileSync } from "node:fs";
import path from "node:path";
import { marked } from "marked";

export interface DocEntry {
  slug: string;
  title: string;
  description: string;
  /** Path from the repo root. The page reads this file at build time. */
  file: string;
}

export const docs: DocEntry[] = [
  {
    slug: "dog-tower-defense",
    title: "Dog Tower Defense field guide",
    description: "Every breed, intruder and upgrade rule.",
    file: "docs/dog-tower-defense.md",
  },
  {
    slug: "about",
    title: "About this site",
    description: "How it's built and how to run it.",
    file: "docs/about.md",
  },
  {
    slug: "changelog",
    title: "Changelog",
    description: "What changed and when.",
    file: "docs/changelog.md",
  },
  {
    slug: "ideas",
    title: "Tool ideas",
    description: "Serious and silly things that might get built next.",
    file: "docs/ideas.md",
  },
  {
    slug: "backlog",
    title: "Backlog",
    description: "Maintenance and deployment work still to do.",
    file: "BACKLOG.md",
  },
  {
    slug: "dota-tracker-issues",
    title: "Dota Tracker known issues",
    description: "What's broken in the Dota Tracker right now.",
    file: "specs/001-dota-tracker-mvp/follow-ups.md",
  },
];

export function findDoc(slug: string): DocEntry | undefined {
  return docs.find((doc) => doc.slug === slug);
}

export function readDocSource(doc: DocEntry): string {
  return readFileSync(path.join(/*turbopackIgnore: true*/ process.cwd(), doc.file), "utf8");
}

/** The most recent changelog headings, newest first, for the home page. */
export function latestChanges(count: number): string[] {
  const changelog = findDoc("changelog");
  if (!changelog) return [];
  return [...readDocSource(changelog).matchAll(/^### (.+)$/gm)]
    .slice(0, count)
    .map((match) => match[1].trim());
}

/** Renders a doc to HTML. The Markdown comes from this repo, so the HTML is trusted. */
export function renderDoc(doc: DocEntry): string {
  return marked.parse(readDocSource(doc), { async: false });
}
