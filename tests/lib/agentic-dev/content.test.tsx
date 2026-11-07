import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Cite } from "@/components/agentic-dev/Cite";
import { LoopCheck } from "@/components/agentic-dev/LoopCheck";
import { ToolPicker } from "@/components/agentic-dev/ToolPicker";
import {
  LEVELS,
  METR_RESULTS,
  NEWS,
  PLAYBOOK,
  REALITY_CHECKS,
  STACK,
  TOOL_CHOICES,
  TOOLS,
} from "@/lib/agentic-dev/content";
import { judgeLoop, LOOP_ITEMS } from "@/lib/agentic-dev/loopCheck";
import { citationNumber, SOURCE_IDS, SOURCES, type SourceId } from "@/lib/agentic-dev/sources";

// Cited directly in the page's own text rather than in the content lists.
const CITED_BY_PAGE: SourceId[] = ["metrUpdate", "metrSurvey", "faros", "loopPaper", "copilotChangelog"];

describe("sources", () => {
  const cited = new Set<SourceId>([
    ...CITED_BY_PAGE,
    ...[...LEVELS, ...NEWS, ...REALITY_CHECKS, ...PLAYBOOK, ...TOOLS, ...STACK].flatMap((item) => item.sources),
  ]);

  it("lists only sources the page actually cites", () => {
    for (const id of SOURCE_IDS) expect(cited.has(id), id).toBe(true);
  });

  it("has unique https links", () => {
    const urls = SOURCE_IDS.map((id) => SOURCES[id].url);
    expect(new Set(urls).size).toBe(urls.length);
    for (const url of urls) expect(url).toMatch(/^https:\/\//);
  });

  it("backs up every news item, reality check and playbook entry", () => {
    for (const item of [...NEWS, ...REALITY_CHECKS, ...PLAYBOOK]) {
      expect(item.sources.length, "title" in item ? item.title : item.claim).toBeGreaterThan(0);
    }
  });

  it("links each citation to its place in the list", () => {
    render(<Cite sources={["fowler"]} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "#source-fowler");
    expect(link).toHaveTextContent(`[${citationNumber("fowler")}]`);
  });
});

describe("METR results", () => {
  it("keeps every estimate inside its range and on the chart's scale", () => {
    for (const { low, estimate, high } of METR_RESULTS) {
      expect(low).toBeLessThanOrEqual(estimate);
      expect(estimate).toBeLessThanOrEqual(high);
      expect(Math.abs(low)).toBeLessThanOrEqual(40);
      expect(Math.abs(high)).toBeLessThanOrEqual(40);
    }
  });
});

describe("judgeLoop", () => {
  const essentials = LOOP_ITEMS.filter((item) => item.essential).map((item) => item.id);
  const optional = LOOP_ITEMS.filter((item) => !item.essential).map((item) => item.id);

  it("starts empty", () => {
    expect(judgeLoop(new Set()).title).toBe("That's not a loop yet");
  });

  it("refuses a polished loop that's missing an essential", () => {
    const verdict = judgeLoop(new Set([...optional, ...essentials.slice(1)]));
    expect(verdict.title).toBe("Don't leave this running alone");
    expect(verdict.missing).toHaveLength(1);
  });

  it("allows a small job once the essentials are covered", () => {
    expect(judgeLoop(new Set(essentials)).title).toBe("Safe to try on a small job");
  });

  it("needs everything to be ready to run", () => {
    expect(judgeLoop(new Set([...essentials, ...optional])).title).toBe("Ready to run");
  });
});

describe("LoopCheck", () => {
  it("updates the verdict as boxes are ticked and unticked", () => {
    render(<LoopCheck />);
    const box = screen.getByRole("checkbox", { name: /Iteration limit/ });

    fireEvent.click(box);
    expect(screen.getByText("Don't leave this running alone")).toBeInTheDocument();
    expect(screen.getByText("1 of 9")).toBeInTheDocument();

    fireEvent.click(box);
    expect(screen.getByText("0 of 9")).toBeInTheDocument();
  });
});

describe("ToolPicker", () => {
  it("only recommends tools that are on the list", () => {
    for (const choice of TOOL_CHOICES) {
      expect(TOOLS.some((tool) => tool.name === choice.pick), choice.pick).toBe(true);
    }
  });

  it("changes its pick with the job", () => {
    render(<ToolPicker />);
    fireEvent.click(screen.getByRole("button", { name: "Stay in my editor all day" }));
    expect(screen.getByText("Cursor")).toBeInTheDocument();
  });
});
