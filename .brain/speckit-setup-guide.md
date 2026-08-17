# Speckit Setup Guide - maxdelong.dev

## Overview
This document provides a walkthrough of the Speckit configuration for the `maxdelong.dev` repository, specifically tailored for the dota-tracker project.

## Project Structure
- **Repository**: maxdelong.dev (Personal website with tools and experiments)
- **Main App**: Next.js + React + TypeScript
- **Key Project**: `apps/dota-tracker/` (Dota 2 Player stats and match analysis)
- **Infrastructure**: Supabase (PostgreSQL) + Vercel hosting

## Speckit Configuration Files

### 1. **Init Options** (`.specify/init-options.json`)
```json
{
  "ai": "copilot",
  "feature_numbering": "sequential",
  "here": true,
  "integration": "copilot",
  "script": "sh",
  "speckit_version": "0.12.4"
}
```
- **AI Engine**: GitHub Copilot
- **Integration**: Copilot-based workflow
- **Feature Numbering**: Sequential numbering for issues/features
- **Script Type**: Shell scripts (sh)
- **Version**: 0.12.4

### 2. **Integration Config** (`.specify/integration.json`)
```json
{
  "version": "0.12.4",
  "integration_state_schema": 1,
  "installed_integrations": ["copilot"],
  "integration_settings": {
    "copilot": {
      "script": "sh",
      "invoke_separator": "."
    }
  },
  "integration": "copilot",
  "default_integration": "copilot"
}
```
- **Default Integration**: Copilot
- **Script Type**: Shell (sh)
- **Invoke Separator**: "." (used in command invocation)

## Speckit Integrations

### Installed Manifests

#### 1. **Speckit Manifest** (`.specify/integrations/speckit.manifest.json`)
Core speckit scripts and templates:
- **Scripts** (`.specify/scripts/bash/`):
  - `check-prerequisites.sh` - Validate environment
  - `common.sh` - Shared utilities
  - `create-new-feature.sh` - Feature creation workflow
  - `setup-plan.sh` - Plan setup
  - `setup-tasks.sh` - Tasks setup

- **Templates** (`.specify/templates/`):
  - `checklist-template.md` - Checklist format
  - `constitution-template.md` - Project constitution/rules
  - `plan-template.md` - Project planning template
  - `spec-template.md` - Specification template
  - `tasks-template.md` - Tasks template

#### 2. **Copilot Manifest** (`.specify/integrations/copilot.manifest.json`)
GitHub Copilot agents and prompts:

**Agents** (`.github/agents/`):
- `speckit.analyze.agent.md` - Analysis agent
- `speckit.clarify.agent.md` - Clarification agent
- `speckit.constitution.agent.md` - Constitution creation agent
- `speckit.implement.agent.md` - Implementation agent
- `speckit.converge.agent.md` - Convergence/review agent
- `speckit.plan.agent.md` - Planning agent
- `speckit.checklist.agent.md` - Checklist agent
- `speckit.specify.agent.md` - Specification agent
- `speckit.tasks.agent.md` - Tasks agent
- `speckit.taskstoissues.agent.md` - Task-to-issue converter agent

**Prompts** (`.github/prompts/`):
- Corresponding prompts for each agent (e.g., `speckit.analyze.prompt.md`)

**VS Code Settings** (`.vscode/settings.json`):
- VS Code integration and configuration

## Speckit Workflow

### Registered Workflows
From `.specify/workflows/workflow-registry.json`:

**Full SDD Cycle** (`speckit`):
- Name: Full SDD Cycle
- Version: 1.0.0
- Description: Runs specify → plan → tasks → implement with review gates
- Flow: **Specify** → **Plan** → **Tasks** → **Implement**

### Workflow Stages

1. **Specify** - Create specification documents
2. **Plan** - Develop project plan
3. **Tasks** - Break down into actionable tasks
4. **Implement** - Execute with review gates

## Key Speckit Scripts

Located in `.specify/scripts/bash/`:

### 1. `check-prerequisites.sh`
Validates that all necessary tools and environment are set up.

### 2. `common.sh`
Provides shared utility functions used across all speckit scripts.

### 3. `create-new-feature.sh`
Workflow for creating and documenting new features.

### 4. `setup-plan.sh`
Initializes project planning documents and structure.

### 5. `setup-tasks.sh`
Sets up task tracking and management.

## Speckit Templates

Located in `.specify/templates/`:

| Template | Purpose |
|----------|---------|
| `spec-template.md` | Define technical specifications |
| `plan-template.md` | Project planning and scope |
| `tasks-template.md` | Individual task breakdown |
| `checklist-template.md` | Progress tracking checklists |
| `constitution-template.md` | Project rules, guidelines, principles |

## Setup Steps for dota-tracker

### Step 1: Understand Prerequisites
Run `check-prerequisites.sh` to validate environment:
```bash
./.specify/scripts/bash/check-prerequisites.sh
```

### Step 2: Define Constitution
Create project constitution documenting:
- Project goals and principles
- Development guidelines
- Code standards for dota-tracker
- Naming conventions
- Architecture decisions

Uses: `constitution-template.md`

### Step 3: Specify Requirements
Create detailed specification for dota-tracker features:
- Player stats tracking
- Match analysis
- API integration with Dota 2 API
- Database schema

Uses: `spec-template.md`

### Step 4: Plan Project
Develop comprehensive project plan:
- Phases and milestones
- Resource allocation
- Timeline
- Risk analysis

Uses: `plan-template.md`

### Step 5: Define Tasks
Break plan into concrete, actionable tasks:
- Individual feature tasks
- Infrastructure tasks
- Integration tasks
- Testing tasks

Uses: `tasks-template.md`

### Step 6: Execute with Checklists
Track progress using checklists:
- Feature completion tracking
- Testing checklist
- Deployment checklist

Uses: `checklist-template.md`

## Copilot Integration

### Available Agents for dota-tracker

| Agent | Purpose |
|-------|---------|
| `clarify` | Clarify requirements and scope |
| `analyze` | Analyze project structure and dependencies |
| `constitute` | Create project constitution |
| `specify` | Write specifications |
| `plan` | Create project plan |
| `tasks` | Generate task breakdown |
| `implement` | Execute implementation with code review |
| `converge` | Convergence and final review |
| `checklist` | Create and manage checklists |
| `taskstoissues` | Convert tasks to GitHub issues |

### Invoking Agents
With the Copilot integration and `.` separator:
```bash
specify.clarify      # Run clarification agent
specify.analyze      # Run analysis agent
specify.specify      # Run specification agent
specify.plan         # Run planning agent
specify.tasks        # Run task generation agent
specify.implement    # Run implementation agent
```

## Dota-Tracker Specific Setup

### Project Context
- **Type**: Dota 2 Player Statistics Tracker
- **Stack**: Next.js, React, TypeScript, Supabase
- **Features**: Player stats, match analysis, historical data
- **API**: Dota 2 public API integration

### Recommended Workflow Order for dota-tracker

1. **Define Constitution**
   - Establish coding standards
   - Define API handling patterns
   - Set up database conventions

2. **Clarify Requirements**
   - What player stats to track?
   - Which match data points matter?
   - Real-time vs. batch updates?

3. **Analyze Current State**
   - Examine existing dota-tracker code
   - Identify dependencies
   - Check Supabase schema

4. **Specify Features**
   - Player profile page spec
   - Match history spec
   - Search functionality spec

5. **Create Plan**
   - Phase 1: Core infrastructure
   - Phase 2: Player stats
   - Phase 3: Match analysis
   - Phase 4: UI/UX polish

6. **Generate Tasks**
   - Backend tasks
   - Frontend tasks
   - Database migration tasks
   - Testing tasks

7. **Implement with Review**
   - Use implement agent for code generation
   - Run tests
   - Code review with converge agent

8. **Convert to Issues**
   - Export tasks as GitHub issues
   - Set up GitHub Projects board
   - Assign to milestones

## Files Reference

**Configuration Files**:
- `.specify/init-options.json` - Speckit initialization
- `.specify/integration.json` - Integration settings

**Scripts**:
- `.specify/scripts/bash/` - All shell scripts

**Templates**:
- `.specify/templates/` - All markdown templates

**Copilot Integration**:
- `.github/agents/` - Copilot agents
- `.github/prompts/` - Copilot prompts
- `.vscode/settings.json` - VS Code config

**Workflow Registry**:
- `.specify/workflows/workflow-registry.json` - Workflow definitions

## Next Steps

1. Review the dota-tracker README: `apps/dota-tracker/README.md`
2. Run prerequisites check
3. Create project constitution
4. Clarify requirements with Copilot
5. Follow the workflow stages above

## Version Information
- **Speckit Version**: 0.12.4
- **Integration**: GitHub Copilot (0.12.4)
- **Last Updated**: 2026-07-03T17:22:09Z
