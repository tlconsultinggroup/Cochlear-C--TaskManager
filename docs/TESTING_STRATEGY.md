# Testing Strategy

This document outlines the testing strategy for the React-TypeScript-Demo project, following the **Test Pyramid** approach.

## Test Pyramid Overview

The test pyramid is a testing strategy that organizes tests into layers based on their scope, speed, and quantity:

```
        /\
       /  \      E2E Tests (Few, Slow)
      /----\
     /      \    Integration Tests (Some, Medium)
    /--------\
   /          \  Unit Tests (Many, Fast)
  /____________\
```

### Benefits of the Test Pyramid

1. **Fast Feedback**: More unit tests mean faster test execution
2. **Lower Maintenance**: Unit tests are easier to maintain than E2E tests
3. **Better Isolation**: Issues are easier to identify with focused unit tests
4. **Cost Effective**: Unit tests are cheaper to run and maintain
5. **Better Coverage**: More granular testing at the unit level

## Our Test Distribution

### Unit Tests (Base Layer - Many, Fast)

**Location**: 
- Backend: `backend/src/__tests__/`
- Frontend: `frontend/src/components/__tests__/`, `frontend/src/`

**Characteristics**:
- Run quickly (milliseconds)
- Test individual functions and components in isolation
- No external dependencies (mocked)
- High code coverage

**Coverage**:
- Backend: 1 test suite with 8 tests (API endpoints)
- Frontend: 4 test suites with 15 tests (React components)

**Example**: Testing a single component like `TaskInput` or a utility function

### Integration Tests (Middle Layer - Some, Medium Speed)

**Location**: `backend/e2e/backend.api.spec.ts`

**Characteristics**:
- Test interactions between components/modules
- May involve real API calls (backend only)
- Medium execution time (seconds)
- Verify contracts between layers

**Coverage**:
- Backend API contract tests: 11 tests covering all API endpoints

**Example**: Testing API endpoints with real HTTP requests but without a browser

### E2E Tests (Top Layer - Few, Slow)

**Location**: `frontend/e2e/*.spec.ts`

**Characteristics**:
- Test complete user workflows
- Simulate real user interactions
- Slowest execution (seconds to minutes)
- Most fragile, highest maintenance
- Verify critical user journeys

**Optimized Coverage**:
- `app.spec.ts`: 3 tests for critical user flows
- `integration.spec.ts`: 3 tests for full-stack integration
- `page-object-tests.spec.ts`: 4 tests for complex scenarios with page objects

**Total**: 10 focused E2E tests (reduced from 30+)

## Test Organization

### What to Test Where

| Test Type | What to Test | Example |
|-----------|--------------|---------|
| **Unit** | Individual functions, components | TaskInput validation, button click handlers |
| **Integration** | API contracts, service interactions | POST /tasks returns 201 with task object |
| **E2E** | Complete user workflows | User can add, complete, and delete a task |

### Optimization Changes Made

1. **Removed Redundancy**:
   - Deleted empty test files (`simple-integration.spec.ts`, `frontend-api-integration.spec.ts`)
   - Removed duplicate API tests from frontend (kept in backend)
   
2. **Consolidated Tests**:
   - `app.spec.ts`: Reduced from 8 to 3 tests by combining related scenarios
   - `integration.spec.ts`: Reduced from 5 to 3 tests, focusing on critical integration points
   - `page-object-tests.spec.ts`: Reduced from 12 to 4 tests, keeping complex scenarios

3. **Improved Wait Conditions**:
   - Replaced `waitForTimeout()` with proper `expect().toBeVisible({ timeout })` assertions
   - Added explicit timeout values for reliability
   - Ensured backend starts before frontend in CI

4. **Reduced Browser Testing**:
   - Local development: Chromium only (fastest feedback)
   - CI: Chromium + Firefox (critical coverage)
   - Removed mobile and webkit from default runs (can be enabled as needed)

## Running Tests

### Run All Tests
```bash
# Backend tests
cd backend
npm test              # Unit tests (Jest)
npm run test:e2e      # Integration tests (Playwright)

# Frontend tests
cd frontend
npm test              # Unit tests (Jest)
npm run test:e2e      # E2E tests (Playwright)
```

### Run Specific Test Types
```bash
# Unit tests only (fast)
npm test

# E2E tests with UI (debugging)
npm run test:e2e:ui

# E2E tests headed mode (watch browser)
npm run test:e2e:headed
```

## Test Maintenance Guidelines

### Adding New Tests

1. **Start with Unit Tests**: Always write unit tests first for new features
2. **Add Integration Tests**: If the feature involves API interactions
3. **Add E2E Tests Sparingly**: Only for critical user flows or new major features

### When to Write E2E Tests

✅ **DO write E2E tests for**:
- Critical user journeys (login, checkout, etc.)
- Complex multi-step workflows
- Integration between frontend and backend
- Features that are hard to test in isolation

❌ **DON'T write E2E tests for**:
- Input validation (use unit tests)
- UI component rendering (use unit tests)
- API endpoint behavior (use integration tests)
- Edge cases already covered by unit tests

## Preventing Timing Issues

### Best Practices

1. **Use Proper Wait Conditions**:
   ```typescript
   // ❌ Bad
   await page.waitForTimeout(1000);
   
   // ✅ Good
   await expect(element).toBeVisible({ timeout: 5000 });
   ```

2. **Wait for Network Idle**:
   ```typescript
   await page.goto('/');
   await page.waitForLoadState('networkidle');
   ```

3. **Ensure Servers Start in Order**:
   - Backend must start first
   - Wait for health checks before starting frontend
   - Verify both services are healthy before running tests

4. **Use Proper Selectors**:
   ```typescript
   // ✅ Good - specific, semantic selectors
   page.locator('.task-item__title')
   
   // ❌ Avoid - fragile, generic selectors
   page.locator('div > span')
   ```

## CI/CD Integration

The GitHub Actions workflow ensures:
1. Unit tests run first (fastest feedback)
2. Backend starts and becomes healthy
3. Frontend starts after backend is ready
4. Both services are verified before E2E tests
5. E2E tests run only after everything is ready
6. Logs are captured on failure for debugging

## Success Metrics

- **Unit Tests**: Should cover >80% of code
- **Integration Tests**: Should cover all API endpoints
- **E2E Tests**: Should cover 3-5 critical user flows
- **Test Execution Time**: 
  - Unit: <10 seconds
  - Integration: <30 seconds  
  - E2E: <3 minutes

## Further Reading

- [Testing Pyramid - Martin Fowler](https://martinfowler.com/articles/practical-test-pyramid.html)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Jest Testing Best Practices](https://jestjs.io/docs/api)
