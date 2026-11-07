import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { TodoCards } from "@/components/TodoCards";
import { apps } from "@/lib/apps";

export const metadata: Metadata = {
  title: "To-do list",
  description: "Possible improvements to every app, gathered in one place.",
};

export default function TodosPage() {
  const withTodos = apps.filter((app) => app.todos.length > 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/docs" className="mb-3 inline-block text-xs text-muted hover:text-ink">
          ← All docs
        </Link>
        <PageHeader
          title="To-do list"
          description="Possible improvements to every app. This page is built from each app's own list."
        />
      </div>
      {withTodos.map((app) => (
        <TodoCards
          key={app.slug}
          cards={app.todos}
          title={
            <Link href={`/${app.slug}`} className="hover:text-accent">
              <span aria-hidden>{app.icon} </span>
              {app.name}
            </Link>
          }
        />
      ))}
      <p className="text-[13px] text-muted">
        Site and dependency work is in the{" "}
        <Link href="/docs/backlog" className="text-accent hover:underline">
          backlog
        </Link>
        .
      </p>
    </div>
  );
}
