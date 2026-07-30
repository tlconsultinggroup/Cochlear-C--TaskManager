# MedTask — Advanced GitHub Copilot Demo Prompts

> **How to read this file**
> Each section shows: the **invocation method** (how to trigger it in VS Code),
> the **files used** (what Copilot loads as context), and the **prompt text** to paste into chat.

---

## 1️⃣ Agent Mode — Prompts + Instructions + Skills

> **How to invoke:** Open GitHub Copilot Chat → switch to **Agent mode** (dropdown next to the chat input)
> **What Copilot loads automatically:**
> - `.github/copilot-instructions.md` (global rules)
> - `backend/.github/copilot-instructions.md` (C# rules — active when backend files are open)
> - `frontend/.github/copilot-instructions.md` (React/TS rules — active when frontend files are open)
> - `.github/skills/run-tests/SKILL.md` (test runner skill)

---

### Prompt 1 — Feature Addition (uses prompt file)

> **Prompt file used:** `.github/prompts/add-priority-field.prompt.md`
> **How to attach:** Type `/` in the chat input → select **add-priority-field** from the list
> *(or paste the prompt below directly in Agent mode)*

```
Using the add-priority-field prompt file, add a "Priority" field (Low/Medium/High)
to tasks. Update the model, service, controller and frontend component.
Follow every step in the prompt file in order.
```

---

### Prompt 2 — Code Review (uses prompt file)

> **Prompt file used:** `.github/prompts/code-review.prompt.md`
> **How to attach:** Type `/` → select **code-review**
> **Open these files first** so Copilot has them in context:
> `backend/TaskApi/Controllers/TasksController.cs` and `backend/TaskApi/Services/TaskService.cs`

```
Using the code-review prompt file, review TasksController.cs and TaskService.cs.
Assign severity (Critical / High / Medium / Low) to each finding.
Then automatically fix all Critical and High findings.
```

---

## 2️⃣ MCP Servers

> **How to invoke:** Agent mode with MCP tools active
> **Setup:** MCP servers are configured in `.vscode/mcp.json`
> **To enable:** Click the **Tools** button in the chat input → confirm the `github` and `medtask-tools` servers are toggled on
> **GitHub MCP requires:** A GitHub PAT — VS Code will prompt for it on first use

---

### Prompt 1 — GitHub MCP: Analyse open issues

> **MCP server used:** `github` (configured in `.vscode/mcp.json`)
> **Tools called:** GitHub Issues API via MCP

```
Using the GitHub MCP server, list all open issues in the tlconsultinggroup/TaskManager-Copilot-Lab repo.
Prioritise them by impact (High / Medium / Low).
Then implement the highest-priority issue end-to-end, following the rules in .github/skills/implement-github-issue/SKILL.md.
```

---

### Prompt 2 — GitHub MCP: PR Review

> **MCP server used:** `github`
> **Tools called:** GitHub Pull Requests API via MCP

```
Using the GitHub MCP server, fetch the most recent open pull request in this repo.
Review it against the rules in .github/copilot-instructions.md.
Post inline review comments for any violations found.
```

---

## Github CLI

Lets trying GitHub CLI to interact with GitHub repositories through Github MCP directly from the terminal — allowing me to query issues, pull requests, and repository metadata using structured commands instead of the UI.
### Prompt 1 — GitHub MCP: PR Review

> npm install -g @github/copilot
> copilot -i "list all open issues in this repo"

---

### Prompt 2 — Playwright MCP: PR Review

> **MCP server used:** `Playwright`
> **Prompt**
```
copilot -i "Mock the /api/users endpoint so it returns [{ id: 1, name: 'Test User' }] for all GET requests"

```
---

## 4️⃣ Custom Agents

> **How to invoke:** Open Copilot Chat → click the **agent picker dropdown** (top of chat panel)
> → select the agent by name. Or type `@agent-name` in the chat input.
> **Agent files location:** `.github/agents/`

---

### Compliance Agent (`@compliance`)

> **How to invoke:** Select **compliance** from the agent dropdown
> **Agent file:** `.github/agents/compliance.agent.md`
> **Best used as:** The final step after any other agent completes work
> *(or click the "Run Compliance Check" handoff button from `@qa` or `@devops`)*

```
Run a full compliance audit on all files changed in this session.
Check against the full rulebook: TypeScript rules, React rules, C# rules, test rules, pipeline rules.
Fix every violation you find.
Produce the compliance report at the end.
```

---

### 🤖 Orchestrated Agent Demo (`@orchestrator` → `@implementer` → `@qa` → `@compliance`)

> **Agent files:** `.github/agents/orchestrator.agent.md` + `.github/agents/implementer.agent.md`
> **How to run this demo:**
> 1. Open Copilot Chat → select **orchestrator** from the agent dropdown
> 2. Paste the prompt below and send it
> 3. The orchestrator briefs the feature, then click **"🔨 Delegate to Implementer"**
> 4. The implementer builds the feature end-to-end, then clicks **"Done — return to Orchestrator to verify"**
> 5. The orchestrator reads the changed files and runs its verification checklist
> 6. Once verified, click **"✅ Verified — Hand off to QA"**
> 7. Quinn the QA agent generates unit tests + Playwright E2E tests
> 8. Quinn clicks **"Run Compliance Check"** → Cora audits and fixes all violations

```
Orchestrate the delivery of this feature:
"Add a dropdown to filter tasks by category (Work / Personal / Urgent)"

Follow your full pipeline:
1. Brief the Implementer with exactly what to build (backend + frontend)
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

### Prompt 1 — Full Feature Pipeline (Due Date)

> **Switch to `@orchestrator` agent, then send:**

```
Orchestrate the delivery of the "Task Due Date" feature end-to-end.

What to build:
- Backend: add a DueDate (DateTime?, nullable) property to Task.cs + ITaskService/TaskService
- Backend: no new endpoint needed — DueDate is set/updated via the existing PUT action
- Frontend: update types.ts to add dueDate?: string (ISO 8601)
- Frontend: add a DueDateBadge component that displays the date with overdue highlighting
- Frontend: update TaskInput to accept a date input for due date
- Frontend: update TaskList to display the DueDateBadge on each task

Follow your full pipeline:
1. Brief the Implementer with exactly what to build
2. Delegate to the Implementer agent
3. When the Implementer returns, verify the implementation using your checklist
4. Hand off to QA once verification passes
```

---

### Prompt 2 — Handoff Pattern (Search feature)

> **Start in Agent mode, then follow the handoff chain manually:**
> 1. Send the prompt below in **Agent mode**
> 2. When backend is done → switch to `@qa` agent and send the QA handoff prompt
> 3. When tests are done → switch to `@compliance` and send the compliance prompt

```
Act as a backend engineer.
Implement a task search endpoint: GET /api/tasks?search={query}
- Filter tasks whose title contains the search string (case-insensitive)
- Return empty array (not 404) when no tasks match
- Follow all rules in backend/.github/copilot-instructions.md

When done, summarise the files changed so the next engineer can pick up from here.
```

> **Then switch to `@qa` and send:**
```
The backend search endpoint is complete (GET /api/tasks?search={query}).
Now implement the frontend:
- Add a search bar component with debounced input (300ms) to App.tsx
- Wire it up to the search endpoint
- Follow all rules in frontend/.github/copilot-instructions.md
Then write Playwright E2E tests for the full search flow end-to-end.
```

---

### Prompt 3 — Review → Fix → Test Workflow

> **Switch to `@compliance` agent, then send:**

```
Orchestrate this workflow on TasksController.cs:
1. Review the file against the full compliance rulebook
2. Fix all Critical and High violations in-place
3. Identify which existing tests in TaskApi.Tests would now fail due to your changes
4. Update those tests to match the fixed implementation
5. Run the backend tests using the run-tests skill to confirm everything passes
6. Produce a summary: what was broken, what was fixed, what tests were updated
```

---
