export type SourceKind = "Study" | "Official" | "Practitioner" | "Vendor" | "News";

export interface Source {
  title: string;
  publisher: string;
  /** As stated by the source. Docs pages usually don't give one. */
  date?: string;
  url: string;
  kind: SourceKind;
  /** Anything a reader should know about how far to trust this. */
  note?: string;
}

/** The order here sets each source's citation number on the page. */
export const SOURCES = {
  loopPaper: {
    title: "Loop Engineering: Building Blocks, Adoption, and Impact",
    publisher: "Lulla, Nersesyan, Mohsenimofidi, Treude and Baltes (arXiv)",
    date: "Aug 2026, updated Oct 22, 2026",
    url: "https://arxiv.org/abs/2608.21884",
    kind: "Study",
    note: "Preprint. The experiment measuring benefits is designed but hasn't been run.",
  },
  ibm: {
    title: "What is loop engineering?",
    publisher: "IBM",
    date: "Jul 17, 2026",
    url: "https://www.ibm.com/think/topics/loop-engineering",
    kind: "Vendor",
    note: "Also promotes IBM's own coding agent.",
  },
  bouchard: {
    title: "Loop Engineering Explained",
    publisher: "Louis-François Bouchard",
    date: "Jun 10, 2026",
    url: "https://www.louisbouchard.ai/loop-engineering/",
    kind: "Practitioner",
  },
  fowler: {
    title: "Harness engineering for coding agent users",
    publisher: "Birgitta Böckeler, on martinfowler.com",
    date: "Apr 2, 2026",
    url: "https://martinfowler.com/articles/harness-engineering.html",
    kind: "Practitioner",
  },
  anthropicHarness: {
    title: "Harness design for long-running application development",
    publisher: "Anthropic",
    date: "Mar 24, 2026",
    url: "https://www.anthropic.com/engineering/harness-design-long-running-apps",
    kind: "Vendor",
    note: "One author's experiments, not a controlled benchmark.",
  },
  harnessStudy: {
    title: "Harness Engineering for Agentic AI Coding Tools: An Exploratory Study",
    publisher: "Galster et al. (arXiv)",
    date: "Jun 30, 2026 version",
    url: "https://arxiv.org/html/2602.14690v5",
    kind: "Study",
    note: "Describes what repos configure. It doesn't measure agent performance.",
  },
  agentsMd: {
    title: "Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?",
    publisher: "Gloaguen et al. (arXiv)",
    date: "Sep 29, 2026 version",
    url: "https://arxiv.org/abs/2602.11988",
    kind: "Study",
    note: "Preprint. Only the abstract was checked for this page.",
  },
  metrUpdate: {
    title: "We are Changing our Developer Productivity Experiment Design",
    publisher: "METR",
    date: "Feb 24, 2026",
    url: "https://metr.org/blog/2026-02-24-uplift-update/",
    kind: "Study",
    note: "METR itself calls the late-2025 numbers an unreliable signal.",
  },
  metrSurvey: {
    title: "Measuring the Self-Reported Impact of Early-2026 AI on Technical Worker Productivity",
    publisher: "METR",
    date: "May 11, 2026",
    url: "https://metr.org/blog/2026-05-11-ai-usage-survey/",
    kind: "Study",
    note: "A convenience sample of 349 people, reporting on themselves.",
  },
  dora: {
    title: "State of AI-assisted Software Development 2025",
    publisher: "DORA",
    date: "2025, the newest listed",
    url: "https://dora.dev/research/2025/dora-report/",
    kind: "Study",
  },
  willison: {
    title: "The lethal trifecta for AI agents",
    publisher: "Simon Willison",
    date: "Jun 16, 2025",
    url: "https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/",
    kind: "Practitioner",
  },
  snyk: {
    title: "ToxicSkills: malicious AI agent skills",
    publisher: "Snyk",
    date: "Feb 5, 2026",
    url: "https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/",
    kind: "Vendor",
    note: "Vendor research that also promotes Snyk's scanners.",
  },
  faros: {
    title: "Best AI coding agents for developers in 2026",
    publisher: "Faros",
    date: "Updated Oct 22, 2026",
    url: "https://www.faros.ai/blog/best-ai-coding-agents-2026",
    kind: "Vendor",
    note: "Based on forum discussion and the authors' networks, not a benchmark.",
  },
  claudeGoal: {
    title: "Claude Code docs: /goal",
    publisher: "Anthropic",
    url: "https://code.claude.com/docs/en/goal",
    kind: "Official",
  },
  claudeSchedule: {
    title: "Claude Code docs: scheduled tasks",
    publisher: "Anthropic",
    url: "https://code.claude.com/docs/en/scheduled-tasks",
    kind: "Official",
  },
  codexGoal: {
    title: "Codex docs: follow goals",
    publisher: "OpenAI",
    url: "https://learn.chatgpt.com/use-cases/follow-goals",
    kind: "Official",
  },
  cursorAutomations: {
    title: "Cursor docs: Automations",
    publisher: "Cursor",
    url: "https://cursor.com/docs/cloud-agent/automations",
    kind: "Official",
  },
  copilotChangelog: {
    title: "GitHub Copilot changelog",
    publisher: "GitHub",
    date: "Checked Nov 6, 2026",
    url: "https://github.blog/changelog/label/copilot/",
    kind: "Official",
  },
  claudeReleases: {
    title: "Claude Code release feed",
    publisher: "Releasebot",
    date: "Checked Nov 6, 2026",
    url: "https://releasebot.io/updates/anthropic/claude-code",
    kind: "News",
    note: "A third-party tracker. Dates are when it first saw each release.",
  },
  herd: {
    title: "Laravel Herd 2: Coding Agents, Workspaces, and Cloud Deploys",
    publisher: "Laravel News",
    date: "Nov 5, 2026",
    url: "https://laravel-news.com/laravel-herd-2",
    kind: "News",
  },
  agentNews: {
    title: "AI agent news this week",
    publisher: "AI Agent Store",
    date: "Checked Nov 6, 2026",
    url: "https://aiagentstore.ai/ai-agent-news/this-week",
    kind: "News",
    note: "The site's own summaries, without links to primary sources.",
  },
  deepseek: {
    title: "DeepSeek Coding Agent Launches to Challenge Anthropic",
    publisher: "Emergent",
    date: "Nov 1, 2026",
    url: "https://emergent.sh/news/deepseek-coding-agent-launches-challenge",
    kind: "News",
    note: "Secondary report. It cites no DeepSeek source or benchmarks.",
  },
  aaif: {
    title: "Linux Foundation announces the Agentic AI Foundation",
    publisher: "Linux Foundation",
    date: "Dec 9, 2025",
    url: "https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation",
    kind: "Official",
  },
  agentSkills: {
    title: "Agent Skills",
    publisher: "agentskills.io",
    url: "https://agentskills.io/",
    kind: "Official",
  },
  ahe: {
    title: "Agentic Harness Engineering",
    publisher: "Authors' repository (GitHub)",
    date: "Paper from Apr 2026",
    url: "https://github.com/china-qijizhifeng/agentic-harness-engineering",
    kind: "Study",
    note: "The authors' own results. Only the repository summary was checked for this page.",
  },
} satisfies Record<string, Source>;

export type SourceId = keyof typeof SOURCES;

export const SOURCE_IDS = Object.keys(SOURCES) as SourceId[];

export function citationNumber(id: SourceId): number {
  return SOURCE_IDS.indexOf(id) + 1;
}
