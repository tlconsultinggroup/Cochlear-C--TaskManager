# MedTask — Advanced GitHub Copilot Challenges

> **How to read this file**
> Each section shows: the **invocation method** (how to trigger it in VS Code),
> the **files used** (what Copilot loads as context), and the **challenge prompt** to paste into chat.
> These challenges are designed for you to **build new features** while exploring the full range of Copilot capabilities.

---

## 1️⃣ Agent Mode — Prompts + Instructions + Skills

> **How to invoke:** Open GitHub Copilot Chat → switch to **Agent mode** (dropdown next to the chat input)
> **What Copilot loads automatically:**
> - `.github/copilot-instructions.md` (global rules)
> - `backend/.github/copilot-instructions.md` (C# rules — active when backend files are open)
> - `frontend/.github/copilot-instructions.md` (React/TS rules — active when frontend files are open)
> - `.github/skills/run-tests/SKILL.md` (test runner skill)

---

### Challenge 1 — Feature Addition (uses prompt file)

> **Prompt file used:** `.github/prompts/new-feature.prompt.md`
> **How to attach:** Type `/` in the chat input → select **new-feature** from the list
> **Goal:** Add a "Notes" field to tasks — a free-text field for extra detail or context.

```
Add a "Notes" optional field (string, max 500 characters) to tasks.
Update the C# Task model, ITaskService and TaskService (no new endpoints — include Notes in the existing POST and PUT),
the frontend Task type in types.ts, and the TaskInput component (a textarea with character count).
Follow every rule in the global and backend/frontend copilot-instructions.md files.
After implementing, generate unit tests for the backend service methods and a Jest test for the TaskInput textarea.
```

---

### Challenge 2 — Code Review (uses prompt file)

> **Prompt file used:** `.github/prompts/code-review.prompt.md`
> **How to attach:** Type `/` → select **code-review**
> **Open these files first** so Copilot has them in context:
> `frontend/src/components/TaskInput.tsx` and `frontend/src/components/TaskList.tsx`

```
Using the code-review prompt file, review TaskInput.tsx and TaskList.tsx.
Assign severity (Critical / High / Medium / Low) to each finding.
Pay special attention to: missing ARIA labels, prop type correctness, useCallback usage,
loading/error state handling, and key props on list items.
Then automatically fix all Critical and High findings.
```

---

### Challenge 3 — Refactor with Instructions

> **How to invoke:** Agent mode — no prompt file needed, instructions auto-apply
> **Copilot uses:** `.github/copilot-instructions.md` + `frontend/.github/copilot-instructions.md`

```
@workspace Refactor the frontend to introduce a custom hook pattern.
Extract all API call logic from App.tsx into a useTasks custom hook in frontend/src/hooks/useTasks.ts.
The hook should expose: tasks, loading, error, addTask, toggleTask, deleteTask.
Update App.tsx to consume the hook.
Follow all rules in the frontend copilot instructions — typed promises, no any, useCallback, full error handling.
```

---

### Challenge 4 — Test Generation (uses skill)

> **How to invoke:** Agent mode — Copilot auto-discovers the skill
> **Skill used:** `.github/skills/run-tests/SKILL.md`
> **Prompt file used:** `.github/prompts/generate-tests.prompt.md`
> **How to attach prompt file:** Type `/` → select **generate-tests**

```
Using the generate-tests prompt file, generate comprehensive unit tests for the TaskList component.
Cover: renders empty state, renders multiple tasks, calls onToggle with correct id,
calls onDelete with correct id, shows completed tasks with correct styling.
After generating, use the run-tests skill to run the suite and confirm all tests pass.
```

---

## 2️⃣ MCP Servers

> **How to invoke:** Agent mode with MCP tools active
> **Setup:** MCP servers are configured in `.vscode/mcp.json`
> **To enable:** Click the **Tools** button in the chat input → confirm the `github` and `medtask-tools` servers are toggled on
> **GitHub MCP requires:** A GitHub PAT — VS Code will prompt for it on first use

---

### Challenge 1 — Jira MCP: Explore and Implement

> **MCP server used:** Jira


```
Using the Jira MCP server, Make changes to a file, fetch the values and use it in your project.
```

---

### Challenge 3 — Custom MCP Tool: Run and Fix Tests

> **MCP server used:** `medtask-tools` (local Node.js server in `.vscode/mcp-tools/`)
> **Tools exposed:** run_frontend_tests · run_backend_tests · run_all_tests · run_single_test_file
> **To verify it's running:** Tools button in chat → confirm `medtask-tools` is listed

```
Using the medtask-tools MCP server, run the full test suite (frontend + backend).
Report the results: how many passed, how many failed, and which tests are failing.
For each failing test, diagnose the root cause and fix the implementation (not the test).
Re-run the suite after each fix to confirm it passes.
At the end, give a summary of all root causes and the fixes applied.
```

---


## 4️⃣ Custom Agents

> **How to invoke:** Open Copilot Chat → click the **agent picker dropdown** (top of chat panel)
> → select the agent by name.
> **Agent files location:** `.github/agents/`

---

### QA Agent (`@qa`)

> **How to invoke:** Select **qa** from the agent dropdown
> **Agent file:** `.github/agents/qa.agent.md`
> **Handoff available:** After QA finishes → click **"Run Compliance Check"** button to hand off to `@compliance`

```
Generate a full regression test suite for the task deletion workflow.
Use the Page Object Model pattern (see frontend/e2e/page-object-tests.spec.ts).
Cover the happy path and these 5 edge cases:
1. Deleting the only remaining task leaves an empty list (show empty state UI)
2. Deleting a completed task
3. Deleting a task immediately after it was toggled complete
4. Rapid delete of multiple tasks in quick succession
5. Delete is cancelled when the user dismisses a confirmation dialog (if one exists)
Reuse any existing helpers from frontend/e2e/helpers/.
```

---

### DevOps Agent (`@devops`)

> **How to invoke:** Select **devops** from the agent dropdown
> **Agent file:** `.github/agents/devops.agent.md`
> **Handoff available:** After DevOps finishes → click **"Run Compliance Check"** button

```
Create a GitHub Actions workflow that enforces code quality on every pull request:
- Runs xUnit backend tests and fails the PR if any test fails
- Runs Jest frontend tests and fails the PR if coverage drops below 80%
- Runs an ESLint check on the frontend and fails on any error
- Runs a dotnet format check on the backend and fails if formatting is inconsistent
- Posts a test summary comment on the PR with pass/fail counts

Follow all pipeline standards in your instructions.
List all required GitHub Secrets and environment variables at the end.
```

---

### Compliance Agent (`@compliance`)

> **How to invoke:** Select **compliance** from the agent dropdown
> **Agent file:** `.github/agents/compliance.agent.md`
> **Best used as:** The final step after any other agent completes work

```
Run a full compliance audit on all files changed in this session.
Check against the full rulebook: TypeScript rules, React rules, C# rules, test rules, security rules.
Pay special attention to:
- Any use of `any` in TypeScript
- Missing error handling in async functions
- Missing ARIA labels on interactive elements
- Hardcoded URLs instead of process.env.REACT_APP_API_URL
- Controller actions missing [Authorize] attributes
Fix every violation you find, then produce the compliance report.
```

---

### Architecture Agent (inline in Agent mode)

> **How to invoke:** Agent mode — no dedicated agent file, use inline persona instruction

```
@workspace You are a software architect reviewing the MedTask codebase.
The team wants to add real-time task updates so all connected users see changes instantly.
Propose a design for adding WebSocket support (using SignalR on the .NET backend and a custom React hook on the frontend).
Output:
1. A proposed folder structure for the new SignalR hub and React hook
2. A sequence diagram (in Mermaid) showing the flow from task update to all connected clients receiving the change
3. The key interface contracts (C# hub interface + TypeScript hook signature)
Do not change any files — produce the design document only.
```

---

### 🤖 Orchestrated Agent Challenge (`@orchestrator` → `@implementer` → `@qa` → `@compliance`)

> **Agent files:** `.github/agents/orchestrator.agent.md` + `.github/agents/implementer.agent.md`
> **How to run this challenge:**
> 1. Open Copilot Chat → select **orchestrator** from the agent dropdown
> 2. Paste the prompt below and send it
> 3. The orchestrator briefs the feature, then click **"🔨 Delegate to Implementer"**
> 4. The implementer builds the feature end-to-end, then clicks **"Done — return to Orchestrator to verify"**
> 5. The orchestrator reads the changed files and runs its verification checklist
> 6. Once verified, click **"✅ Verified — Hand off to QA"**
> 7. The QA agent generates unit tests + Playwright E2E tests
> 8. The QA agent clicks **"Run Compliance Check"** → Compliance agent audits and fixes all violations

```
Orchestrate the delivery of this feature:
"Add a progress indicator that shows what percentage of tasks are completed"

Follow your full pipeline:
1. Brief the Implementer:
   - Backend: add a GET /api/tasks/summary endpoint that returns { total: number, completed: number, percentage: number }
   - Frontend: add a ProgressBar component that fetches from /api/tasks/summary and displays a filled progress bar with label "X of Y tasks complete (Z%)"
   - The ProgressBar should update whenever a task is toggled or added
2. Delegate to the Implementer agent
3. When the Implementer returns, verify the implementation using your checklist
4. Only hand off to QA once verification passes
```

---

## 5️⃣ Agent Orchestration / Workflow / Handoff

> **How to invoke:** Select **orchestrator** from the agent dropdown
> **Agent file:** `.github/agents/orchestrator.agent.md`
> **Handoff buttons appear** after each step completes — click to move to the next agent

---

### Challenge 1 — Full Feature Pipeline (Recurring Tasks)

> **Switch to `@orchestrator` agent, then send:**

```
Orchestrate the delivery of the "Recurring Tasks" feature end-to-end.

What to build:
- Backend: add a RecurrenceInterval enum (None, Daily, Weekly, Monthly) to Task.cs
- Backend: update ITaskService/TaskService — when a recurring task is marked complete,
  automatically create a new task with the same title and the next due date calculated from the interval
- Frontend: update types.ts to add recurrenceInterval: 'None' | 'Daily' | 'Weekly' | 'Monthly'
- Frontend: add a RecurrenceBadge component that shows the interval on the task card
- Frontend: update TaskInput to include a recurrence dropdown (default: None)

Follow your full pipeline:
1. Brief the Implementer with exactly what to build
2. Delegate to the Implementer agent
3. When the Implementer returns, verify the implementation using your checklist
4. Hand off to QA once verification passes
```

---

### Challenge 2 — Handoff Pattern (Dark Mode)

> **Start in Agent mode, then follow the handoff chain manually:**
> 1. Send the first prompt below in **Agent mode**
> 2. When backend is done → switch to **Agent mode** again for the frontend prompt
> 3. When frontend is done → switch to `@qa` for tests → then `@compliance` for the audit

```
Act as a frontend engineer.
Implement a dark mode toggle for MedTask:
- Add a ThemeContext in frontend/src/context/ThemeContext.tsx that stores 'light' | 'dark'
- Add a toggle button in App.tsx that switches between modes
- Apply MUI's dark/light theme based on the context value
- Persist the user's preference in localStorage
- Follow all rules in frontend/.github/copilot-instructions.md

When done, summarise the files changed so the next engineer can pick up from here.
```

> **Then switch to `@qa` and send:**
```
The dark mode toggle is complete (ThemeContext + MUI theme switching + localStorage persistence).
Now write tests:
- Jest unit test: ThemeContext defaults to 'light', toggles to 'dark', persists to localStorage
- Playwright E2E test: user clicks the toggle, page switches to dark theme, preference survives a page reload
Follow all rules in frontend/.github/copilot-instructions.md.
Then use the run-tests skill to run the suite and confirm everything passes.
```

---

### Challenge 3 — Review → Fix → Test Workflow

> **Switch to `@compliance` agent, then send:**

```
Orchestrate this workflow on the full frontend/src/components/ directory:
1. Review every component file against the full compliance rulebook
2. Produce a prioritised findings list (Critical → Low)
3. Fix all Critical and High violations in-place
4. Identify which existing Jest tests would now fail due to your changes
5. Update those tests to match the fixed implementation
6. Run the frontend tests using the run-tests skill to confirm everything passes
7. Produce a final summary: what was broken, what was fixed, what tests were updated
```

---

### Challenge 4 — Coding Agent via GitHub Issue (full autonomy)

> **Go to GitHub Issues → create this issue → assign to @copilot**
> The Coding Agent will use `.github/skills/implement-github-issue/SKILL.md` autonomously

```
Title: feat: Task export to CSV and JSON

Allow users to export their task list from MedTask:

Backend:
- GET /api/tasks/export?format=csv — returns all tasks as a CSV file (Content-Type: text/csv)
- GET /api/tasks/export?format=json — returns all tasks as a JSON file download (Content-Disposition: attachment)
- Unit tests: happy path for each format, empty list export, unsupported format returns 400

Frontend:
- ExportButton component with a dropdown: "Export as CSV" / "Export as JSON"
- Triggers the correct backend endpoint and initiates a file download in the browser
- Shows a loading state while the download is preparing
- Jest unit test: ExportButton renders, each option calls the correct endpoint
- Playwright E2E: user clicks "Export as CSV", file download is triggered

Follow .github/skills/implement-github-issue/SKILL.md throughout.
Open a PR with title: "feat: task export to CSV and JSON (closes #N)"
```
