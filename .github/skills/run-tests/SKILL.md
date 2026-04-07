# Skill: Run and Interpret Tests — MedTask

## Purpose
This skill teaches the Copilot Coding Agent how to run, interpret, and act on
test results for the MedTask full-stack application. Use it whenever an issue
or PR involves failing tests, missing test coverage, or test-related regressions.

---

## Quick-start: use the shared script

A unified test runner script lives at `.github/scripts/run-tests.sh`.
Prefer this over raw commands — it handles CI flags, JSON output, and graceful
backend fallback automatically.

```bash
# Run everything
.github/scripts/run-tests.sh

# Frontend only
.github/scripts/run-tests.sh frontend

# Backend only
.github/scripts/run-tests.sh backend

# Single file match (faster iteration)
.github/scripts/run-tests.sh file TaskInput
```

Exit codes: `0` = all passed · `1` = failures found · `2` = invalid usage

---

## When to use this skill

Apply this skill when:
- A GitHub Issue reports that tests are failing
- You have made changes to frontend components or backend services and need to verify nothing is broken
- An issue asks you to "fix the failing tests" or "add tests for X"
- A PR review comment notes missing test coverage

---

## Project test structure

```
frontend/
  src/components/__tests__/    ← Jest + React Testing Library unit tests
    TaskInput.test.tsx
    TaskList.test.tsx
    VoiceInput.test.tsx
    [ComponentName].test.tsx   ← every component must have one
  e2e/                         ← Playwright end-to-end tests (not run by this skill)

backend/
  TaskApi.Tests/               ← xUnit unit tests (C#) — net9.0, Moq, MVC Testing
    Services/
      TaskServiceTests.cs      ← 23 tests covering all ITaskService methods
    Controllers/
      TasksControllerTests.cs  ← 12 tests covering all HTTP verbs (200/201/400/404)
```

---

## How to run the tests

### Frontend — full suite
```bash
cd frontend && CI=true npm test -- --watchAll=false --forceExit
```

### Frontend — single file (faster, targeted)
```bash
cd frontend && CI=true npm test -- --testPathPattern="PriorityBadge.test.tsx" --watchAll=false
```

### Frontend — with JSON output (for programmatic parsing)
```bash
cd frontend && CI=true npm test -- --watchAll=false --json --forceExit > /tmp/jest-results.json
cat /tmp/jest-results.json | python3 -c "
import json,sys
r=json.load(sys.stdin)
print(f'Total: {r[\"numTotalTests\"]} | Passed: {r[\"numPassedTests\"]} | Failed: {r[\"numFailedTests\"]}')
for s in r['testResults']:
    if s['status']=='failed':
        for t in s['testResults']:
            if t['status']=='failed':
                print(f'  FAIL: {t[\"fullName\"]}')
                print(f'    {t[\"failureMessages\"][0].split(chr(10))[0]}')
"
```

### Backend — full suite
```bash
dotnet test backend/TaskApi.Tests --logger "console;verbosity=normal"
```

### Backend — single test class
```bash
dotnet test backend/TaskApi.Tests --filter "ClassName=TaskServiceTests" --logger "console;verbosity=normal"
```

### Both — sequential full-stack check
```bash
cd frontend && CI=true npm test -- --watchAll=false --forceExit && cd .. && dotnet test backend/TaskApi.Tests --logger "console;verbosity=normal"
```

---

## How to interpret frontend (Jest) failures

### Common failure patterns and root causes

| Failure message | Root cause | Where to look |
|---|---|---|
| `Unable to find role="..."` | Missing ARIA `role` attribute on element | Component JSX — check the root container |
| `Unable to find an accessible element with the role "button" and name "..."` | `aria-label` is wrong or missing | The specific `<button>` element |
| `Expected 2 arguments but got 1` | Callback prop signature mismatch | Props interface + where `onAddTask` / `onDelete` is called |
| `Cannot read properties of undefined (reading 'id')` | Component rendered without required props in test | Test's `render()` call — check mock data |
| `Warning: An update to ... inside a test was not wrapped in act(...)` | State update not awaited | Wrap the interaction in `await act(async () => { ... })` |
| `expect(element).toBeInTheDocument()` failed | Element not rendered | Check conditional rendering logic in the component |

### Query priority (always use in this order — never deviate)
1. `getByRole('button', { name: /delete/i })` — preferred
2. `getByLabelText('Task priority')`
3. `getByText('High')`
4. `getByTestId('...')` — last resort only

---

## How to interpret backend (.NET/xUnit) failures

| Failure message | Root cause |
|---|---|
| `NullReferenceException` | Missing null check — add `if (task == null) return null;` |
| `Assert.Equal(expected, actual)` mismatch | Service method returns wrong value — check the mutation logic |
| `Xunit.Sdk.ThrowsException` | Expected exception not thrown — check guard clause in controller |
| Build error before tests run | Compilation error — fix C# errors first with `dotnet build` |

---

## How to fix test failures

### Step-by-step process
1. Run `.github/scripts/run-tests.sh` to get a baseline count of failures
2. For each failing test, **read the test file first** to understand what behaviour is expected
3. Compare test expectations against the actual component/service implementation
4. **Fix the component or service** (preferred) unless the test expectation is genuinely wrong
5. Re-run targeted: `.github/scripts/run-tests.sh file [ComponentName]`
6. Run the full suite again to ensure no regressions were introduced
7. Commit with message format: `fix(tests): [describe what was broken]`

### Frontend fix checklist
- [ ] Every `<button>` has `aria-label` or visible text that matches the test query
- [ ] Every `<input>` and `<select>` has `aria-label`
- [ ] Every callback passed as a prop matches the expected signature (number of arguments, types)
- [ ] No `any` types introduced — fix TypeScript errors properly
- [ ] Test queries use `getByRole` / `getByLabelText` — never `getByTestId` unless no other option

### Backend fix checklist
- [ ] Nullable reference types annotated (`TodoTask?` not `TodoTask`)
- [ ] Guard clauses return `null` (not throw) when task is not found
- [ ] Service methods are pure — no side effects beyond modifying `_tasks`
- [ ] XML doc comments on all public methods

---

## PR description template (include in every PR that touches tests)

```markdown
## Test Results

### Before this change
- Frontend: X passing, Y failing
- Backend:  X passing, Y failing (or "no test project")

### After this change
- Frontend: ✅ X passing, 0 failing
- Backend:  ✅ X passing, 0 failing

### What was fixed
- [Describe what was broken and how you fixed it]

### Skill used
This PR was guided by `.github/skills/run-tests/SKILL.md`
```

---

## Project-specific rules (always follow these)
- **Never** use `any` in TypeScript — fix the type, don't suppress it
- **Never** use array index as a `key` prop in React lists
- **Never** use `getByTestId` unless no accessible query works
- Every new component in `frontend/src/components/` **must** have a matching test file
- Every new public service method in `backend/TaskApi/Services/` **must** have a unit test
