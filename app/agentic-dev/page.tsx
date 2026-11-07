import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cite } from "@/components/agentic-dev/Cite";
import { Ladder } from "@/components/agentic-dev/Ladder";
import { LoopCheck } from "@/components/agentic-dev/LoopCheck";
import { MetrChart } from "@/components/agentic-dev/MetrChart";
import { ToolPicker } from "@/components/agentic-dev/ToolPicker";
import { TodoCards } from "@/components/TodoCards";
import { LAST_CHECKED, NEWS, PLAYBOOK, REALITY_CHECKS, STACK, TOOLS } from "@/lib/agentic-dev/content";
import { citationNumber, SOURCE_IDS, SOURCES } from "@/lib/agentic-dev/sources";
import { todos } from "@/lib/agentic-dev/todos";

export const metadata: Metadata = {
  title: "Agentic Dev",
  description: "What's new in agentic development: harnesses, loops, recommended tools and the evidence behind them.",
};

const NAV = [
  ["new", "New"],
  ["ladder", "How we got here"],
  ["reality", "Reality check"],
  ["playbook", "Playbook"],
  ["loop-check", "Check your loop"],
  ["tools", "Tools"],
  ["sources", "Sources"],
];

function Section({
  id,
  title,
  intro,
  children,
}: Readonly<{ id: string; title: string; intro?: string; children: ReactNode }>) {
  return (
    <section id={id} className="scroll-mt-16 md:scroll-mt-14">
      <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
      {intro && <p className="mt-0.5 mb-3 max-w-2xl text-sm text-muted">{intro}</p>}
      {!intro && <div className="mb-3" />}
      {children}
    </section>
  );
}

export default function AgenticDevPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="rounded-xl border border-line bg-accent-soft p-5">
        <p className="text-xs font-medium text-accent">Last checked {LAST_CHECKED}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">
          Stop prompting. Start building the thing that prompts.
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink">
          Loops and harnesses are still the big ideas, but they&apos;ve moved from blog posts into
          shipped products. What&apos;s new is the pushback: researchers are now asking for proof,
          and much of it doesn&apos;t exist yet.
          <Cite sources={["loopPaper", "copilotChangelog"]} />
        </p>
      </header>

      <nav
        aria-label="On this page"
        className="sticky top-12 z-[5] -my-4 flex gap-1.5 overflow-x-auto bg-canvas py-2 md:top-0"
      >
        {NAV.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            className="rounded-full border border-line bg-panel px-2.5 py-1 text-xs font-medium whitespace-nowrap text-ink transition-colors hover:bg-hover"
          >
            {label}
          </a>
        ))}
      </nav>

      <Section id="new" title="What's new" intro="The last month, newest first.">
        <ol className="flex flex-col gap-2">
          {NEWS.map((item) => (
            <li
              key={item.title}
              className="grid gap-x-3 rounded-xl border border-line bg-panel p-3 sm:grid-cols-[3.5rem_1fr]"
            >
              <span className="text-xs font-semibold text-accent tabular-nums sm:pt-0.5">{item.date}</span>
              <div>
                <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
                <p className="mt-0.5 text-[13px] leading-snug text-muted">
                  {item.detail}
                  <Cite sources={item.sources} />
                </p>
                <p className="mt-1 text-[13px] leading-snug text-ink">
                  <span className="font-semibold">Why it matters: </span>
                  {item.why}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="ladder"
        title="How we got here"
        intro="Each step moved the developer further from the keyboard. Pick a level to see what the job became."
      >
        <Ladder />
      </Section>

      <Section
        id="reality"
        title="Reality check"
        intro="Common advice against the evidence. Guess first, then open each one to see the verdict."
      >
        <div className="grid gap-2 md:grid-cols-2">
          {REALITY_CHECKS.map((check) => (
            <details key={check.claim} className="group rounded-xl border border-line bg-panel p-3 open:border-accent">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
                &ldquo;{check.claim}&rdquo;
                <span aria-hidden className="text-muted transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <span className="mt-2 inline-block rounded bg-accent-soft px-1.5 py-px text-[11px] font-semibold text-accent">
                {check.verdict}
              </span>
              <p className="mt-1.5 text-[13px] leading-snug text-muted">
                {check.evidence}
                <Cite sources={check.sources} />
              </p>
              <p className="mt-1.5 text-[13px] leading-snug text-ink">
                <span className="font-semibold">So: </span>
                {check.takeaway}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-3">
          <MetrChart />
          <p className="mt-2 text-[13px] leading-snug text-muted">
            The bars show METR&apos;s confidence ranges. Its newer ranges cross zero, and METR calls the
            data &ldquo;an unreliable signal&rdquo;, partly because 30% to 50% of developers skipped tasks
            they didn&apos;t want to do without AI. It still thinks developers are likely faster now
            than in early 2025.
            <Cite sources={["metrUpdate"]} /> In a separate survey, people reported a median 3x speedup
            but only 1.4 to 2x more value, and METR urges skepticism about those numbers.
            <Cite sources={["metrSurvey"]} />
          </p>
        </div>
      </Section>

      <Section id="playbook" title="The playbook" intro="What the sources agree on, whichever tool you use.">
        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PLAYBOOK.map((play, index) => (
            <li key={play.title} className="flex flex-col gap-1 rounded-xl border border-line bg-panel p-3">
              <span aria-hidden className="text-xs font-semibold text-accent tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-sm font-semibold text-ink">{play.title}</h3>
              <p className="text-[13px] leading-snug text-muted">
                {play.detail}
                <Cite sources={play.sources} />
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="loop-check"
        title="Is your loop safe to leave running?"
        intro="Tick what your setup has. This checklist is my own summary of the playbook, not a published standard."
      >
        <LoopCheck />
      </Section>

      <Section
        id="tools"
        title="What tools to use"
        intro="No source I found crowns a reliable winner. Leaderboards conflict, and many come from companies with something to sell, so pick by the job."
      >
        <ToolPicker />
        <p className="mt-2 text-xs leading-snug text-muted">
          Picks follow Faros&apos;s roundup, which is based on forum discussion rather than benchmarks.
          <Cite sources={["faros"]} /> Disclosure: this page was researched and written by Claude, made by
          Anthropic, which also makes Claude Code.
        </p>

        <h3 className="mt-5 text-sm font-semibold text-ink">The five most recommended</h3>
        <div className="mt-2 overflow-x-auto rounded-xl border border-line bg-panel">
          <table className="w-full min-w-[32rem] text-[13px]">
            <thead>
              <tr className="border-b border-line text-left text-xs text-muted">
                <th scope="col" className="px-3 py-2 font-medium">Tool</th>
                <th scope="col" className="px-3 py-2 font-medium">Reviewers like it for</th>
                <th scope="col" className="px-3 py-2 font-medium">Built-in loops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {TOOLS.map((tool) => (
                <tr key={tool.name}>
                  <th scope="row" className="px-3 py-2 text-left font-semibold whitespace-nowrap text-ink">
                    {tool.name}
                  </th>
                  <td className="px-3 py-2 text-muted">{tool.bestFor}</td>
                  <td className="px-3 py-2 text-muted">
                    {tool.loops}
                    <Cite sources={tool.sources} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-5 text-sm font-semibold text-ink">Worth having with any agent</h3>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {STACK.map((piece) => (
            <li key={piece.name} className="rounded-xl border border-line bg-panel p-3">
              <p className="text-sm font-semibold text-ink">{piece.name}</p>
              <p className="mt-0.5 text-[13px] leading-snug text-muted">
                {piece.detail}
                <Cite sources={piece.sources} />
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="sources"
        title="Sources"
        intro="Each one was opened for this page unless its note says otherwise. Vendor and news sources are labeled, so you can weigh them."
      >
        <ol className="flex flex-col divide-y divide-line rounded-xl border border-line bg-panel">
          {SOURCE_IDS.map((id) => {
            const source: { title: string; publisher: string; date?: string; url: string; kind: string; note?: string } =
              SOURCES[id];
            return (
              <li id={`source-${id}`} key={id} className="scroll-mt-16 px-3 py-2 target:bg-accent-soft md:scroll-mt-14">
                <p className="text-[13px] text-ink">
                  <span className="mr-1 text-muted tabular-nums">{citationNumber(id)}.</span>
                  <a href={source.url} target="_blank" rel="noreferrer" className="font-medium text-accent hover:underline">
                    {source.title}
                  </a>
                  <span className="ml-1.5 rounded bg-hover px-1.5 py-px text-[10px] text-muted">{source.kind}</span>
                </p>
                <p className="text-xs text-muted">
                  {source.publisher}
                  {source.date && `, ${source.date}`}
                  {source.note && `. ${source.note}`}
                </p>
              </li>
            );
          })}
        </ol>
        <p className="mt-2 text-xs text-muted">
          Couldn&apos;t be opened, so not cited: OpenAI&apos;s harness engineering post, Bloomberg&apos;s DeepSeek
          report and ADTmag&apos;s loop engineering article.
        </p>
      </Section>

      <TodoCards cards={todos} />
    </div>
  );
}
