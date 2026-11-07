import type { ReactNode } from "react";
import type { TodoCard } from "@/lib/todos";

export function TodoCards({
  cards,
  title = "To do",
}: Readonly<{ cards: TodoCard[]; title?: ReactNode }>) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      <ul className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <li key={card.title} className="flex flex-col gap-1 rounded-xl border border-dashed border-line bg-panel p-3">
            <span className="flex items-start justify-between gap-2">
              <span className="text-sm font-semibold text-ink">{card.title}</span>
              <span className="rounded bg-hover px-1.5 py-px text-[11px] text-muted" title="Rough size">
                {card.size}
              </span>
            </span>
            <span className="text-[13px] leading-snug text-muted">{card.summary}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
