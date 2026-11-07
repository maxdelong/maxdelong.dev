import { BEST_MATCHES } from "./bestMatches";
import type { Emoji } from "./data";

export interface IndexedEmoji extends Emoji {
  nameWords: string[];
  /** Every keyword, split into single words. */
  keywordWords: string[];
  /** Position in the original list, used to break ties. */
  order: number;
}

export interface SearchResult {
  emoji: IndexedEmoji[];
  /** True when nothing matched exactly, so these are close spellings. */
  fuzzy: boolean;
}

const VARIATION_SELECTOR = /️/g;

function words(text: string): string[] {
  return text.split(/[^\p{L}\p{N}']+/u).filter(Boolean);
}

export function buildIndex(emoji: Emoji[]): IndexedEmoji[] {
  return emoji.map((entry, order) => ({
    ...entry,
    nameWords: words(entry.name),
    keywordWords: [...new Set(entry.keywords.flatMap(words))],
    order,
  }));
}

/** Treats ":hot_dog:", "Hot-Dog" and "hot dog" as the same search. */
export function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .replaceAll(/[:_-]/g, " ")
    .replaceAll(/\s+/g, " ")
    .trim();
}

/** How well one typed word matches an emoji. Zero means it doesn't. */
function scoreWord(entry: IndexedEmoji, word: string): number {
  let best = 0;
  for (const nameWord of entry.nameWords) {
    if (nameWord === word) return 100;
    if (nameWord.startsWith(word)) best = Math.max(best, 70);
    else if (word.length > 1 && nameWord.includes(word)) best = Math.max(best, 25);
  }
  if (best >= 70) return best;
  for (const keyword of entry.keywordWords) {
    if (keyword === word) return 60;
    if (keyword.startsWith(word)) best = Math.max(best, 40);
    else if (word.length > 2 && keyword.includes(word)) best = Math.max(best, 15);
  }
  return best;
}

/** Whether two words are within `limit` typos. A swapped pair of letters counts as one. */
export function withinTypos(a: string, b: string, limit: number): boolean {
  if (Math.abs(a.length - b.length) > limit) return false;
  let beforeLast: number[] = [];
  let last = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let rowBest = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let value = Math.min(last[j] + 1, row[j - 1] + 1, last[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        value = Math.min(value, beforeLast[j - 2] + 1);
      }
      row[j] = value;
      rowBest = Math.min(rowBest, value);
    }
    // A later swap can only win back one edit, so past that this can't succeed.
    if (rowBest > limit + 1) return false;
    beforeLast = last;
    last = row;
  }
  return last[b.length] <= limit;
}

function typoScore(entry: IndexedEmoji, word: string): number {
  if (word.length < 3) return 0;
  const limit = word.length >= 7 ? 2 : 1;
  if (entry.nameWords.some((other) => withinTypos(word, other, limit))) return 10;
  return entry.keywordWords.some((other) => withinTypos(word, other, limit)) ? 5 : 0;
}

function rank(
  index: IndexedEmoji[],
  phrase: string,
  typed: string[],
  scorer: (entry: IndexedEmoji, word: string) => number
): IndexedEmoji[] {
  const scored: { entry: IndexedEmoji; score: number }[] = [];
  for (const entry of index) {
    let score = 0;
    for (const word of typed) {
      const wordScore = scorer(entry, word);
      if (wordScore === 0) {
        score = 0;
        break;
      }
      score += wordScore;
    }
    if (score === 0) continue;
    if (entry.name === phrase) score += 1000;
    else if (entry.name.startsWith(phrase)) score += 200;
    else if (entry.name.includes(` ${phrase}`)) score += 100;
    scored.push({ entry, score });
  }
  scored.sort(
    (a, b) =>
      b.score - a.score ||
      a.entry.name.length - b.entry.name.length ||
      a.entry.order - b.entry.order
  );
  return scored.map(({ entry }) => entry);
}

function bestMatchesFor(index: IndexedEmoji[], phrase: string): IndexedEmoji[] {
  if (!Object.hasOwn(BEST_MATCHES, phrase)) return [];
  return BEST_MATCHES[phrase].flatMap((emoji) => index.filter((entry) => entry.emoji === emoji));
}

/**
 * Finds emoji matching every typed word, best first. Hand-picked best matches lead,
 * then exact matches, starts of words, parts of words and keywords. Typos are only
 * tried if all of those find nothing.
 */
export function searchEmoji(index: IndexedEmoji[], query: string): SearchResult {
  const pasted = query.trim().replaceAll(VARIATION_SELECTOR, "");
  if (pasted) {
    const exact = index.filter((entry) => entry.emoji.replaceAll(VARIATION_SELECTOR, "") === pasted);
    if (exact.length > 0) return { emoji: exact, fuzzy: false };
  }

  const phrase = normalizeQuery(query);
  if (!phrase) return { emoji: index, fuzzy: false };

  const typed = words(phrase);
  if (typed.length === 0) return { emoji: [], fuzzy: false };

  const strict = rank(index, phrase, typed, scoreWord);
  const best = bestMatchesFor(index, phrase);
  if (best.length > 0) {
    return { emoji: [...best, ...strict.filter((entry) => !best.includes(entry))], fuzzy: false };
  }
  if (strict.length > 0) return { emoji: strict, fuzzy: false };

  return {
    emoji: rank(index, phrase, typed, (entry, word) => scoreWord(entry, word) || typoScore(entry, word)),
    fuzzy: true,
  };
}
