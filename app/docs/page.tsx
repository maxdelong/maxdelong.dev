import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { docs } from "@/lib/docs";

export const metadata: Metadata = {
  title: "Docs",
  description: "Field guide, changelog, future ideas and known issues.",
};

// Built from each app's own list rather than from a Markdown file.
const TODOS_PAGE = {
  slug: "todos",
  href: "/docs/todos",
  title: "To-do list",
  description: "Possible improvements to every app, gathered in one place.",
};

export default function DocsPage() {
  return (
    <div className="max-w-3xl">
      <PageHeader title="Docs" description="The same files that live in the repo, published here." />
      <ul className="divide-y divide-line rounded-xl border border-line bg-panel">
        {[...docs.map((doc) => ({ ...doc, href: `/docs/${doc.slug}` })), TODOS_PAGE].map((doc) => (
          <li key={doc.slug}>
            <Link
              href={doc.href}
              className="group flex items-center gap-3 px-4 py-2.5 transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-hover"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-ink">{doc.title}</span>
                <span className="block text-[13px] text-muted">{doc.description}</span>
              </span>
              <span aria-hidden className="text-muted transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
