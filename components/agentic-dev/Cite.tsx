import { citationNumber, SOURCES, type SourceId } from "@/lib/agentic-dev/sources";

/** Numbered links to the source list at the bottom of the page. */
export function Cite({ sources }: Readonly<{ sources: SourceId[] }>) {
  return sources.map((id) => (
    <a
      key={id}
      href={`#source-${id}`}
      title={`${SOURCES[id].title} (${SOURCES[id].publisher})`}
      aria-label={`Source ${citationNumber(id)}: ${SOURCES[id].title}`}
      className="ml-0.5 align-super text-[10px] font-medium text-accent no-underline hover:underline"
    >
      [{citationNumber(id)}]
    </a>
  ));
}
