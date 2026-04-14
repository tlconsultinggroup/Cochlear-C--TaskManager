# 🎬 GitHub Copilot Customization Demo — Case Study

**9 Scenes showcasing Copilot customization features**

Repository: `Cochlear-C--TaskManager` (React + TypeScript + .NET Task Manager)

---

## 📋 Scene 1: Onboarding the Team — Custom Instructions
**Scenario:** A new developer joins and Copilot needs to reflect your team's coding standards immediately.

### Demo flow

1. **Create** `.github/copilot-instructions.md` at the repo root
2. **Include project-wide rules:**
   - Always use TypeScript strict mode
   - Prefer functional components
   - Use async/await (never `.then().catch()`)
   - Never use `any`
   - Follow REST naming conventions in the .NET API
3. **Demo** 
> "Add a new React component called TaskItem that displays a task title and a toggle button to mark it complete."

> "Add new functionality that add a due date feature for each tasks"

## What to show:

- Without instructions → Copilot may generate a class component, use .then().catch(), use any for props, or skip ARIA labels.

- With copilot-instructions.md active → Copilot generates a functional component with React.FC<TaskItemProps>, typed props interface, async/await, ARIA labels, and no any.
- Open File Frontend > src> components > tests > taskInput.tsx
Show them at the top of the file 

> "Always define explicit prop types using a named interface"	- interface TaskInputProps { onAddTask: (title: string, dueDate?: string) => Promise<void>; }

> "Use React.FC<Props>"	                                    -  const TaskInput: React.FC<TaskInputProps> = ...

### What it does
Orients Copilot to the stack and repo layout. Can be:
- **Global Instructions** — workspace-wide
- **Repository Instructions** — project standards
- **Path-Specific Instructions** — advanced (Scene 4)

### 💬 Talking point
*"This is the baseline layer — Copilot learns your team's DNA before a developer writes a single line."*

---

## 🔒 Scene 2: Sensitive Data Enters the Picture — Content Exclusion
**Scenario:** At this point, our project contains sensitive data.
We have local secrets stored in appsettings.Development.json, and proprietary business logic inside the TaskApi folder — both of which we don’t want Copilot to use when generating suggestions.

### Demo flow

1. **Show** Copilot currently suggesting completions based on sensitive connection strings in Backend/TaskAPI/`appsettings.Development.json`
**Demo** that Copilot references or leaks those values in suggestions

>> "What is the database connection string used in this project?"

2. **Open** VS Code settings,json → configure `github.copilot.chat.codebase.excludeFiles` at Line 17
  // ── Content Exclusion ────────────────────────────────────────────────────────
  // Copilot will NOT read, index, or suggest from these files.
  // Protects secrets and reduces noise in @workspace context.
  "github.copilot.chat.codebase.excludeFiles": [
    "**/appsettings*.json",
    "**/bin/**",
    "**/obj/**",
    "**/.env*",
    "**/node_modules/**",
    "**/*.pdb",
    "**/*.deps.json",
    "**/package-lock.json"
  ],

3. **Demo** that Copilot no longer references or leaks those values in suggestions

>> "What is the database connection string used in this project?"

## What to show:

- Before exclusion → Copilot reads appsettings.Development.json and surfaces the actual connection string values in its suggestion.
- After excluding **/appsettings*.json → Copilot responds that it cannot find connection string details and suggests using environment variables instead.

### 💬 Talking point
*"We can't afford accidental data leakage. Content exclusion is your compliance guardrail."*

---

## 📝 Scene 3: Standardizing Feature Work — Prompt Files
**Scenario:** The team frequently implements new API endpoints + React components. You want a repeatable, high-quality pattern for this.

*"Prompt files are like reusable playbooks — when a specific situation comes up, you just pick the right playbook and follow it."*

### Demo flow

**The reusable template** — works for any feature:
1. **Create** `.github/prompts/new-feature.prompt.md` (8-step scaffold with placeholders)
2. **Create** `.github/prompts/add-priority-field.prompt.md` (specific Priority feature)

### How to use them

| Method | Example |
|---|---|
| **Slash command** | Type `/` in chat → VS Code lists your `.prompt.md` files |
| **Attach explicitly** | Click 📎 attach button or type `#new-feature.prompt.md` |
| **Direct invocation** | `Use this prompt to implement a "Priority" field on tasks` |
| **With workspace** | `@workspace Use #add-priority-field.prompt.md to implement the Priority feature` |

Demo:

>> `/add-priority-field.prompt.md Use this prompt to implement a "Priority" field on tasks`

## What to show:

- Open backend/TaskApi/Models/Task.cs file and show side by side
- Step 1: TaskPriority enum in Task.cs	public enum TaskPriority { Low=0, Medium=1, High=2 }   --->  Top of the file
- Step 1: Property with default Medium	public TaskPriority Priority { get; set; } = TaskPriority.Medium;  -----> End of the file around line 18

### What happens behind the scenes

When Copilot runs `add-priority-field.prompt.md`, it **simultaneously respects:**
- ✅ The step-by-step scaffold from `new-feature.prompt.md` (referenced explicitly)
- ✅ The coding rules from `copilot-instructions.md` (always active globally)

### 💬 Talking point
*"Prompt files turn tribal knowledge into a reusable asset. Every developer follows the same scaffold, every time."*

---

## 🗺️ Scene 4: Domain-Specific Behavior — Path-Specific Rules
**Scenario:** The backend (.NET) and frontend (React/TS) need different Copilot behavior. The backend team wants stricter null safety suggestions; the frontend team wants accessibility hints in JSX.

### Demo flow

**Architecture decision:** `.github/copilot-instructions.md` is the ONE global file — GitHub Copilot auto-loads it.

**Two implementation options:**

| Option A: Multiple Prompt Files | Option B: Subfolder Instructions (Auto) |
|---|---|
| Create `.github/prompts/backend-standards.prompt.md` | Place `backend/.github/copilot-instructions.md` |
| Developer attaches explicitly: `@workspace #backend-standards.prompt.md Add a new endpoint` | Copilot applies **automatically** when editing `backend/**` files |

### Rules to demonstrate

- **For `backend/**`**: *"Always use nullable reference types. Add XML doc comments on public methods."*
- **For `frontend/src/components/**`**: *"Always include ARIA labels on interactive elements. Use React.FC with explicit prop types."*

### Demo

1. Backend prompt (open TasksController.cs first):

>> "Add a new endpoint to get a task by ID."

→ Copilot should generate XML doc comments, nullable return types (TodoTask?), NotFound(new { error = "..." }), and file-scoped namespaces — because the backend path rule is active.

2. Frontend prompt (open a file under components first):

>> "Create a new TaskList component that renders a list of tasks."

→ Copilot should generate React.FC<TaskListProps>, ARIA labels (aria-label, role="list"), useCallback on handlers, and a named props interface — because the frontend path rule is active.

### 💬 Talking point
*"One codebase, two very different standards. Path-specific rules let Copilot context-switch automatically."*

---

## 🛠️ Scene 5: Repetitive Expertise on Demand — Agent Skills
**Scenario:** Your QA lead wants Copilot to automatically run tests and interpret results whenever a new component is created.

**Example:** If prompts are one-time instructions, skills.md is like teaching Copilot a habit — whenever a situation comes up, it knows exactly what steps to follow.

### Demo flow — Two approaches for different workflows

####  Approach: `.github/skills/` 

**Files created:**
- `.github/skills/run-tests/SKILL.md` — full runbook + failure pattern table
- `.github/scripts/run-tests.sh` — bash script (works in CI too)

**Demo it:**
1. Run Tests for the Priority field feature added — fix and add missing coverage
2. Coding Agent reads `SKILL.md`, runs `.github/scripts/run-tests.sh`, fixes issues, opens PR

### 💬 Talking point
*"Skills extend what Copilot can do — it's not just a code writer, it becomes an active participant in your CI loop."*

---

## 🔌 Scene 7: Bringing in External Context — Copilot Extensions (MCP)
**Scenario:** The team tracks work in GitHub Issues and wants Copilot to pull live issue data directly into the conversation.

### Demo flow

1. **Reference** the existing `copilot challenges/MCP-Labs/Github-MCP` in your repo
2. **Enable** the GitHub MCP extension (already configured in `.vscode/mcp.json`)
3. **Ask Copilot:**
   > *"What are the open issues in this repo? Which ones are related to the task API?"*
4. **Use** the response to drive the next implementation decision

### Prerequisites
⚠️ **PAT required:** The exposed PAT in `mcp.json` must be revoked and replaced with a new one that has SSO authorisation for `tlconsultinggroup`. Use `${input:githubPat}` with VS Code secret storage.

### 💬 Talking point
*"Extensions make Copilot context-aware of the world outside your editor — issue trackers, docs, observability tools."*

---

## 🛡️ Scene 8: Owning a Vertical — Custom Agents
**Scenario:** Your security lead wants a dedicated "ComplianceAgent" that reviews all PRs for HIPAA-related risks — checking for logging of PHI, unencrypted fields, and missing authorization attributes.

### Demo flow

#### 1. Create the custom agent definition
**File:** `.github/agents/compliance.agent.md`

**Frontmatter:**
```yaml
---
name: compliance
description: HIPAA compliance reviewer
tools:
  - codebase   # read-only — no editFiles or runCommands
  - search
  - fetch
handoffs:
  - label: "🔧 Fix these issues with Copilot"
    agent: copilot
    prompt: "Fix the HIPAA compliance issues..."
    send: false
---
```

**Body:** The 5 HIPAA checks:
1. ✅ Authorization (`[Authorize]`)
2. ✅ PHI Logging
3. ✅ Unencrypted Fields
4. ✅ Hardcoded Credentials
5. ✅ Input Validation

---

#### 2. Demo it live

1. **`Cmd+Shift+P`** → `Developer: Reload Window` (picks up the new agent file)
2. **Open Copilot Chat** → click the **agent dropdown** → select **`compliance`**
3. **Type:** `Review #file:backend/TaskApi/Controllers/TasksController.cs`
4. **Result:** It will **FAIL** on Check 1 (no `[Authorize]`) and **WARN** on Check 5 (no `[MaxLength]` on `CreateTaskRequest`)
5. **Click** **"🔧 Fix these issues with Copilot"** → hands off to `@copilot` with context intact

---

#### 3. What the report shows

```
═══════════════════════════════════════════════════════
  🏥  HIPAA Compliance Report — MedTask
═══════════════════════════════════════════════════════

## Check 1 — Authorization
🔴 FAIL
→ Finding: TasksController has NO [Authorize] attribute
→ File: TasksController.cs · Line 7
→ HIPAA ref: §164.312(a)(1)
→ Remediation: Add [Authorize] to class declaration

## Check 5 — Input Validation
🟡 WARN
→ Finding: CreateTaskRequest.Title has no [MaxLength]
→ File: TasksController.cs · Line 76
→ HIPAA ref: §164.312(c)(1)

  Overall risk level: CRITICAL
═══════════════════════════════════════════════════════
```

### 💬 Talking point
*"Custom agents are specialists. You don't want your security reviews done by a generalist — you want a reviewer who only thinks about compliance."*

---

## 🎯 Scene 9: Putting It All Together — Context Engineering
**Scenario:** The team now wants to optimize how Copilot reasons about large, complex tasks — ensuring it has exactly the right context and nothing that dilutes it.

### Demo flow: Vague vs. Engineered prompts

| ❌ Vague | ✅ Engineered |
|---|---|
| *"Add authentication"* | *"Add JWT bearer authentication to the .NET API using the existing ITaskService pattern. The frontend uses the proxy in setupProxy.js. Add an [Authorize] attribute to all controller methods. Do not modify appsettings.Development.json."* |
| *"Fix the compliance issues"* | *"Add `[Authorize]` to `#file:TasksController.cs` following the pattern in `#file:Program.cs`. Add `[MaxLength(200)]` and `[Required]` to `CreateTaskRequest.Title`. Do not change any endpoint behaviour."* |

---

### Demonstrate using `#file` references

**Instead of:**
> *"Update the task controller and service"*

**Do this:**
> *"Add priority filtering to `#file:TasksController.cs` following the pattern in `#file:ITaskService.cs`. Update the frontend types in `#file:types.ts` to match."*

**Show** how scoping context improves response relevance and reduces hallucination.

---

### The cumulative effect

At this point in the demo, when you ask Copilot to implement a feature, it's respecting **all layers simultaneously:**

1. ✅ **Global instructions** (`.github/copilot-instructions.md`) — TypeScript strict, no `any`, async/await
2. ✅ **Path-specific rules** (`backend/.github/`, `frontend/.github/`) — XML docs for .NET, ARIA labels for React
3. ✅ **Prompt file scaffold** (`new-feature.prompt.md`) — 8-step implementation pattern
4. ✅ **Custom agent persona** (`@compliance`) — security-first review lens
5. ✅ **Skills/tools** (MCP test runner) — automated verification
6. ✅ **Engineered context** (`#file` references) — precisely scoped inputs

### 💬 Talking point
*"Context engineering is the skill that multiplies everything else. The better the context, the better the agent."*

---

## ✅ What's been built in this repo

| Scene | Files Created 
|---|---|---|
| **1. Custom Instructions** | `.github/copilot-instructions.md`<br>`backend/.github/copilot-instructions.md`<br>`frontend/.github/copilot-instructions.md` 
| **2. Content Exclusion** | `.vscode/settings.json` (excludeFiles config) 
| **3. Prompt Files** | `.github/prompts/new-feature.prompt.md`<br>`.github/prompts/add-priority-field.prompt.md` 
| **4. Path-Specific Rules** | 3-file `copilot-instructions.md` architecture 
| **5. Agent Skills** | `.vscode/mcp-tools/index.js` (4 tools)<br>`.vscode/mcp.json`<br>`.github/skills/run-tests/SKILL.md`<br>`.github/scripts/run-tests.sh`<br>`backend/TaskApi.Tests/` (35 passing tests) | ✅ Complete |
| **7. Copilot Extensions** | `.vscode/mcp.json` (GitHub MCP server) | ⚠️ Needs new PAT |
| **8. Custom Agents** | `.github/agents/compliance.agent.md` 
| **9. Context Engineering** | No files — demonstrated through prompting technique 

---

## 🎯 Quick demo checklist

Before presenting, ensure:
- [ ] `Cmd+Shift+P` → `Developer: Reload Window` (loads all customizations)
- [ ] `.vscode/mcp.json` PAT is updated with SSO auth
- [ ] All 35 backend tests pass: `dotnet test backend/TaskApi.Tests`
- [ ] All 15 frontend tests pass: `.github/scripts/run-tests.sh frontend`
- [ ] `@compliance` agent appears in agent dropdown
- [ ] MCP tools load without errors: `node -e "import('.vscode/mcp-tools/index.js')"`

