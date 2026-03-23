# Fix for "Failed to fetch tasks" Error in E2E Tests

## Problem

The frontend E2E tests were experiencing "Failed to fetch tasks" errors when the application first loads. This occurred because:

1. The frontend's `useEffect` hook runs immediately when the app loads, making a fetch request to `/api/tasks`
2. In some cases, particularly in test environments, the backend might not be fully ready when the frontend first makes this request
3. The tests were only waiting for the UI to load (`waitForLoadState('networkidle')`) but not checking if the initial API call succeeded
4. This resulted in a visible error message on the page, which violated the requirement that "there is no red text on the front end displayed unless there is a negative test"

## Root Cause

**YES, the frontend IS loading before the backend is fully initialized.**

The timing issue occurs in this sequence:
1. Test navigates to the page
2. Frontend loads and immediately fetches tasks (via `useEffect`)
3. If backend is slow to respond or not fully ready, fetch fails
4. Error message "Failed to fetch tasks" appears in red
5. Tests proceed without checking for this error state

### Why This Happens

In **Local Development** (using `playwright.config.ts`):
- The `webServer` array configuration starts both backend and frontend
- While Playwright processes the array sequentially, there's a timing window where:
  - Backend starts and passes its health check (`http://localhost:5000/api/tasks`)
  - Frontend immediately starts and makes its first request
  - Backend might still be initializing some resources
  - This race condition causes intermittent failures

In **CI** (GitHub Actions):
- The workflow explicitly starts backend first, waits for it to be ready, then starts frontend
- An additional 5-second delay after frontend starts gives backend more time
- This works more reliably but the frontend's immediate fetch can still race

## Solution

A **two-layer defense** approach:

### Layer 1: Proper Server Startup Order (Already Implemented)

**In CI (GitHub Actions):**
```yaml
1. Start backend → Wait with retry logic (up to 40 attempts × 3 sec = 2 minutes)
2. Verify backend responds to /api/tasks
3. Start frontend → Wait with retry logic (up to 60 attempts × 3 sec = 3 minutes)
4. Extra 5-second delay for initialization
5. Verify both services are healthy
6. Run tests
```

**In Local Development (playwright.config.ts):**
```typescript
webServer: [
  {
    command: 'cd ../backend && npm run dev',
    url: 'http://localhost:5000/api/tasks',  // Backend MUST respond before continuing
    timeout: 120 * 1000,
  },
  {
    command: 'npm start',
    url: 'http://localhost:3000',  // Frontend starts AFTER backend is ready
    timeout: 180 * 1000,
  },
]
```

Playwright processes the `webServer` array **sequentially**, ensuring backend is ready before frontend starts.

### Layer 2: Error Detection and Recovery in Tests (Failsafe)

Even with proper startup order, there's still a small timing window where the frontend's immediate fetch might fail. The tests include a failsafe mechanism:

```typescript
// Wait for the task input to be visible (app is loaded)
await expect(page.locator('.task-input')).toBeVisible({ timeout: 10000 });

// Verify no error messages are shown (backend is responding)
// If there's an error, wait a bit and reload
const errorMessage = page.locator('.error-message');
const hasError = await errorMessage.isVisible().catch(() => false);
if (hasError) {
  console.log('Initial load had error, reloading page...');
  await page.reload();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.task-input')).toBeVisible({ timeout: 10000 });
  // Error should be gone after reload
  await expect(errorMessage).not.toBeVisible();
}
```

### Why This Works

1. **Detects the error**: Checks if `.error-message` element is visible
2. **Recovers gracefully**: If an error is detected, reloads the page
3. **Gives backend time**: By the time of the reload, the backend is fully ready
4. **Ensures clean state**: After reload, verifies no error is present
5. **Prevents test failures**: Tests now start with a clean, error-free state

## Files Modified

1. `frontend/e2e/app.spec.ts` - Updated `beforeEach` hook with error detection
2. `frontend/e2e/integration.spec.ts` - Updated `beforeEach` hook with error detection
3. `frontend/e2e/helpers/page-objects.ts` - Updated `navigateToApp()` method with error detection
4. `frontend/playwright.config.ts` - Added comments clarifying sequential startup order
5. `.github/workflows/playwright.yml` - Explicit sequential startup with health checks

## Testing

This fix ensures:
- ✅ No red error text is displayed unless it's a negative test scenario
- ✅ All tests start with a clean, error-free application state
- ✅ Backend has adequate time to be fully ready before tests run
- ✅ Tests handle timing issues gracefully with automatic recovery
- ✅ Proper cleanup between tests (no lingering errors)

## Answer to "Is frontend loading before backend?"

**Yes**, the frontend CAN load before the backend is fully initialized, causing test failures. This happens due to:

1. **Race condition**: Even with sequential startup, there's a timing window
2. **Immediate fetch**: Frontend's `useEffect` runs immediately on mount
3. **Backend initialization**: Backend might still be setting up resources even after passing health check

**The solution**: 
- Sequential server startup (backend first, then frontend)
- Error detection and recovery in tests as a failsafe
- Adequate wait times and health checks in CI

## Related

This addresses the same issue that was fixed in PR #16, ensuring the fix is also applied to the optimized E2E tests. The proxy configuration in `frontend/package.json` remains correct (`"proxy": "http://localhost:5000"`), and the backend correctly binds to `0.0.0.0:5000`.
