import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EmojiSearch } from "@/components/emoji-search/EmojiSearch";
import { BEST_MATCHES } from "@/lib/emoji-search/bestMatches";
import { CATEGORIES, EMOJI } from "@/lib/emoji-search/data";
import { buildIndex, normalizeQuery, searchEmoji, withinTypos } from "@/lib/emoji-search/search";

const INDEX = buildIndex(EMOJI);
const top = (query: string, count = 1) =>
  searchEmoji(INDEX, query)
    .emoji.slice(0, count)
    .map((entry) => entry.emoji);

describe("data", () => {
  it("has plenty of emoji, in every category, with no duplicates or skin tone pieces", () => {
    expect(EMOJI.length).toBeGreaterThan(1500);
    expect(new Set(EMOJI.map((entry) => entry.emoji)).size).toBe(EMOJI.length);
    CATEGORIES.forEach((_, index) => {
      expect(EMOJI.some((entry) => entry.category === index)).toBe(true);
    });
    expect(EMOJI.some((entry) => entry.name.includes("skin tone"))).toBe(false);
  });
});

describe("searchEmoji", () => {
  it("returns everything for an empty search", () => {
    expect(searchEmoji(INDEX, "   ").emoji).toHaveLength(INDEX.length);
  });

  it("ranks an exact name first", () => {
    expect(top("dog")).toEqual(["🐕"]);
    expect(top("taco")).toEqual(["🌮"]);
    expect(top("pizza")).toEqual(["🍕"]);
  });

  it("includes related emoji after the best match", () => {
    expect(top("dog", 5)).toContain("🐶");
  });

  it("matches while you're still typing", () => {
    expect(top("piz")).toEqual(["🍕"]);
    expect(top("tac")).toContain("🌮");
  });

  it("requires every word, in any order", () => {
    expect(top("face dog")).toEqual(["🐶"]);
    expect(top("dog face")).toEqual(["🐶"]);
    expect(searchEmoji(INDEX, "dog zzzzzzz").emoji).toEqual([]);
  });

  it("finds things by keyword, not just name", () => {
    expect(top("happy", 20)).toContain("😀");
    expect(top("love", 20)).toContain("❤️");
    expect(top("sad", 30)).toContain("😢");
    expect(top("puppy", 5)).toContain("🐶");
  });

  it("accepts shortcodes, punctuation and capitals", () => {
    expect(normalizeQuery(":Hot_Dog:")).toBe("hot dog");
    expect(top(":hot_dog:")).toEqual(["🌭"]);
    expect(top("HOT-DOG")).toEqual(["🌭"]);
  });

  it("finds a pasted emoji, with or without its variation selector", () => {
    expect(top("🌮")).toEqual(["🌮"]);
    expect(top("❤")).toEqual(["❤️"]);
  });

  it("forgives typos only when nothing matches exactly", () => {
    const typo = searchEmoji(INDEX, "pizzza");
    expect(typo.fuzzy).toBe(true);
    expect(typo.emoji[0].emoji).toBe("🍕");
    expect(searchEmoji(INDEX, "tcao").emoji.map((entry) => entry.emoji)).toContain("🌮");
    expect(searchEmoji(INDEX, "pizza").fuzzy).toBe(false);
  });

  it("doesn't crash on punctuation or regex characters", () => {
    for (const query of ["(", "[", "\\", "***", "::", "?"]) {
      expect(() => searchEmoji(INDEX, query)).not.toThrow();
    }
  });

  it("is fast, even in the slow typo path", () => {
    const queries = ["d", "dog", "face with", "smiling", "pizzza", "qqqqqqqqqq"];
    const start = performance.now();
    for (let i = 0; i < 50; i++) for (const query of queries) searchEmoji(INDEX, query);
    const average = (performance.now() - start) / (50 * queries.length);
    expect(average).toBeLessThan(16);
  });
});

describe("search quality", () => {
  it("puts what people usually mean first for common searches", () => {
    expect(top("love")).toEqual(["❤️"]);
    expect(top("heart")).toEqual(["❤️"]);
    expect(top("sad")).toEqual(["😢"]);
    expect(top("cry")).toEqual(["😢"]);
    expect(top("lol")).toEqual(["😂"]);
    expect(top("usa")).toEqual(["🇺🇸"]);
    expect(top("LOVE")).toEqual(["❤️"]);
  });

  it("every hand-picked emoji exists in the data", () => {
    const known = new Set(EMOJI.map((entry) => entry.emoji));
    for (const [query, picks] of Object.entries(BEST_MATCHES)) {
      for (const pick of picks) expect(known.has(pick), `${query}: ${pick}`).toBe(true);
    }
  });

  it("ranks whole-word matches above words that merely contain the search", () => {
    const names = searchEmoji(INDEX, "love").emoji.map((entry) => entry.name);
    expect(names.indexOf("love letter")).toBeLessThan(names.indexOf("gloves"));
  });

  it("isn't fooled by built-in object property names", () => {
    expect(() => searchEmoji(INDEX, "constructor")).not.toThrow();
    expect(() => searchEmoji(INDEX, "__proto__")).not.toThrow();
  });
});

describe("withinTypos", () => {
  it("counts edits and swapped letters", () => {
    expect(withinTypos("dog", "dog", 1)).toBe(true);
    expect(withinTypos("dgo", "dog", 1)).toBe(true);
    expect(withinTypos("dogg", "dog", 1)).toBe(true);
    expect(withinTypos("cat", "dog", 1)).toBe(false);
    expect(withinTypos("pizzza", "pizza", 1)).toBe(true);
  });
});

describe("EmojiSearch", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("narrows by search and category, and copies the top result on Enter", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
    render(<EmojiSearch />);

    const input = screen.getByLabelText("Search emoji");
    fireEvent.change(input, { target: { value: "taco" } });
    await screen.findByRole("button", { name: "Copy taco" });
    await waitFor(() => expect(screen.queryByRole("button", { name: "Copy dog" })).toBeNull());

    fireEvent.keyDown(input, { key: "Enter" });
    await waitFor(() => expect(writeText).toHaveBeenCalledWith("🌮"));
    expect(await screen.findByText(/Copied 🌮 taco/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Flags/ }));
    expect(await screen.findByText("Nothing in this category. Try All.")).toBeInTheDocument();

    fireEvent.keyDown(input, { key: "Escape" });
    fireEvent.click(screen.getByRole("button", { name: /Flags/ }));
    await screen.findByRole("button", { name: "Copy dog" });
  });
});
