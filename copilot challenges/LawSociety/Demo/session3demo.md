# Session 3 Demo: Agentic Workflows — ADO MCP, Feature Planning, and Azure/SQL Agents

## Overview

This demo moves beyond single-file coding prompts and shows Copilot working across tools and agents:

- Picking up a work item from Azure DevOps (ADO) and shipping a pull request for it.
- Splitting planning and implementation across two specialized agents.
- Using the `@azure` agent to check on and troubleshoot Azure resources.
- Using the `@mssql` agent (or MSSQL tools) to explore and query a live SQL database.

Each scene is self-contained. You can run them in any order depending on which integrations are configured in the room (ADO MCP server, Azure MCP server, MSSQL extension).

## Demo Setup

**Prerequisites**

- ADO MCP server configured and connected to the `TL-lab/copilot-training` Azure DevOps organization/project.
- Azure MCP server / `@azure` chat participant enabled, signed in to a subscription with at least one resource to inspect.
- MSSQL extension installed, with a saved connection profile (or server name) to a test database.
- Work item [#3 — Add Due Dates and Time-Zone-Aware Scheduling](https://dev.azure.com/TL-lab/copilot-training/_workitems/edit/3) exists and is unresolved for Scene 1.

**Keep these files open**

Backend

- backend/src/index.ts
- backend/src/__tests__/api.test.ts

Frontend

- frontend/src/App.tsx
- frontend/src/components/TaskList.tsx
- frontend/src/components/TaskInput.tsx

---

## Scene 1: Implement an ADO Work Item End-to-End (ADO MCP Server)

**Goal**

Show Copilot reading a real work item from Azure DevOps, implementing the change, and opening a pull request back into the ADO repo — without leaving the editor.

**Work item for this scene**

[Issue 3 — Add Due Dates and Time-Zone-Aware Scheduling](https://dev.azure.com/TL-lab/copilot-training/_workitems/edit/3)

**Open**

- backend/src/index.ts
- frontend/src/components/TaskList.tsx

**Prompt 1 — Pull in the work item**

```text
Using the Azure DevOps MCP server, fetch work item 3 (Add Due Dates and Time-Zone-Aware Scheduling) from the copilot-training project. Summarize the title, description, acceptance criteria, and any linked tasks. Do not write any code yet.
```

**Prompt 2 — Plan against the codebase**

```text
Based on work item 3, identify which files in this repo need to change to satisfy its acceptance criteria. List backend and frontend changes, validation rules, and test scenarios before writing code.
```

**Prompt 3 — Implement**

```text
Implement the changes required to close ADO work item 3. Use existing project patterns, do not add new libraries, and add or update Jest tests for the new behavior. Keep the change minimal and reviewable.
```

**Prompt 4 — Create the pull request in ADO**

```text
Create a branch for work item 3, commit the changes with a message referencing "AB#3", push the branch, and use the Azure DevOps MCP server to open a pull request in the ado repo targeting main. Include a PR description with what changed, why, and how it was tested, and link it to work item 3.
```

**Prompt 5 — Verify**

```text
Using the Azure DevOps MCP server, show me the pull request I just created for work item 3, including its status, linked work item, and reviewers.
```

**Prompt 6 — Create a new work item from a spec and push it to ADO**

Show that Copilot can go the other direction too: turn a written spec into a real, well-formed ADO work item (not just implement one that already exists).

```text
Using the Azure DevOps MCP server, create a new work item in the copilot-training project with the following details, then show me the created work item's ID and URL:

Type: Issue (or Product Backlog Item/User Story if "Issue" is not a valid type in this project)
Title: Issue 4: Add Task Priorities
Tags: enhancement, backend, frontend, priority: high

Description:
Allow users to assign one of four priority levels to every task:
- Low
- Medium
- High
- Urgent
Priority should be persisted through the API, displayed clearly in the task list, and available as a filtering and sorting option.

Scope:
- Add a priority enum to the backend.
- Add the corresponding priority type to the frontend.
- Assign a default priority to existing and newly created tasks.
- Support priority during task creation and editing.
- Display priority using a visible text label and a non-color indicator such as an icon or badge.
- Add priority filtering.
- Add priority sorting.
- Reject unknown priority values at the API boundary.

Technical Areas:
- Update the shared type definitions in types.ts.
- Update the task model in Task.cs.
- Update request handling in TasksController.cs.
- Update task creation and update logic in TaskService.cs.
- Update the creation form in TaskInput.tsx.
- Update task rendering in TaskList.tsx.

Acceptance Criteria:
- Every task has one valid priority.
- New tasks default to Medium, unless another priority is selected.
- Users can select Low, Medium, High, or Urgent.
- Users can edit a task's priority.
- Priority persists after a page reload.
- Invalid priority values are rejected with a JSON error response.
- Priority is displayed using text and is not communicated by color alone.
- Tasks can be filtered by priority.
- Tasks can be sorted by priority using a deterministic order.
- Existing tasks receive the documented default priority.
- Unit, component, and E2E tests are added.

Dependencies:
This issue can be developed in parallel with Issue 1, but should be completed before Issue 4's filtering and sorting work.
```

**Follow-up prompt — Link and verify**

```text
Link the work item you just created to this repository, and show me its current state, tags, and description as stored in Azure DevOps to confirm it was created correctly.
```

**What to show**

- Work item detail pulled directly into chat context.
- Traceability between the work item, the code diff, and the PR (`AB#3` linking).
- A real PR created in the ADO repo, not just a local commit.
- A brand-new, fully-formed work item (Issue 4) created directly from a pasted spec, with no manual copy-paste into the ADO UI.

**Takeaway**

Copilot can close the loop from "ticket" to "reviewable pull request" using the ADO MCP server, keeping work items and code changes linked automatically — and it works in reverse too, turning a written spec into a properly structured backlog item.

---

## Scene 2: Feature Planner Agent → Implementer Agent Handoff

**Goal**

Demonstrate splitting a feature into a **planning phase** (produced by a planner-focused agent/mode) and an **implementation phase** (handed to an implementer agent), so the plan is reviewed before any code is written.

**Feature to plan and build**

Add the ability to set a due date on a task, with overdue tasks visually flagged in the UI.

**Open**

- backend/src/index.ts
- backend/src/types.ts
- frontend/src/types.ts
- frontend/src/components/TaskList.tsx

**Step 1 — Ask the feature planner agent for an outline**

```text
Act as a feature planner. Produce a structured implementation plan (not code) for adding a due date to tasks, with overdue tasks visually flagged in the UI.
Include:
1. Data model changes (backend and frontend types)
2. API contract changes
3. Validation rules (e.g. invalid or past dates)
4. UI/UX behavior (input, display, overdue styling)
5. Test scenarios to cover
6. Risks or open questions
Do not write implementation code.
```

**What to show**

- The planner agent's output is a clear, numbered plan — no code, just decisions and open questions.
- Call out any open question the plan surfaces (e.g. "should past due dates be allowed on creation?") and decide it live before moving on.

**Step 2 — Hand the plan to the implementer agent**

```text
Here is the approved feature plan for due dates on tasks:
[paste the planner agent's output]

Implement this plan exactly as written. Use existing project patterns in backend/src/index.ts and frontend/src/components/TaskList.tsx, do not introduce new libraries, and add Jest tests for every test scenario listed in the plan. Flag any deviation from the plan before making it.
```

**Step 3 — Reconcile plan vs. implementation**

```text
Compare what was implemented against the original plan. List any items from the plan that were not implemented, and any implementation details that were not in the plan.
```

**What to show**

- The implementer agent building strictly from a reviewed plan rather than improvising.
- The reconciliation step catching drift between plan and code.

**Takeaway**

Separating "what should we build and why" (planner) from "how do we build it" (implementer) produces plans that get reviewed before code exists, and implementations that stay accountable to that plan.

---

## Scene 3: Using the `@azure` Agent for Status and Troubleshooting

**Goal**

Show realistic day-2 operations use cases: checking what's deployed, checking health, and troubleshooting an issue, all through the `@azure` agent instead of the Azure Portal.

**Prompt 1 — Inventory / status check**

```text
@azure What resource groups and app services do I have in my current subscription, and what's the running state of each app service?
```

**Prompt 2 — Health / diagnostics**

```text
@azure Check the health of the App Service hosting the TaskManager backend. Are there any recent deployment failures, restarts, or high error rates I should know about?
```

**Prompt 3 — Root cause of a specific error**

```text
@azure My App Service is returning 502 errors for the last hour. Pull recent logs and activity, tell me the likely root cause, and suggest a fix. Do not change anything yet.
```

**Prompt 4 — Apply a safe fix**

```text
@azure Based on that diagnosis, show me the exact CLI or portal steps to fix it, and ask for confirmation before making any change to the resource.
```

**Prompt 5 — Cost / config sanity check**

```text
@azure Is the App Service plan for TaskManager appropriately sized for its current traffic, and is it configured for zone redundancy or auto-scale?
```

**What to show**

- Getting an environment inventory and health status without opening the Azure Portal.
- The agent proposing a diagnosis and a fix, but pausing for confirmation before changing anything.

**Takeaway**

The `@azure` agent turns "log into the portal and click through blades" into a conversational, auditable troubleshooting workflow — useful for both quick status checks and incident triage.

---

## Scene 4: Using the `@mssql` Agent for Realistic Database Work

**Goal**

Show practical, everyday SQL tasks: understanding a schema, writing a join, checking performance, and validating data quality — all through the `@mssql` agent/MSSQL tools against a real connected database.

**Prerequisite**

Be connected to a test/dev database via the MSSQL extension before this scene.

**Prompt 1 — Understand the schema**

```text
@mssql List the tables in this database and give me a plain-language summary of what each one is likely used for based on its columns.
```

**Prompt 2 — Explore relationships**

```text
@mssql Show me the foreign key relationships in this database and describe how the main entities connect to each other.
```

**Prompt 3 — Schema overview (orientation)**

```text
@mssql Give me a high-level overview of the enov8 database: table count, the main subject areas, and how they group. Use sys.objects / INFORMATION_SCHEMA only. Keep it to a few bullets.
```

**Prompt 4 — Mermaid ERD of the schema**

```text
@mssql Read the foreign keys and primary keys from sys.foreign_keys and INFORMATION_SCHEMA, then generate a Mermaid `erDiagram` of the enov8 schema showing tables, key columns, and their relationships. If there are many tables, scope it to the [dbo] schema and note anything omitted.
```

**Prompt 5 — Downstream dependencies / impact**

```text
@mssql Trace dependencies using sys.sql_expression_dependencies: list upstream sources it reads from and downstream objects that depend on it. Then render the downstream chain as a Mermaid flowchart. Read-only.
```

**Prompt 6 — Write a realistic join query**

```text
@mssql Write a query that joins the Tasks table with its related Category and User tables, showing task text, category name, assigned user, and completion status. Limit to the most recent 100 tasks.
```

**Prompt 7 — Data quality check**

```text
@mssql Check for tasks with a null or empty description, a due date in the past that is still marked incomplete, or duplicate task titles for the same user. Summarize counts for each issue.
```

**Prompt 8 — Performance / most used queries**

```text
@mssql Using Query Store or sys.dm_exec_query_stats, find the top 10 most executed or most expensive queries against this database and summarize what each one is likely doing.
```

**Prompt 9 — Safe schema change**

```text
@mssql Propose (do not run) an ALTER TABLE script to add a nullable "priority" column to the Tasks table with values Low, Medium, High, including a CHECK constraint. Explain the impact on existing rows before I approve running it.
```

**What to show**

- Schema and relationship discovery without manually writing `sys.*` queries.
- A generated Mermaid ERD and dependency flowchart built directly from `sys.foreign_keys` / `sys.sql_expression_dependencies`, not hand-drawn.
- A join query built correctly on the first try using discovered relationships.
- The agent stopping to explain impact before running a schema-altering script.

**Takeaway**

The `@mssql` agent speeds up schema discovery, query writing, and data-quality checks, while still treating destructive or schema-changing operations as something that needs explicit human approval.

---

## Pre-Session Checklist

- Confirm the ADO MCP server is connected to `TL-lab/copilot-training` and [work item #3](https://dev.azure.com/TL-lab/copilot-training/_workitems/edit/3) exists and is unresolved.
- Confirm you have permission to create a branch, open a PR, and create new work items in the target ADO project/repo.
- Confirm the `@azure` agent is signed in to a subscription containing at least one App Service (or adjust prompts to match available resources).
- Confirm an MSSQL connection profile is ready and points to a non-production database.
- Have one "known" data quality issue seeded in the database for Scene 4, Prompt 4 to surface.

## Closing Script

Across four scenes, Copilot showed how it works as more than a single-file code generator:

- Turning an ADO work item directly into a linked, reviewable pull request.
- Separating planning from implementation across two agent roles.
- Checking status and troubleshooting Azure resources conversationally.
- Exploring, querying, and safely proposing changes to a live SQL database.

In every case, Copilot did the legwork — engineers still made the decisions: which plan to approve, which fix to apply, which schema change to run.
