import raw from "./emoji.json";

export const CATEGORIES = [
  { name: "Smileys", icon: "😀" },
  { name: "People", icon: "🧑" },
  { name: "Animals & nature", icon: "🐕" },
  { name: "Food & drink", icon: "🌮" },
  { name: "Travel & places", icon: "✈️" },
  { name: "Activities", icon: "⚽" },
  { name: "Objects", icon: "💡" },
  { name: "Symbols", icon: "❤️" },
  { name: "Flags", icon: "🏁" },
] as const;

export interface Emoji {
  emoji: string;
  name: string;
  /** Index into CATEGORIES. */
  category: number;
  keywords: string[];
}

/**
 * A snapshot of Emojibase 18 (MIT, see EMOJIBASE-LICENSE), limited to Emoji 15 and
 * earlier because newer ones often show as empty boxes. Each row is
 * [emoji, name, category, keywords separated by "|"].
 */
export const EMOJI: Emoji[] = (raw as [string, string, number, string][]).map(
  ([emoji, name, category, keywords]) => ({
    emoji,
    name,
    category,
    keywords: keywords ? keywords.split("|") : [],
  })
);
