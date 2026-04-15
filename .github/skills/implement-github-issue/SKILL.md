# Skill: Implement GitHub Issue — MedTask

## Purpose
This skill teaches the Copilot Coding Agent how to take a GitHub Issue from the
MedTask repository and deliver a complete, compliant implementation — including
code, tests, and a properly formatted pull request.

Use this skill whenever an issue is assigned to the Copilot agent or when
a user says something like:
- "Implement issue #42"
- "Work on the open GitHub issues"
- "Pick up the highest-priority issue and implement it"

---

## Prerequisites

The GitHub MCP server must be active (configured in `.vscode/mcp.json`).
The agent can use it to read issues, create branches, and open pull requests.

---

## Step-by-step process

### Step 1 — Read and understand the issue

Using the GitHub MCP server:
1. Fetch the issue details: title, description, labels, and any comments
2. Identify the **acceptance criteria** — look for a checklist or "Done when..." section
3. Identify the **issue type** from labels:
   - `feature` / `enhancement` → use `.github/prompts/new-feature.prompt.md`
   - `bug` → follow the bug-fix process below
   - `test` / `coverage` → use `.github/prompts/generate-tests.prompt.md`
   - `refactor` → follow the refactor process below
4. If the issue is ambiguous, list your assumptions before proceeding

### Step 2 — Plan before coding

Before writing a single line of code:
1. List every file that will need to change
2. Identify any **breaking changes** to existing interfaces
3. Check if there are related issues or PRs that might conflict
4. State your implementation plan in 5–10 bullet points

### Step 3 — Implement

Choose the correct workflow based on issue type:

#### Feature / Enhancement
Follow `.github/prompts/new-feature.prompt.md` step by step:
1. Backend model → service interface → service implementation → controller
2. Frontend types → component → integration in App/TaskList/TaskInput
3. Unit tests → E2E tests

#### Bug Fix
1. **Reproduce first** — write a failing test that demonstrates the bug
2. Identify the root cause (read the relevant service + controller + component)
3. Fix the root cause — not the symptom
4. Verify the test now passes
5. Run the full test suite to check for regressions: `.github/scripts/run-tests.sh`

#### Test Coverage
Follow `.github/prompts/generate-tests.prompt.md` step by step.

#### Refactor
1. Ensure tests exist **before** refactoring — write them if missing
2. Make the refactor
3. Run all tests — zero regressions allowed
4. Update any documentation that references the changed code

### Step 4 — Run the tests

Use the `run-tests` skill:
```bash
.github/scripts/run-tests.sh
```

**All tests must pass before proceeding to Step 5.**
If tests fail, fix them — do not move on with a broken suite.

### Step 5 — Run the compliance check

Use `.github/prompts/compliance-check.prompt.md` to audit all changed files.
Fix every violation before opening a PR.

### Step 6 — Open a Pull Request

Using the GitHub MCP server, create a PR with:

**Branch name:** `feat/issue-[number]-[short-description]` or `fix/issue-[number]-[short-description]`

**PR title:** `[type]: [concise description] (closes #[issue-number])`

**PR body:**
```markdown
## Summary
[2–3 sentences describing what was implemented and why]

## Changes
- [File 1]: [what changed]
- [File 2]: [what changed]

## Test Coverage
- Frontend: [N] new tests added
- Backend: [N] new tests added  
- E2E: [N] new tests added

## Compliance
✅ Compliance check passed — 0 violations

## Test Results
- Frontend: ✅ [N] passing, 0 failing
- Backend:  ✅ [N] passing, 0 failing

Closes #[issue-number]
```

---

## Acceptance criteria checklist (every issue, no exceptions)

Before opening the PR, verify:
- [ ] All acceptance criteria from the issue are met
- [ ] All existing tests still pass
- [ ] New unit tests added (backend + frontend)
- [ ] New E2E test added (at minimum: happy path)
- [ ] No `any` types introduced
- [ ] No `console.log` left in code
- [ ] ARIA labels on all new interactive elements
- [ ] XML doc comments on all new C# public methods
- [ ] PR body follows the template above and includes `Closes #[N]`

---

## Common pitfalls — avoid these

| Pitfall | Prevention |
|---|---|
| Forgetting to update `frontend/src/types.ts` when changing the C# model | Step 5 of `new-feature.prompt.md` |
| Breaking existing tests by changing a callback signature | Read all test files for components you modify |
| Opening a PR without linked issue | Always include `Closes #N` in the PR body |
| Leaving `// TODO` without a follow-up issue | Either implement it or create a new issue |
| Only fixing the symptom of a bug | Always find and fix the root cause |
