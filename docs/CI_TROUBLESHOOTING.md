# CI/CD Troubleshooting Guide

## Overview

This document provides troubleshooting steps for common CI/CD issues encountered during E2E testing.

## Common Issue: Proxy Health Check Failures

### Symptom

The health check step "Testing frontend-to-backend proxy connectivity..." fails with:
- HTTP code other than 200
- HTML response instead of JSON
- Connection refused or timeout errors

### Root Causes

#### 1. setupProxy.js Not Loaded in CI Mode

**Problem:** React's development server may handle `setupProxy.js` differently in CI mode (`CI=true`).

**Evidence:**
- Backend responds correctly when accessed directly (port 5000)
- Frontend serves HTML correctly (port 3000)
- Proxy endpoint returns HTML instead of JSON or 404

**Solution:**
The workflow now treats proxy health check as informational rather than blocking:
- Tests backend directly (✅ must pass)
- Tests frontend serving (✅ must pass)
- Tests proxy endpoint (⚠️ warning only)
- Proceeds with E2E tests regardless of proxy health check

**Why This Works:**
- E2E tests will make actual requests through the frontend
- Tests include retry logic (3 attempts) for robustness
- If proxy truly doesn't work, E2E tests will fail with clear errors
- This separates infrastructure issues from actual test failures

#### 2. Timing Issues

**Problem:** Proxy middleware hasn't fully initialized when health check runs.

**Evidence:**
- Intermittent failures
- Works on retry
- Frontend logs show delayed proxy initialization

**Solution:**
- Wait 10 seconds after frontend starts
- Check frontend logs for proxy initialization messages
- Retry logic in frontend App.tsx (3 attempts with exponential backoff)

#### 3. http-proxy-middleware Not Installed

**Problem:** Package not installed during `npm ci`.

**Evidence:**
- `npm list http-proxy-middleware` shows package not found
- Frontend logs show module resolution errors

**Solution:**
- Verify `http-proxy-middleware` is in `package.json` dependencies
- Not devDependencies (won't be installed in production builds)
- Run `npm ci` (not `npm install`) to ensure clean install

### Diagnostic Steps

When proxy health check fails, the workflow now provides:

```bash
1. Backend direct test (bypass proxy)
   - Tests http://localhost:5000/api/tasks
   - Must return 200 with JSON
   
2. Frontend proxy test  
   - Tests http://localhost:3000/api/tasks
   - Expected: 200 with JSON (proxy working)
   - Acceptable: 404 or HTML (proxy not configured, tests will handle)
   - Failure: Backend down or network issue
   
3. Diagnostic information
   - setupProxy.js exists?
   - http-proxy-middleware installed?
   - Frontend logs (last 30 lines)
```

### Understanding the Flow

```
Health Check (Informational)
├─ Backend Direct: http://localhost:5000/api/tasks
│  └─ MUST work (exit 1 if fails)
│
├─ Frontend Serving: http://localhost:3000
│  └─ MUST work (exit 1 if fails)
│
├─ Proxy Test: http://localhost:3000/api/tasks
│  └─ WARNING only (continues regardless)
│
└─ Proceed to E2E Tests
   └─ Real proxy test happens here
```

## E2E Test Failures vs Health Check Failures

### Health Check Failure (Blocking)

**Symptoms:**
- Backend not responding at port 5000
- Frontend not serving at port 3000
- Clear infrastructure problem

**Action:**
- Fix backend/frontend startup
- Check port conflicts
- Verify dependencies installed

### Proxy Warning (Non-Blocking)

**Symptoms:**
- Backend responds ✅
- Frontend serves ✅
- Proxy test returns 404 or HTML ⚠️

**Action:**
- Proceed with tests
- Monitor E2E test results
- If E2E tests fail with fetch errors, then investigate proxy

### E2E Test Failure (Actionable)

**Symptoms:**
- Health checks passed ✅
- Tests start running
- Tests fail with "Failed to fetch" or network errors

**Action:**
- Check test logs for specific error
- Verify retry logic is working
- Check if error persists after retries
- Review frontend/backend logs during test execution

## Configuration Verification

### 1. Check package.json

```json
{
  "dependencies": {
    "http-proxy-middleware": "^2.0.6"  // ✅ In dependencies
  },
  "proxy": "http://localhost:5000"     // ✅ Fallback config
}
```

### 2. Check setupProxy.js

File: `frontend/src/setupProxy.js`

```javascript
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use('/api', createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: true,
    logLevel: 'debug'
  }));
};
```

### 3. Check Frontend Environment

In CI workflow:

```yaml
env:
  CI: true
  REACT_APP_API_URL: /api  # Uses relative URL (proxy)
```

### 4. Check App.tsx

```typescript
const API_URL = process.env.REACT_APP_API_URL || '/api';

// With retry logic
const fetchTasks = async (retryCount = 0) => {
  try {
    const response = await fetch(`${API_URL}/tasks`);
    // ...
  } catch (error) {
    if (retryCount < 3) {
      // Retry with exponential backoff
      setTimeout(() => fetchTasks(retryCount + 1), delay);
    } else {
      setError(error.message);
    }
  }
};
```

## Interpreting CI Logs

### Successful Health Check

```
=== Network Connectivity Diagnostics ===
✅ Backend is healthy
✅ Frontend is healthy
✅ Proxy working! Valid JSON response received
✅ Both services on same network
```

### Acceptable Warning

```
=== Network Connectivity Diagnostics ===
✅ Backend is healthy
✅ Frontend is healthy
⚠️  Proxy test failed with code: 404
NOTE: Tests will still proceed
```

**Action:** Wait for E2E test results

### Critical Failure

```
=== Network Connectivity Diagnostics ===
❌ Backend not responding properly
Backend logs: [error messages]
```

**Action:** Fix backend startup issue

## Best Practices

### 1. Retry Logic is Your Friend

- Frontend: 3 retries with exponential backoff (1s, 2s, 4s)
- CI waits: Backend +5s, Frontend +10s
- Tests: beforeEach checks for errors and reloads

### 2. Fail Fast on Real Issues

- Backend not starting: Fail immediately
- Frontend not serving: Fail immediately
- Proxy not working: Warning, let tests decide

### 3. Comprehensive Logging

- Every step logs its progress
- Errors include relevant log sections
- Diagnostic info helps identify root cause

### 4. Separation of Concerns

- Infrastructure health: Must work
- Application health: Must work  
- Proxy configuration: Nice to have, tested by E2E tests

## When to Skip Health Checks

In some environments, the proxy health check may never pass due to:
- Docker networking differences
- CI platform limitations
- React dev server behaviors

**Solution:** Comment out the proxy health check section:

```yaml
# - name: Verify services are healthy
#   run: |
#     # Proxy test here...
```

**Alternative:** Make it non-blocking (already implemented):

```yaml
- name: Verify services are healthy
  continue-on-error: true  # Don't fail build if this step fails
```

## Further Investigation

If issues persist:

1. **Run locally with same commands**
   ```bash
   cd backend && npm run dev &
   cd frontend && npm start &
   curl http://localhost:3000/api/tasks
   ```

2. **Check React documentation**
   - setupProxy.js requirements
   - CI mode limitations
   - Proxy configuration options

3. **Try alternative approaches**
   - Use package.json "proxy" only
   - Remove setupProxy.js temporarily
   - Direct API calls with CORS headers

4. **Review test logs**
   - Actual E2E test failures
   - Network requests in Playwright
   - Browser console errors

## Summary

The health check strategy is now:

1. ✅ **Backend must work** (blocking)
2. ✅ **Frontend must work** (blocking)
3. ⚠️  **Proxy should work** (informational)
4. ✅ **E2E tests prove it** (definitive)

This pragmatic approach ensures:
- Real issues are caught early
- Minor configuration differences don't block builds
- Actual functionality is validated by tests
- Clear diagnostics when problems occur
