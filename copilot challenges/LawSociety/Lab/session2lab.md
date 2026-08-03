# Session 2 Lab: Task Categories System

## Lab Overview
This is a participant follow-along lab focused on one feature:
Add a category field to tasks across backend, frontend, and tests.

## Learning Outcomes
By the end of this lab, participants will be able to:
- Understand an unfamiliar code path before implementation
- Use zero-shot, one-shot, and decomposition prompts intentionally
- Implement a small full-stack feature with validation
- Generate and improve tests with Copilot
- Diagnose and fix a realistic failing test
- Perform a safe, minimal refactor
- Produce a review summary and PR-ready notes

## Feature Scope
### Task Categories System

#### Add Categories Feature
- Modify the backend to support task categories
- Add a category field to tasks

## User Story
As a user, I want to assign a category to each task so I can organize my tasks by type.

## Acceptance Criteria
- A task supports a category field.
- Allowed categories are work, personal, and urgent.
- Invalid category values are rejected with a validation error.
- Existing task flows continue to work.
- API responses include category.
- UI supports selecting a category when creating a task.
- Category appears in task list.
- Unit tests cover success and failure cases.

## Prerequisites
- App dependencies are installed.
- Backend and frontend can run locally.
- You can run the test command for backend and frontend.

## Keep These Files Open
Backend:
- backend/src/index.ts
- backend/src/__tests__/api.test.ts

Frontend:
- frontend/src/App.tsx
- frontend/src/components/TaskInput.tsx
- frontend/src/components/TaskList.tsx
- frontend/src/types.ts

---

## Lab Step 1: Understand Before Building

Goal:
Identify where category support must be introduced without generating code.

Prompt 1:
```text
Explain the current create-task and list-task flow in this workspace. Identify where a new category field should be added, including data model, request validation, response mapping, and UI state. Do not modify any files.
```

Prompt 2:
```text
For a Task Categories feature, list required backend and frontend behaviors, validation rules, API contract impacts, and key test scenarios. Do not generate code yet.
```

Checkpoint:
- You have a clear list of impacted files.
- You have expected behavior and edge cases written down.

---

## Lab Step 2: Implement with Prompting Techniques

Goal:
Compare output quality across prompting strategies.

### 2A) Zero-shot
```text
Add task category support.
```

What to observe:
- Is category type explicit?
- Are allowed values enforced?
- Does it align to existing project style?

### 2B) One-shot
```text
Implement a Task Categories feature in this workspace.
Use existing API and UI patterns.
Requirements:
1. Add category field to task model and API responses.
2. Allowed category values: work, personal, urgent.
3. On create, reject invalid category with clear validation error.
4. Frontend TaskInput should include a category selector.
5. TaskList should display category beside each task.
6. Preserve current contracts and behavior for non-category fields.
7. Add or update tests for valid and invalid categories.
Do not add new libraries.
```

### 2C) Task decomposition
```text
Step 1: Implement only backend data model and create-task validation for category values.
Step 2: Pause and explain exact API request/response shape changes.
Step 3: Implement only frontend category input in TaskInput and category display in TaskList.
Step 4: Pause and generate a manual verification checklist for UI and API.
Step 5: Generate tests for valid category creation, invalid category rejection, and category rendering.
Step 6: Run relevant tests and summarize remaining gaps in priority order.
```

### 2D) Clear constraints
```text
Keep changes minimal. Reuse existing routes and patterns. Keep strict TypeScript compatibility. Do not add new libraries. Avoid changing unrelated behavior.
```

Checkpoint:
- Category can be set and shown in UI.
- Invalid categories are rejected by backend.

---

## Lab Step 3: Generate Tests and Improve Coverage

Goal:
Use Copilot to generate and improve test coverage for the feature.

Prompt:
```text
Generate Jest tests for Task Categories using existing conventions. Cover successful task creation with each allowed category, invalid category rejection, default behavior if category is omitted, and category presence in list responses. Do not modify implementation.
```

Coverage prompt:
```text
List important category-related behaviors still untested before generating any additional tests.
```

Checkpoint:
- You have tests for success, validation failure, and edge scenarios.

---

## Lab Step 4: Diagnose and Fix a Failing Test

Goal:
Practice root-cause analysis and minimal safe fixes.

Suggested failing case:
API accepts category value "Work" or "misc" when only lowercase work, personal, urgent should be allowed.

Analysis prompt:
```text
Explain this failing category validation test and identify the most likely root cause. Do not change code yet.
```

Fix prompt:
```text
Apply the smallest safe fix so only allowed category values are accepted. Preserve existing API behavior and add one regression test.
```

Checkpoint:
- Failing test now passes.
- Regression test is added.

---

## Lab Step 5: Refactor Safely

Goal:
Perform a tiny maintainability refactor with no behavior changes.

Refactor prompt:
```text
Refactor category validation by extracting one reusable helper function. Do not change route contracts, error structure, or response shape. Keep behavior identical and run relevant tests after refactor.
```

Diff explanation prompt:
```text
Summarize what changed, why it is easier to maintain, and confirm no functional behavior changed.
```

Checkpoint:
- Code is cleaner.
- Tests still pass.

---

## Lab Step 6: Review and Document

Goal:
Close with review quality and clear delivery notes.

Review prompt:
```text
Review my uncommitted changes with focus on correctness, validation robustness, maintainability, and missing tests. Categorize findings as blocker, important, or suggestion.
```

PR description prompt:
```text
Draft a pull request description including:
- What changed
- Why it changed
- Testing performed
- Risks and reviewer focus areas
- Related story reference
```

Documentation prompt:
```text
Update README notes for Task Categories: allowed values, request example, validation behavior, and local test command. Document only implemented behavior.
```

Final checkpoint:
- Review findings addressed or tracked.
- PR summary ready.
- README updates aligned to implementation.

---

## Facilitator Notes
- Encourage participants to compare zero-shot vs one-shot output before accepting code.
- Ask participants to pause at each decomposition step and explain behavior changes in plain language.
- Reinforce that generated tests must validate behavior, not implementation details.

## Completion Criteria
- Category field is implemented in backend and frontend.
- Validation rejects invalid categories.
- Tests cover happy path and failure path.
- Refactor completed with no behavior change.
- Review summary and PR description are ready.
