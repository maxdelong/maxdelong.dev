import type { Metadata } from "next";
import { EmojiSearchLoader } from "@/components/emoji-search/EmojiSearchLoader";
import { PageHeader } from "@/components/PageHeader";
import { TodoCards } from "@/components/TodoCards";
import { todos } from "@/lib/emoji-search/todos";

export const metadata: Metadata = {
  title: "Emoji Search",
  description: "Find any emoji quickly by name, keyword or category, and copy it with one click.",
};

export default function EmojiSearchPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <PageHeader title="Emoji Search" description="Find the right emoji and copy it with one click." />
        <EmojiSearchLoader />
        <p className="mt-3 text-xs text-muted">Emoji names and keywords from Emojibase.</p>
      </div>
      <TodoCards cards={todos} />
    </div>
  );
}
