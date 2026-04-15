# Generate Tests — MedTask

Use this prompt to generate comprehensive unit and E2E tests for any existing feature in the MedTask application.
Specify the component, service, or controller you want to test — Copilot will generate full test coverage following the project's testing standards.

---

## Instructions for Copilot

You are a **senior test engineer** for the MedTask full-stack application.
Generate tests for the target specified below (or for the currently open file if none is specified).

Follow every testing rule in `.github/copilot-instructions.md` and the relevant scoped instructions file.
Work through each section below **in order**. Do not skip sections that apply.

---

## Step 1 — Analyse the target

Before writing any tests:
1. Read the target file completely
2. List every **public method / exported function / rendered behaviour** that needs testing
3. For each, identify: happy path, edge cases, error cases
4. Check existing tests in `__tests__/` or `TaskApi.Tests/` to avoid duplication

---

## Step 2 — Frontend Unit Tests (Jest + React Testing Library)

**Location:** `frontend/src/components/__tests__/[ComponentName].test.tsx`

For every React component, generate tests covering:

### Rendering
- [ ] Renders without crashing with required props
- [ ] Renders the correct text/content for each prop value
- [ ] Renders correctly in each visual state (e.g. completed vs not-completed, each priority level)
- [ ] Does NOT render elements that should be conditionally hidden

### Interaction
- [ ] Clicking a button calls the correct callback with the correct arguments
- [ ] Changing a select/input calls the correct handler
- [ ] Keyboard interactions work (Enter to submit, Escape to cancel)

### Edge cases
- [ ] Handles empty lists gracefully
- [ ] Handles very long strings without breaking layout (smoke test only)
- [ ] Handles undefined/null optional props

### Query rules (strictly follow this order)
1. `getByRole('button', { name: /label/i })`
2. `getByLabelText('...')`
3. `getByText('...')`
4. `getByTestId('...')` — only if no accessible query works

### Test file template
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import [ComponentName] from '../[ComponentName]';

describe('[ComponentName]', () => {
  const defaultProps = {
    // fill with sensible defaults
  };

  it('renders without crashing', () => {
    render(<[ComponentName] {...defaultProps} />);
    // assert at least one key element is present
  });

  it('calls [callback] with correct args when [action]', async () => {
    const mock[Callback] = jest.fn();
    render(<[ComponentName] {...defaultProps} [callback]={mock[Callback]} />);
    await userEvent.click(screen.getByRole('button', { name: /[label]/i }));
    expect(mock[Callback]).toHaveBeenCalledWith([expectedArgs]);
  });

  // ... more tests
});
```

---

## Step 3 — Backend Unit Tests (xUnit + Moq)

**Location:** `backend/TaskApi.Tests/Services/[Name]Tests.cs` or `Controllers/[Name]Tests.cs`

### Service tests
For each service method, generate:
- [ ] Happy path — returns expected result when task exists
- [ ] Not-found path — returns `null` when task ID does not exist
- [ ] Mutation check — the returned object has the expected new value

### Controller tests
For each controller action, generate:
- [ ] `200 OK` / `201 Created` — success case with correct response body
- [ ] `404 Not Found` — when service returns `null`
- [ ] `400 Bad Request` — when input fails validation (where applicable)

### Test file template
```csharp
using Microsoft.AspNetCore.Mvc;
using Moq;
using TaskApi.Controllers;
using TaskApi.Models;
using TaskApi.Services;
using Xunit;

namespace TaskApi.Tests.Controllers;

public class [Name]Tests
{
    private readonly Mock<ITaskService> _mockService;
    private readonly TasksController _controller;

    public [Name]Tests()
    {
        _mockService = new Mock<ITaskService>();
        _controller = new TasksController(_mockService.Object);
    }

    [Fact]
    public void [MethodName]_Returns[Expected]_When[Condition]()
    {
        // Arrange
        // Act
        // Assert
    }
}
```

---

## Step 4 — E2E Tests (Playwright)

**Location:** `frontend/e2e/[feature-name].spec.ts`

Generate Playwright tests covering the full user journey end-to-end:

- [ ] Happy path: user can complete the feature workflow from start to finish
- [ ] Validation: submitting with invalid/empty input shows an error
- [ ] Persistence: after page refresh, data is still correct (if applicable)
- [ ] Accessibility: the feature can be operated by keyboard only

### Page Object Model rules
- Check `frontend/e2e/helpers/` for existing helper utilities before writing new ones
- Follow the pattern in `frontend/e2e/page-object-tests.spec.ts`
- Each test must be independent — use `beforeEach` to reset state

### E2E template
```typescript
import { test, expect } from '@playwright/test';

test.describe('[Feature] E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // reset state if needed
  });

  test('user can [action] successfully', async ({ page }) => {
    // arrange: navigate / set up state
    // act: interact with the UI
    // assert: verify the outcome
  });
});
```

---

## Checklist before finishing

- [ ] All new test files are in the correct directories
- [ ] No `.only` or `.skip` in any test
- [ ] No `any` types in TypeScript test files
- [ ] No magic strings — use variables for repeated values
- [ ] Run `.github/scripts/run-tests.sh` mentally and confirm all new tests would pass
- [ ] Test descriptions are human-readable sentences ("renders the priority badge as High")
