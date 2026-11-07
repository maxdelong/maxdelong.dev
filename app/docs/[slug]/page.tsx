import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { docs, findDoc, renderDoc } from "@/lib/docs";

// Docs are read from disk at build time, so unknown slugs are simply a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return docs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const doc = findDoc((await params).slug);
  return doc ? { title: doc.title, description: doc.description } : {};
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const doc = findDoc((await params).slug);
  if (!doc) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/docs" className="mb-3 inline-block text-xs text-muted hover:text-ink">
        ← All docs
      </Link>
      <article className="doc" dangerouslySetInnerHTML={{ __html: renderDoc(doc) }} />
    </div>
  );
}
