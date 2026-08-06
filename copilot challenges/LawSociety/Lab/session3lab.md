# Session 3 Lab: Agentic Workflows — ADO, Planning Agents, and Azure/SQL Tools

## Lab Overview

This is a participant follow-along lab focused on working across tools and agents instead of a single file:

- Read a real Azure DevOps (ADO) work item, plan the change, implement it, and open a linked pull request.
- Split planning and implementation across two agent roles (planner, then implementer).
- Use the `@azure` agent to check environment status and troubleshoot.
- Use the `@mssql` agent to orient in, diagram, and safely query a live SQL database.

The running feature for Lab Steps 1–3 is the real backlog item **[Issue 3 — Add Due Dates and Time-Zone-Aware Scheduling](https://dev.azure.com/TL-lab/copilot-training/_workitems/edit/3)**. Lab Steps 4 and 5 are standalone skill-building exercises against Azure and SQL resources.

## Learning Outcomes

By the end of this lab, participants will be able to:

- Pull a work item's context directly into chat using the ADO MCP server.
- Separate "what should we build" (planning) from "how do we build it" (implementation) using two agent roles, and reconcile drift between them.
- Create a branch, commit, push, and open a pull request in ADO linked back to its work item.
- Use the `@azure` agent to inventory resources and triage a problem before making any change.
- Use the `@mssql` agent to discover schema, generate a Mermaid ERD, trace dependencies, write joins, and propose a safe schema change.

## Feature Scope

### Due Dates and Time-Zone-Aware Scheduling

- Add a due date to tasks.
- Visually flag overdue tasks in the UI.
- Handle time zones correctly so "overdue" is computed consistently regardless of the viewer's locale.

## User Story

As a user, I want to set a due date on a task and see overdue tasks flagged, so I know what needs attention regardless of what time zone I'm in.

## Acceptance Criteria

- Tasks support an optional due date.
- Due dates are stored and compared in a time-zone-safe way (e.g. UTC internally).
- A task is visually flagged as overdue when its due date has passed and it is not completed.
- Invalid or malformed due dates are rejected with a clear validation error.
- Existing task flows continue to work when no due date is set.
- API responses include the due date and computed overdue status.
- Unit tests cover on-time, overdue, no-due-date, and invalid-date scenarios.

## Prerequisites

- ADO MCP server configured and connected to the `TL-lab/copilot-training` Azure DevOps organization/project.
- Azure MCP server / `@azure` chat participant enabled, signed in to a subscription with at least one resource to inspect.
- MSSQL extension installed, with a connection available to a test database (e.g. `enov8`).
- App dependencies are installed; backend and frontend can run locally.
- You can run the test command for backend and frontend.

## Keep These Files Open

Backend:

- backend/src/index.ts
- backend/src/types.ts
- backend/src/__tests__/api.test.ts

Frontend:

- frontend/src/App.tsx
- frontend/src/types.ts
- frontend/src/components/TaskList.tsx
- frontend/src/components/TaskInput.tsx

---

## Lab Step 1: Read the Work Item and Plan (ADO MCP Server)

Goal:
Pull real work item context into chat and turn it into an implementation plan before any code is written.

Prompt 1 — fetch the work item:

```text
Using the Azure DevOps MCP server, fetch work item 3 (Add Due Dates and Time-Zone-Aware Scheduling) from the copilot-training project. Summarize the title, description, acceptance criteria, and any linked tasks. Do not write any code yet.
```

Prompt 2 — plan against the codebase:

```text
Based on work item 3, identify which files in this repo need to change to satisfy its acceptance criteria. List backend and frontend changes, validation rules, time-zone handling approach, and test scenarios before writing code.
```

Checkpoint:

- You can restate, in your own words, what "done" means for this work item.
- You have a concrete list of impacted files and a time-zone handling approach written down.

---

## Lab Step 2: Planner → Implementer Handoff

Goal:
Practice separating the planning phase from the implementation phase using two agent roles, so the plan gets reviewed before code exists.

### 2A) Ask the feature planner agent for an outline

```text
Act as a feature planner. Produce a structured implementation plan (not code) for work item 3: adding a due date to tasks, with overdue tasks visually flagged in the UI, handled in a time-zone-safe way.
Include:
1. Data model changes (backend and frontend types)
2. API contract changes
3. Validation rules (invalid or malformed dates)
4. Time-zone handling approach
5. UI/UX behavior (input, display, overdue styling)
6. Test scenarios to cover
7. Risks or open questions
Do not write implementation code.
```

What to check before moving on:

- Is the plan a clear, numbered list of decisions — not code?
- Does it explicitly resolve at least one open question (e.g. "are past due dates allowed on creation?") before you proceed?

### 2B) Hand the plan to the implementer agent

```text
Here is the approved feature plan for work item 3 (due dates on tasks):
[paste the planner agent's output]

Implement this plan exactly as written. Use existing project patterns in backend/src/index.ts and frontend/src/components/TaskList.tsx, do not introduce new libraries, and add Jest tests for every test scenario listed in the plan. Flag any deviation from the plan before making it.
```

### 2C) Reconcile plan vs. implementation

```text
Compare what was implemented against the original plan. List any items from the plan that were not implemented, and any implementation details that were not in the plan.
```

Checkpoint:

- Implementation matches the reviewed plan (or deviations are explicitly called out and justified).
- Tests exist for every scenario listed in the plan.

---

## Lab Step 3: Open a Linked Pull Request in ADO

Goal:
Close the loop from work item to a reviewable, traceable pull request without leaving the editor.

Prompt 1 — branch, commit, and open the PR:

```text
Create a branch for work item 3, commit the changes with a message referencing "AB#3", push the branch, and use the Azure DevOps MCP server to open a pull request in the ado repo targeting main. Include a PR description with what changed, why, and how it was tested, and link it to work item 3.
```

Prompt 2 — verify:

```text
Using the Azure DevOps MCP server, show me the pull request I just created for work item 3, including its status, linked work item, and reviewers.
```

Checkpoint:

- A real pull request exists in the ADO repo (not just a local commit).
- The PR is linked to work item 3 and its description explains what/why/testing.

---

## Lab Step 4: Use the `@azure` Agent for Status and Troubleshooting

Goal:
Practice day-2 operations — inventory, health, and root-cause triage — through the `@azure` agent instead of the Azure Portal.

Prompt 1 — inventory / status check:

```text
@azure What resource groups and app services do I have in my current subscription, and what's the running state of each app service?
```

Prompt 2 — health / diagnostics:

```text
@azure Check the health of the App Service hosting the TaskManager backend. Are there any recent deployment failures, restarts, or high error rates I should know about?
```

Prompt 3 — root cause of a specific error:

```text
@azure My App Service is returning 502 errors for the last hour. Pull recent logs and activity, tell me the likely root cause, and suggest a fix. Do not change anything yet.
```

Prompt 4 — apply a safe fix (with confirmation):

```text
@azure Based on that diagnosis, show me the exact CLI or portal steps to fix it, and ask for confirmation before making any change to the resource.
```

Checkpoint:

- You produced a status/health summary without opening the Azure Portal.
- The agent proposed a fix but paused for your confirmation before changing anything.

---

## Lab Step 5: Use the `@mssql` Agent for Realistic Database Work

Goal:
Practice schema orientation, diagramming, dependency tracing, querying, and safe schema-change proposals against a real connected database.

Prerequisite: be connected to a test/dev database (e.g. `enov8`) via the MSSQL extension before this step.

Prompt 1 — understand the schema:

```text
@mssql List the tables in this database and give me a plain-language summary of what each one is likely used for based on its columns.
```

Prompt 2 — explore relationships:

```text
@mssql Show me the foreign key relationships in this database and describe how the main entities connect to each other.
```

Prompt 3 — schema overview (orientation):

```text
@mssql Give me a high-level overview of the enov8 database: table count, the main subject areas, and how they group. Use sys.objects / INFORMATION_SCHEMA only. Keep it to a few bullets.
```

Prompt 4 — Mermaid ERD of the schema:

```text
@mssql Read the foreign keys and primary keys from sys.foreign_keys and INFORMATION_SCHEMA, then generate a Mermaid `erDiagram` of the enov8 schema showing tables, key columns, and their relationships. If there are many tables, scope it to the [dbo] schema and note anything omitted.
```

Prompt 5 — downstream dependencies / impact:

```text
@mssql Trace dependencies using sys.sql_expression_dependencies: list upstream sources it reads from and downstream objects that depend on it. Then render the downstream chain as a Mermaid flowchart. Read-only.
```

Prompt 6 — write a realistic join query:

```text
@mssql Write a query that joins the Tasks table with its related Category and User tables, showing task text, category name, assigned user, and completion status. Limit to the most recent 100 tasks.
```

Prompt 7 — data quality check:

```text
@mssql Check for tasks with a null or empty description, a due date in the past that is still marked incomplete, or duplicate task titles for the same user. Summarize counts for each issue.
```

Prompt 8 — performance / most used queries:

```text
@mssql Using Query Store or sys.dm_exec_query_stats, find the top 10 most executed or most expensive queries against this database and summarize what each one is likely doing.
```

Prompt 9 — safe schema change (do not run without approval):

```text
@mssql Propose (do not run) an ALTER TABLE script to add a nullable "priority" column to the Tasks table with values Low, Medium, High, including a CHECK constraint. Explain the impact on existing rows before I approve running it.
```

Checkpoint:

- You have a schema overview, a Mermaid ERD, and a dependency flowchart generated without hand-writing `sys.*` queries yourself.
- The join query runs correctly using relationships the agent discovered, not ones you supplied.
- The proposed `ALTER TABLE` script was explained and not executed without your explicit approval.

---

## Facilitator Notes

- For Lab Step 1, confirm participants can see work item #3 in ADO before starting; if the MCP server isn't connected, have them paste the work item text manually as a fallback.
- For Lab Step 2, insist participants actually paste the planner's output into the implementer prompt — don't let them skip straight to "implement work item 3", or the point of the handoff is lost.
- For Lab Step 3, remind participants that `AB#3` in the commit message is what creates the ADO linkage — a plain commit message without it will not link automatically.
- For Lab Step 4, if no App Service exists yet, have participants adjust prompts to whatever resource type is available in their subscription.
- For Lab Step 5, seed one known data-quality issue (e.g. a duplicate task title) ahead of time so Prompt 7 has something real to surface.

## Completion Criteria

- Work item 3's acceptance criteria are implemented and covered by tests.
- A pull request exists in ADO, linked to work item 3, with a clear description.
- The planner's plan and the final implementation were reconciled, with any deviations explained.
- An Azure status/health check and a proposed (unapplied) fix were produced using the `@azure` agent.
- A schema overview, Mermaid ERD, dependency flowchart, join query, data-quality check, and a proposed (unapplied) schema change were produced using the `@mssql` agent.
