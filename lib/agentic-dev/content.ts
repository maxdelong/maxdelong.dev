import type { SourceId } from "./sources";

export const LAST_CHECKED = "November 6, 2026";

export interface Level {
  name: string;
  when: string;
  yourJob: string;
  summary: string;
  example: string;
  sources: SourceId[];
}

/** How the job has moved outward, one layer at a time. */
export const LEVELS: Level[] = [
  {
    name: "Prompt engineering",
    when: "Where most people started",
    yourJob: "Write a better request",
    summary: "You stay in the conversation, and every step waits for your next instruction.",
    example: "\"Fix the login bug. Here's the error.\"",
    sources: [],
  },
  {
    name: "Context engineering",
    when: "Still the most common setup",
    yourJob: "Choose what the agent sees",
    summary:
      "You give the agent project knowledge up front. In one study of 2,853 repos using AI tools, 90.6% had context files, and they were often the only mechanism in use.",
    example: "An AGENTS.md listing the commands and rules the agent can't guess",
    sources: ["harnessStudy"],
  },
  {
    name: "Harness engineering",
    when: "Took off in early 2026",
    yourJob: "Build the system around the model",
    summary:
      "Harness means everything except the model. Guides steer the agent before it acts, and sensors like tests and linters catch problems afterward so it can correct itself.",
    example: "Custom lint rules whose error messages tell the agent how to fix the problem",
    sources: ["fowler"],
  },
  {
    name: "Loop engineering",
    when: "Named in June 2026",
    yourJob: "Build the system that prompts the agent",
    summary:
      "Instead of prompting, you design runs that start on a schedule or an event and repeat until a checkable goal is met. Each run stays bounded by that stop condition.",
    example: "A nightly run that fixes flaky tests and opens a pull request for you to review",
    sources: ["loopPaper", "ibm"],
  },
  {
    name: "Self-improving harnesses?",
    when: "Emerging, and unproven",
    yourJob: "Decide what the system may change about itself",
    summary:
      "The newest experiments let the harness learn from outcomes. Researchers report a harness raising one benchmark pass rate from 69.7% to 77.0% after 10 rounds, and Copilot Automations now advertise learning from results.",
    example: "A loop that reviews its own failed runs and proposes new rules",
    sources: ["ahe", "copilotChangelog"],
  },
];

export interface NewsItem {
  date: string;
  title: string;
  detail: string;
  why: string;
  sources: SourceId[];
}

export const NEWS: NewsItem[] = [
  {
    date: "Nov 5",
    title: "Parallel agents reach everyday dev tools",
    detail:
      "Laravel Herd 2 gives each agent its own workspace: an isolated copy of the site on its own git branch and subdomain.",
    why: "Running several agents safely is becoming a normal product feature, not a hand-built script.",
    sources: ["herd"],
  },
  {
    date: "Nov 3",
    title: "Claude Code can fail closed",
    detail:
      "A new Agent SDK setting, onFailure: \"block\", stops an action if the hook guarding it fails. /schedule also warns when a new cloud task gets connectors you didn't ask for.",
    why: "A guardrail that crashes shouldn't quietly let the action through.",
    sources: ["claudeReleases"],
  },
  {
    date: "Nov 1",
    title: "Agent choice is opening up",
    detail:
      "Android Studio is reported to support more than 40 third-party agents through the open Agent Client Protocol.",
    why: "Your harness matters more when you can swap the agent inside it.",
    sources: ["agentNews"],
  },
  {
    date: "Nov 1",
    title: "DeepSeek targets Claude Code",
    detail: "DeepSeek is reported to have launched an enhanced coding agent, with limited independent validation so far.",
    why: "Worth watching, but too early to recommend.",
    sources: ["deepseek"],
  },
  {
    date: "Oct 28",
    title: "Copilot goes hard on automation",
    detail:
      "GitHub added shared team workflows, cost controls and self-improvement to Copilot Automations, plus Agent Merge, which watches and fixes pull requests in the cloud.",
    why: "Loops are now a shipped feature, with spending controls built in.",
    sources: ["copilotChangelog"],
  },
  {
    date: "Oct 22",
    title: "Researchers look for proof that loops work",
    detail:
      "An updated study found autonomous loops in 217 open-source repos, and says the writing about them offers no systematic evidence of the claimed benefits.",
    why: "Loops may well pay off, but nobody has measured it yet. Measure your own.",
    sources: ["loopPaper"],
  },
  {
    date: "Oct 7",
    title: "Sandboxing keeps spreading",
    detail: "Local sandboxing for GitHub Copilot became generally available.",
    why: "Unattended agents need limits that hold even when the agent is fooled.",
    sources: ["copilotChangelog"],
  },
];

export interface RealityCheck {
  claim: string;
  verdict: "Unproven" | "Mostly false" | "Mixed" | "False" | "It depends";
  evidence: string;
  takeaway: string;
  sources: SourceId[];
}

export const REALITY_CHECKS: RealityCheck[] = [
  {
    claim: "Loops are proven to make you more productive.",
    verdict: "Unproven",
    evidence:
      "The first mining study found loops in 217 of 36,710 repos and no systematic evidence of the claimed benefits. Its controlled experiment hasn't been run yet.",
    takeaway: "Try loops on small, checkable jobs, and measure the result yourself.",
    sources: ["loopPaper"],
  },
  {
    claim: "Every repo needs a big AGENTS.md with a project overview.",
    verdict: "Mostly false",
    evidence:
      "One study found context files don't generally improve success, and raise inference cost by over 20% on average. Repository overviews weren't helpful. Agents do follow the instructions, though.",
    takeaway: "Keep the file short, and include only unusual rules the agent can't work out.",
    sources: ["agentsMd"],
  },
  {
    claim: "An agent can check its own work.",
    verdict: "False",
    evidence:
      "Anthropic found agents \"reliably skew positive when grading their own work\", and that a separate skeptical evaluator was much easier to tune. IBM adds that a checker is \"still just an agent\".",
    takeaway: "Separate the maker from the checker, and keep humans responsible for what ships.",
    sources: ["anthropicHarness", "ibm"],
  },
  {
    claim: "A bigger harness is always better.",
    verdict: "It depends",
    evidence:
      "In one Anthropic experiment, the full harness cost $200 and took 6 hours, against $9 and 20 minutes solo. With a newer model, the evaluator became optional: worth it only for tasks beyond what the model does reliably alone.",
    takeaway: "Start simple. Each part assumes something the model can't do, so recheck after upgrades.",
    sources: ["anthropicHarness"],
  },
  {
    claim: "Agent skills from a marketplace are safe to install.",
    verdict: "False",
    evidence:
      "Snyk scanned 3,984 skills and found critical issues in 13.4%, plus 76 confirmed malicious payloads. This is vendor research, but the risk is real.",
    takeaway: "Read a skill before installing it, as you would any code you run.",
    sources: ["snyk"],
  },
  {
    claim: "AI makes every team faster.",
    verdict: "Mixed",
    evidence:
      "DORA calls AI an amplifier, \"magnifying an organization's existing strengths and weaknesses\". Clean measurements are hard to get, as the chart below shows.",
    takeaway: "Fix slow tests and weak review first, since AI will magnify them too.",
    sources: ["dora"],
  },
];

export interface MetrResult {
  label: string;
  detail: string;
  /** Percent change in task time. Negative means faster with AI. */
  estimate: number;
  low: number;
  high: number;
}

export const METR_RESULTS: MetrResult[] = [
  { label: "Early 2025", detail: "Original study", estimate: 19, low: 2, high: 39 },
  { label: "Late 2025", detail: "10 returning developers", estimate: -18, low: -38, high: 9 },
  { label: "Late 2025", detail: "Newly recruited developers", estimate: -4, low: -15, high: 9 },
];

export interface Play {
  title: string;
  detail: string;
  sources: SourceId[];
}

export const PLAYBOOK: Play[] = [
  {
    title: "Give every loop a trigger and a checkable goal",
    detail: "If a machine can't tell when the work is done, it's not ready to run unattended.",
    sources: ["bouchard", "loopPaper"],
  },
  {
    title: "Install hard brakes first",
    detail: "Set a maximum number of iterations, detect when progress stops, and cap tokens or dollars.",
    sources: ["bouchard"],
  },
  {
    title: "Separate the maker from the checker",
    detail: "Self-grading skews positive, so have a different agent judge the work.",
    sources: ["anthropicHarness"],
  },
  {
    title: "Run cheap checks first",
    detail: "Types, linters and tests are fast and deterministic. Save AI review for what they can't catch.",
    sources: ["fowler"],
  },
  {
    title: "Turn repeat mistakes into rules",
    detail: "When the same problem comes back, improve a guide or a sensor rather than the prompt.",
    sources: ["fowler"],
  },
  {
    title: "Keep state in the repo",
    detail: "\"The model forgets, but the repo does not.\" Most loops the study found didn't commit state files.",
    sources: ["bouchard", "loopPaper"],
  },
  {
    title: "Give parallel agents their own space",
    detail: "Use a git worktree or an isolated workspace, so agents can't overwrite each other's work.",
    sources: ["ibm", "herd"],
  },
  {
    title: "Break the lethal trifecta",
    detail:
      "Private data, untrusted content and a way to send data out are dangerous together. Remove at least one for unattended runs.",
    sources: ["willison"],
  },
  {
    title: "Spend your attention where it counts",
    detail: "The goal isn't to remove humans, but to direct their input where it matters most.",
    sources: ["fowler"],
  },
];

export interface Tool {
  name: string;
  bestFor: string;
  loops: string;
  sources: SourceId[];
}

export const TOOLS: Tool[] = [
  {
    name: "Claude Code",
    bestFor: "Complex reasoning and debugging",
    loops: "/goal for a finish line, /loop for intervals, and cloud scheduled tasks",
    sources: ["faros", "claudeGoal", "claudeSchedule"],
  },
  {
    name: "Codex",
    bestFor: "Autonomous, multi-step tasks",
    loops: "/goal can work for multiple hours, and scheduled tasks are available",
    sources: ["faros", "codexGoal"],
  },
  {
    name: "Cursor",
    bestFor: "Everyday work inside an editor",
    loops: "Automations run cloud agents on schedules or events from GitHub, Slack, Linear and more",
    sources: ["faros", "cursorAutomations"],
  },
  {
    name: "GitHub Copilot",
    bestFor: "Familiar integrations",
    loops: "Automations with cost controls, Agent Merge, and local sandboxing",
    sources: ["faros", "copilotChangelog"],
  },
  {
    name: "Cline",
    bestFor: "Choosing your own models and keeping control",
    loops: "Not checked for this page",
    sources: ["faros"],
  },
];

export interface ToolChoice {
  need: string;
  pick: string;
  why: string;
}

/** The picker's answers. Each `pick` must be a tool's name. */
export const TOOL_CHOICES: ToolChoice[] = [
  {
    need: "A hard bug or a big refactor",
    pick: "Claude Code",
    why: "Faros's roundup of forum reviews recommends it for complex reasoning and debugging.",
  },
  {
    need: "Hand off a task and walk away",
    pick: "Codex",
    why: "Reviewers favor it for autonomous work, and its docs describe /goal running for multiple hours.",
  },
  {
    need: "Stay in my editor all day",
    pick: "Cursor",
    why: "It's the reviewers' pick for everyday editor work, and Automations can handle background jobs.",
  },
  {
    need: "Automate my team's GitHub work",
    pick: "GitHub Copilot",
    why: "It's already where your team works, and recent releases added shared workflows and cost controls.",
  },
  {
    need: "Use whichever model I want",
    pick: "Cline",
    why: "Reviewers recommend it for model choice and control.",
  },
];

export interface StackPiece {
  name: string;
  detail: string;
  sources: SourceId[];
}

/** Worth having whichever agent you pick. */
export const STACK: StackPiece[] = [
  {
    name: "AGENTS.md",
    detail: "A short rules file. It works across tools and is now part of the Linux Foundation's Agentic AI Foundation.",
    sources: ["harnessStudy", "aaif"],
  },
  {
    name: "MCP",
    detail: "The shared way to connect agents to tools and data, also under that foundation.",
    sources: ["aaif"],
  },
  {
    name: "Agent Skills",
    detail: "An open format for reusable instructions. Few repos use it so far, so review what you install.",
    sources: ["agentSkills", "harnessStudy", "snyk"],
  },
  {
    name: "Tests, types and linters",
    detail: "Your fastest, most reliable sensors. They're also what makes a stop condition checkable.",
    sources: ["fowler"],
  },
  {
    name: "Worktrees or workspaces",
    detail: "Isolation for agents running side by side.",
    sources: ["ibm", "herd"],
  },
  {
    name: "A sandbox",
    detail: "Limits what an agent can reach, whatever it's been tricked into trying.",
    sources: ["copilotChangelog", "willison"],
  },
];
