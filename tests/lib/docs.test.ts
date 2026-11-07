import { describe, expect, it } from "vitest";
import { BREED_LIST } from "@/lib/dog-tower-defense/breeds";
import { INTRUDERS } from "@/lib/dog-tower-defense/intruders";
import { docs, findDoc, readDocSource, renderDoc } from "@/lib/docs";

describe("docs registry", () => {
  it("every entry points to a file that renders with a heading", () => {
    for (const doc of docs) {
      expect(renderDoc(doc), doc.slug).toMatch(/<h1[^>]*>/);
    }
  });

  it("has unique slugs", () => {
    const slugs = docs.map((d) => d.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("does not publish relative Markdown links, which would break on the site", () => {
    for (const doc of docs) {
      expect(readDocSource(doc), doc.slug).not.toMatch(/\]\(\.{0,2}\/?[^)]*\.md\)/);
    }
  });
});

describe("field guide", () => {
  const guide = readDocSource(findDoc("dog-tower-defense")!);

  it("lists every breed at its current price", () => {
    for (const breed of BREED_LIST) {
      expect(guide).toContain(`| ${breed.name} | ${breed.cost} |`);
    }
  });

  it("lists every intruder with its current health and lives lost", () => {
    for (const intruder of Object.values(INTRUDERS)) {
      expect(guide).toContain(`${intruder.name} | ${intruder.hp} | ${intruder.leak} |`);
    }
  });
});
