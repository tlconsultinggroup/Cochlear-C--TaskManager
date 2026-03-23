# Error Handling Strategy for E2E Tests

## Overview

This document explains how errors are handled during application startup and E2E tests, ensuring no red error text is displayed unless it's a genuine error state.

## The Challenge

When the frontend application loads, it immediately makes a fetch request to the backend API to retrieve tasks. However, there's a timing window where:

1. Frontend starts and renders
2. `useEffect` runs and calls `fetchTasks()`
3. Backend might still be initializing
4. Initial request fails → Error message appears in red
5. Tests see this error and might fail

## Solution: Retry with Exponential Backoff

### Frontend Implementation

**File:** `frontend/src/App.tsx`

```typescript
const fetchTasks = useCallback(async (retryCount = 0) => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch(`${API_URL}/tasks`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    const data = await response.json();
    setTasks(data);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    
    // Retry logic: retry up to 3 times with exponential backoff
    if (retryCount < 3) {
      const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
      console.log(`Retrying in ${delay}ms... (attempt ${retryCount + 1}/3)`);
      setTimeout(() => fetchTasks(retryCount + 1), delay);
    } else {
      // Only show error after all retries exhausted
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  } finally {
    setLoading(false);
  }
}, [API_URL]);
```

**Key Features:**
- ✅ Retries up to 3 times before showing error
- ✅ Exponential backoff: 1s, 2s, 4s (max 5s)
- ✅ Only shows error after all retries exhausted
- ✅ Logs retry attempts to console for debugging

### Retry Schedule

| Attempt | Delay | Total Time |
|---------|-------|------------|
| 1       | 0ms   | 0s         |
| 2       | 1000ms| 1s         |
| 3       | 2000ms| 3s         |
| 4       | 4000ms| 7s         |
| Error   | -     | 7s+        |

This means the frontend will retry for approximately 7 seconds before showing a permanent error message.

## CI/CD Startup Sequence

The GitHub Actions workflow ensures proper startup timing:

```yaml
1. Start backend
   └─ Wait for health check (up to 2 minutes)
   └─ Extra 5 seconds for full initialization
   
2. Start frontend  
   └─ Wait for HTTP 200 (up to 3 minutes)
   └─ Extra 10 seconds for initial API calls to stabilize
   
3. Verify services healthy
   └─ Backend health check
   └─ Frontend health check
   └─ Proxy connectivity test
   
4. Run tests
```

**Total wait time before tests:** 
- Backend: 5 seconds after first response
- Frontend: 10 seconds after first response
- This ensures the frontend's retry logic has time to succeed

## Test-Level Error Detection

Even with retry logic, tests include error detection as a failsafe:

**File:** `frontend/e2e/app.spec.ts`

```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.task-input')).toBeVisible({ timeout: 10000 });
  
  // Check for error messages
  const errorMessage = page.locator('.error-message');
  const hasError = await errorMessage.isVisible().catch(() => false);
  
  if (hasError) {
    console.log('Initial load had error, reloading page...');
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.task-input')).toBeVisible({ timeout: 10000 });
    await expect(errorMessage).not.toBeVisible();
  }
});
```

This provides a **three-layer defense**:

1. **Backend ready first** (CI workflow)
2. **Frontend retry logic** (App.tsx)
3. **Test error detection** (beforeEach hook)

## Error States

### Transient Errors (Expected, No Red Text)

These are temporary errors during initialization, handled by retry logic:

- ❌ Backend not ready yet → Retry automatically
- ❌ Network connection initializing → Retry automatically
- ❌ Proxy middleware starting up → Retry automatically

**User sees:** Loading indicator, no error message

### Permanent Errors (Expected, Red Text Appears)

These are genuine errors that should be shown:

- ❌ Backend is down (all retries failed)
- ❌ Invalid API endpoint (404)
- ❌ Server error (500)
- ❌ Authentication failure

**User sees:** Error message in red after retry exhaustion

### Test Errors (Negative Tests)

For negative test scenarios (testing error handling):

```typescript
test('should show error when backend is unavailable', async ({ page }) => {
  // Intercept and block API calls
  await page.route('**/api/tasks', route => route.abort());
  
  await page.goto('/');
  
  // Error should appear after retries
  await expect(page.locator('.error-message')).toBeVisible({ timeout: 10000 });
  
  // Cleanup: remove route
  await page.unroute('**/api/tasks');
});
```

**Cleanup:** Always remove route interceptions to restore normal state

## Preventing Red Error Text

### During Health Checks

The CI workflow waits sufficiently long after services start:

```yaml
# After frontend starts
sleep 10  # Allows retry logic to complete

# Before tests run  
# Verify no persistent errors
curl http://localhost:3000/api/tasks
```

### During Tests

Tests wait for the app to be in a stable state:

```typescript
// Wait for network to be idle (no pending requests)
await page.waitForLoadState('networkidle');

// Wait for UI to be visible
await expect(page.locator('.task-input')).toBeVisible({ timeout: 10000 });

// Check for errors and reload if found
if (hasError) { await page.reload(); }
```

## Debugging Error Messages

### Check Frontend Logs

```bash
# During development
# Browser console shows retry attempts

# In CI
cat frontend/frontend.log | grep -i "error\|retry"
```

### Check Backend Logs

```bash
# In CI
cat backend/backend.log | grep -i error
```

### Check Proxy Logs

With `logLevel: 'debug'` in setupProxy.js:

```bash
# Shows all proxy activity
[Proxy] GET /api/tasks -> http://localhost:5000/api/tasks
[Proxy] Response 200 for /api/tasks
```

## Common Scenarios

### Scenario 1: Backend Slow to Start

**Problem:** Backend takes 30 seconds to fully initialize

**Solution:** 
- CI workflow waits up to 2 minutes
- Frontend retries for 7 seconds
- Tests wait for networkidle state

**Result:** ✅ No error messages

### Scenario 2: Network Hiccup

**Problem:** Temporary network issue during first request

**Solution:**
- Frontend retries 3 times
- Each retry has increasing delay

**Result:** ✅ Second or third attempt succeeds

### Scenario 3: Backend Genuinely Down

**Problem:** Backend is not running

**Solution:**
- Frontend retries 3 times (7 seconds total)
- After exhausting retries, shows error

**Result:** ✅ Error message appears (expected behavior)

### Scenario 4: Test Environment

**Problem:** Tests see transient error during health check

**Solution:**
- CI waits 10 seconds after frontend starts
- Test beforeEach checks for errors and reloads
- networkidle wait ensures no pending requests

**Result:** ✅ Tests start with clean state

## Best Practices

1. ✅ **Always retry transient failures**
   - Network issues are common during startup
   - Exponential backoff prevents hammering the backend

2. ✅ **Wait sufficiently in CI**
   - Don't rush to run tests
   - Allow retry logic to complete

3. ✅ **Use proper wait conditions**
   - `waitForLoadState('networkidle')` ensures no pending requests
   - Explicit timeouts prevent indefinite waits

4. ✅ **Check for errors in tests**
   - BeforeEach hook detects any lingering errors
   - Reload page if errors are found

5. ✅ **Clean up after negative tests**
   - Remove route interceptions
   - Reset application state

## Summary

The application handles errors gracefully through:

1. **Retry logic**: 3 attempts with exponential backoff (7 seconds total)
2. **Proper timing**: CI waits 10 seconds after frontend starts
3. **Test failsafes**: beforeEach hook detects and handles errors
4. **No red text during startup**: Transient errors are retried automatically
5. **Clear errors for real issues**: Permanent failures are shown after retry exhaustion

This ensures a robust and user-friendly experience while maintaining proper error visibility when needed.
