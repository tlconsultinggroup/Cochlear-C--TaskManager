# Session 2 Demo: Task Editing and Completion

## Overview

The full demo stays on one feature only: edit an existing task and mark it complete.

## Scenario

**User story**
As a user, I want to edit an existing task and mark it as completed so my task list stays accurate.

**Acceptance criteria**

- Users can edit task text.
- Empty edited text is rejected.
- Users can mark a task as completed.
- Completing an already completed task is handled safely.
- API and UI behavior are covered by tests.

## Demo Setup

**Keep these files open**

Backend

- backend/src/index.ts
- backend/src/__tests__/api.test.ts

Frontend

- frontend/src/App.tsx
- frontend/src/components/TaskList.tsx
- frontend/src/components/TaskInput.tsx

---

## Scene 1: Understand an Unfamiliar Codebase

**Goal**
Understand current behavior before implementing any new feature.

This is the pre-implementation discovery step. Use this scene to understand what exists today before building the edit feature in Scene 2.

**Open**

- frontend/src/App.tsx
- frontend/src/components/TaskList.tsx
- backend/src/index.ts

**Prompt 1**

```text
Explain the current completion flow and identify where edit functionality should be added. Call out dependencies, side effects, error-handling behavior, and likely implementation gaps. Do not modify any files.
```

**Prompt 2**

```text
Which files need to change to fully support edit task plus completion behavior, and why? Also list required backend and frontend behaviors, validation rules, API contract impacts, and key test scenarios for implementing the edit-task feature in Scene 2.
```

**What to show**

- Quality of flow explanation
- Dependencies and side effects discovered
- Practical file change map

**Takeaway**
Use Copilot to reduce discovery time before implementation.

---

## Scene 2: Prompting Techniques (Same Request, Better Output)

**Goal**
Show why better prompt design gives better implementation quality.

**Feature request to demo**
Add a feature to edit an existing task.

**Open**

- backend/src/index.ts
- backend/src/__tests__/api.test.ts
- frontend/src/components/TaskList.tsx

### Zero-shot

```text
Add a feature to edit existing task.
```

### One-shot

```text
Implement "Edit existing task" in this workspace.
Use the existing API and UI patterns in backend/src/index.ts and frontend/src/components/TaskList.tsx.
Expected behavior:
1. User clicks Edit on a task.
2. Input is prefilled with current text.
3. Save updates task text.
4. Cancel exits edit mode without changes.
5. Empty edited text returns validation error and is not saved.
Add or update Jest tests for successful edit, empty text, and task not found.
Do not add new libraries.
```

### Task decomposition

```text
Step 1: Implement only the frontend edit experience in TaskList (Edit button, prefilled input, Save, Cancel). Do not modify backend yet.
Step 2: Pause and explain what changed in the UI flow and which edge cases are still unhandled.
Step 3: Implement only backend validation/update logic so empty or whitespace-only edits are rejected with a clear validation error.
Step 4: Pause and generate a quick manual verification checklist for UI and API behavior.
Step 5: Generate only tests for successful edit, empty/whitespace edit rejection, and task-not-found.
Step 6: Run relevant tests, summarize results, and list follow-up fixes in priority order.
```

### Clear constraints

```text
Use existing routes and project patterns, do not add new libraries, preserve current API contracts, keep strict TypeScript compatibility, and keep changes minimal and reviewable.
```

**What to highlight**

- Zero-shot is fast but generic.
- One-shot aligns to project style.
- Decomposition improves reviewability.
- Constraints reduce risky suggestions.

**Takeaway**
Clear context plus constraints beats vague prompting.

---

## Scene 3: Generate Tests and Improve Coverage

**Goal**
Generate useful tests quickly and improve edge-case coverage.

**Open**

- backend/src/__tests__/api.test.ts
- frontend/src/components/__tests__/TaskList.test.tsx

**Main prompt**

```text
Generate Jest tests for edit and completion behavior using existing conventions. Cover successful edit, empty edit rejection, task not found, successful completion, and repeated completion handling. Do not modify implementation.
```

**Coverage-gap prompt**

```text
Before generating more tests, list important behaviors that remain untested.
```

**What to show**

- Does style match existing tests?
- Are assertions behavior-focused?
- Which edge cases were missed initially?

**Takeaway**
Copilot speeds up test writing, engineers define correctness.

---

## Scene 4: Diagnose and Fix a Failing Test

**Goal**
Show an end-to-end debug workflow in a simple, realistic defect.

**Defect to demo**
Editing a task with only spaces is saved instead of rejected.

**Open**

- backend/src/index.ts
- backend/src/__tests__/api.test.ts
- test output terminal

**Analysis prompt (Ask mode)**

```text
Explain why this test fails: editing a task with whitespace should return validation error but currently succeeds. Identify likely root cause and file to change first. Do not change code yet.
```

**Fix prompt (Agent mode)**

```text
Apply the smallest safe fix so whitespace-only edits are rejected. Preserve API behavior, add one regression test, and run relevant tests.
```

**What to show**

- Root-cause explanation
- Minimal code change
- Regression test added

**Takeaway**
Reproduce, understand, fix, test, prevent recurrence.

---

## Scene 5: Refactor Safely (Simplest Useful Example)

**Goal**
Show a refactor that is easy to understand and clearly safe.

**Simple use case**
Extract duplicated "edited text" validation into one helper function used by edit logic.

**Open**

- backend/src/index.ts
- frontend/src/components/TaskList.tsx

**Refactor prompt**

```text
Refactor only the edit-task validation logic by extracting a single helper function to remove duplication. Do not change route contracts or response shapes. Keep behavior identical and run relevant tests after refactor.
```

**Diff explanation prompt**

```text
Summarize what changed, why maintainability improved, and what trade-offs remain.
```

**What to show**

- One small refactor
- No behavior change
- Tests still passing

**Takeaway**
Copilot reduces mechanical refactor effort while engineers keep control of behavior.

---

## Scene 6: Review and Documentation

**Goal**
Close the quality loop with review findings and documentation updates.

**Open**

- local uncommitted changes
- README.md

**Review prompt**

```text
Review my uncommitted changes. Focus on correctness, security, error handling, maintainability, and missing tests. Categorize findings as blocker, important, or suggestion.
```

**PR description prompt**

```text
Draft a pull request description containing:
- What changed
- Why it changed
- Testing performed
- Risks and reviewer focus areas
- Related requirement or story reference
```

**README prompt**

```text
Update README for task editing and completion behavior, request/response examples, and local test commands. Document only behavior that exists in implementation.
```

**What to show**

- Severity-based feedback
- Reviewer-ready PR summary
- Docs aligned to implementation

**Takeaway**
Shipping quality includes code, tests, review, and documentation.

---

## Pre-Session Checklist

- Confirm backend and frontend startup commands work.
- Confirm the port values used in live demo.
- Keep one failing test prepared for Scene 4.
- Keep one stale README area prepared for Scene 6.

## Closing Script

In one compact scenario, Copilot helped with:

- Better prompting
- Faster codebase understanding
- Test generation
- Debugging
- Refactoring
- Review and documentation

Engineering judgment remained the control point at every stage.
