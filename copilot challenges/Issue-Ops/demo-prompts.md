# Issue-Ops Demo — GitLab MCP + Custom Agents

---

## 1. GitLab MCP Configuration

Open `.vscode/mcp.json` and walk through the GitLab MCP server configuration:

```json
"gitlab": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-gitlab"],
  "env": {
    "GITLAB_PERSONAL_ACCESS_TOKEN": "<your-PAT>",
    "GITLAB_HOST": "https://gitlab.com"
  }
}
```

**Key points to explain:**
- The server is launched via `npx` — no manual install needed.
- `GITLAB_PERSONAL_ACCESS_TOKEN` authenticates all MCP calls. The PAT needs `api` scope.
- `GITLAB_HOST` points to gitlab.com (can be changed for self-hosted instances).
- The server starts automatically when VS Code loads — no manual startup needed.
- Once running, Copilot agents can call GitLab MCP tools like `mcp_gitlab_create_issue`, `mcp_gitlab_create_merge_request`, `mcp_gitlab_get_issue`, etc.

---

## 2. Fetch Existing Issues and Rank by Urgency

Use the GitLab MCP to list all open issues in the project and ask Copilot to rank them by urgency of implementation.

**Prompt:**
```
Using the GitLab MCP, list all open issues in vans23/cochlear-c-taskmanager and rank them from most to least urgent based on their title, description, and labels.
```

Copilot will call `mcp_gitlab_list_issues` and return a ranked list with reasoning for each priority.

---

## 3. Feature Planner Agent

The **Feature Planner** agent (`@feature-planner`) automates the journey from a feature idea to a GitLab issue.

### How it works

| Step | What happens |
|------|-------------|
| 1 | Reads and understands the feature request |
| 2 | Explores the codebase — checks `types.ts`, `App.tsx`, components, controllers, services, and tests |
| 3 | Generates `docs/<feature-name>-plan.md` with affected files, implementation steps, and acceptance criteria |
| 4 | Displays the plan and shows an **APPROVE** prompt |
| 5a | On `"approve"` → creates a GitLab issue in `vans23/cochlear-c-taskmanager` via the GitLab MCP (`mcp_gitlab_create_issue`) |
| 5b | On `"revise: <feedback>"` → updates the plan and loops back |

**Models:** Claude Opus 4.5 → GPT-5.2 (fallback)  
**Tools:** `read`, `search`, `edit` + all GitLab MCP tools

### Demo prompt

```
@feature-planner Plan a "Download button to export outstanding tasks as CSV"
```

1. Agent explores the codebase and generates **`docs/download-export-button-plan.md`**
2. Plan is displayed in chat with affected files, implementation steps, and acceptance criteria
3. User manually reviews the plan
4. User writes:
   ```
   approve
   ```
5. Agent calls `mcp_gitlab_create_issue` and creates the issue in GitLab
6. GitLab issue URL is returned ✅

---

## 4. Engineering Agent

The **Engineering** agent (`@Engineering`) picks up a GitLab issue and implements it end-to-end.

### How it works

| Step | What happens |
|------|-------------|
| 1 | Calls `mcp_gitlab_get_issue` with the issue number from the URL. Reads any referenced plan file. |
| 2 | Searches the codebase, builds a todo list, proceeds without waiting for confirmation. |
| 3 | Implements the feature file-by-file following all TypeScript/React/backend rules. |
| 4 | Invokes `#run-tests` / `.github/scripts/run-tests.sh`. Does **not** hand off if any test fails. |
| 5 | Hands off to the **Review** agent once all tests pass. |

### Demo prompt

```
@Engineering https://gitlab.com/vans23/cochlear-c-taskmanager/-/work_items/4
```

---

## 5. Review Agent → Merge Request

The **Review** agent is automatically invoked by the Engineering agent after all tests pass. It performs a structured code review against the project's coding standards.

### How it works

```
@Engineering  →  implements feature + runs tests
      ↓
@Review       →  checks TypeScript, React, backend, security, test coverage
      ↓
   ✅ APPROVED          →  calls mcp_gitlab_create_merge_request → MR created on GitLab
   ⚠️  APPROVED WITH WARNINGS  →  MR created with warnings noted
   ❌ CHANGES REQUIRED  →  sends specific FAIL items back to @Engineering
```

**On approval**, the Review agent calls `mcp_gitlab_create_merge_request` with:
- Source branch → `feature/<kebab-case-name>`
- Target → `main`
- Description → full review report + `Closes #<issue_number>` + test results

---

## Full Pipeline Summary

```
Idea
  ↓
@feature-planner   →  docs/<feature>-plan.md  →  approve  →  GitLab Issue created
                                                                      ↓
@Engineering       →  fetches issue  →  implements  →  tests pass
                                                                      ↓
@Review            →  code review  →  ✅ GitLab MR created  /  ❌ back to Engineering
```
