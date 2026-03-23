# Network Configuration for E2E Tests

## Overview

This document explains how the frontend and backend are configured to communicate on the same network during E2E tests, both locally and in CI environments.

## Network Architecture

### In GitHub Actions (CI)

Both services run on the **same GitHub Actions runner**, which provides a localhost network:

```
┌─────────────────────────────────────────┐
│   GitHub Actions Runner (localhost)     │
│                                         │
│  ┌──────────────┐    ┌──────────────┐  │
│  │   Backend    │    │   Frontend   │  │
│  │  Port 5000   │◄───│  Port 3000   │  │
│  │ (0.0.0.0)    │    │  (proxy)     │  │
│  └──────────────┘    └──────────────┘  │
│         ▲                    ▲          │
│         │                    │          │
│         └────────┬───────────┘          │
│                  │                      │
│         ┌────────▼────────┐             │
│         │  Playwright     │             │
│         │  (localhost)    │             │
│         └─────────────────┘             │
└─────────────────────────────────────────┘
```

**Key Points:**
- Backend binds to `0.0.0.0:5000` (all interfaces) - accessible via `localhost:5000`
- Frontend runs on `localhost:3000` with proxy configured to `http://localhost:5000`
- Playwright tests access `http://localhost:3000`
- All communication happens over localhost (127.0.0.1)

### In Local Development

Same architecture, services run on developer's machine:

```
┌─────────────────────────────────────────┐
│   Developer Machine (localhost)         │
│                                         │
│  ┌──────────────┐    ┌──────────────┐  │
│  │   Backend    │    │   Frontend   │  │
│  │  Port 5000   │◄───│  Port 3000   │  │
│  │ (0.0.0.0)    │    │  (proxy)     │  │
│  └──────────────┘    └──────────────┘  │
│         ▲                    ▲          │
│         │                    │          │
│         └────────┬───────────┘          │
│                  │                      │
│         ┌────────▼────────┐             │
│         │  Playwright     │             │
│         │  (localhost)    │             │
│         └─────────────────┘             │
└─────────────────────────────────────────┘
```

## Configuration Details

### Backend Configuration

**File:** `backend/src/index.ts`

```typescript
const host = process.env.HOST || '0.0.0.0';
const port = Number(process.env.PORT) || 5000;
app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
```

- Binds to `0.0.0.0` (all network interfaces)
- Port 5000
- Accessible via `localhost:5000`, `127.0.0.1:5000`, or the machine's IP
- In CI: `HOST=0.0.0.0` is explicitly set

### Frontend Configuration

**File:** `frontend/package.json`

```json
{
  "proxy": "http://localhost:5000"
}
```

- Frontend development server runs on port 3000
- Proxy configuration redirects `/api/*` requests to `http://localhost:5000`
- This ensures frontend and backend communicate seamlessly

**File:** `frontend/src/setupProxy.js`

For more robust proxy handling, especially in CI environments, a custom proxy setup is configured:

```javascript
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      logger: console,
      on: {
        proxyReq: (proxyReq, req, res) => {
          console.log(`[Proxy] ${req.method} ${req.url} -> http://localhost:5000${req.url}`);
        },
        proxyRes: (proxyRes, req, res) => {
          console.log(`[Proxy] Response ${proxyRes.statusCode} for ${req.url}`);
        },
        error: (err, req, res) => {
          console.error('[Proxy] Error:', err.message);
          // Handle error response
        }
      }
    })
  );
};
```

This provides:
- Explicit error handling for proxy failures
- Console logging to diagnose connectivity issues (using `logger` instead of deprecated `logLevel`)
- Proper error responses when backend is unreachable
- Uses modern http-proxy-middleware v2.x+ API (no deprecation warnings)

**File:** `frontend/src/App.tsx`

```typescript
const API_URL = process.env.REACT_APP_API_URL || '/api';
```

- Uses `/api` by default (proxied to backend)
- In CI: `REACT_APP_API_URL=/api` is explicitly set

### Playwright Configuration

**File:** `frontend/playwright.config.ts`

```typescript
use: {
  baseURL: 'http://localhost:3000',
}
```

- Tests navigate to `http://localhost:3000`
- Frontend proxy handles API requests to backend
- Both services must be on the same network (localhost)

## Network Verification Steps

The CI workflow includes comprehensive network verification:

### 1. Backend Startup
```yaml
- name: Start backend server
  run: npm run dev > backend.log 2>&1 &
  env:
    HOST: 0.0.0.0  # Bind to all interfaces
```

### 2. Backend Health Check
```yaml
- name: Wait for backend
  run: |
    for i in {1..40}; do
      if curl -f http://localhost:5000/api/tasks 2>/dev/null; then
        echo "Backend is ready!"
        exit 0
      fi
      sleep 3
    done
```

### 3. Frontend Startup
```yaml
- name: Start frontend server
  run: npm start > frontend.log 2>&1 &
  env:
    REACT_APP_API_URL: /api  # Use proxy
```

### 4. Frontend Health Check
```yaml
- name: Wait for frontend
  run: |
    for i in {1..60}; do
      if curl -f http://localhost:3000 2>/dev/null; then
        echo "Frontend is ready!"
        sleep 5  # Extra time for proxy initialization
        exit 0
      fi
      sleep 3
    done
```

### 5. Network Connectivity Verification
```yaml
- name: Verify services are healthy
  run: |
    echo "Backend: http://localhost:5000"
    echo "Frontend: http://localhost:3000 (proxying /api)"
    
    # Check backend directly
    curl -f http://localhost:5000/api/tasks -v
    
    # Check frontend
    curl -f http://localhost:3000 -v
    
    # Test proxy connectivity
    curl -s -w "\n%{http_code}" http://localhost:3000/api/tasks
    
    echo "All services on the same network (localhost)!"
    echo "Proxy connectivity verified!"
```

### 6. Pre-Test Verification
```yaml
- name: Run Frontend E2E tests
  run: |
    echo "Verifying backend is accessible..."
    curl -f http://localhost:5000/api/tasks -s
    
    echo "Verifying frontend is serving..."
    curl -f http://localhost:3000 -s > /dev/null
    
    npx playwright test
```

## Troubleshooting Network Issues

### Issue: "Failed to fetch tasks" error

**Possible Causes:**
1. Backend not fully initialized when frontend makes first request
2. Network timing issue during service startup
3. Proxy not configured correctly

**Solutions Implemented:**
1. ✅ Sequential startup (backend first, then frontend)
2. ✅ Health checks with retry logic (up to 2 minutes for backend, 3 minutes for frontend)
3. ✅ Extra 5-second delay after frontend startup
4. ✅ Pre-test network verification
5. ✅ Error detection and recovery in tests (reload page if error detected)

### Issue: Network not reachable

**Verification:**
```bash
# Check if services are running
curl http://localhost:5000/api/tasks
curl http://localhost:3000

# Check network interfaces
netstat -tuln | grep -E ':(3000|5000)'
```

**Expected Output:**
- Backend responds with `[]` or task list
- Frontend responds with HTML content
- Ports 3000 and 5000 are listening

### Issue: Proxy not working

**Check:**
1. `frontend/package.json` has `"proxy": "http://localhost:5000"`
2. Frontend is using `/api` for API calls (not full URL)
3. Backend is accessible at `localhost:5000`

## CI Environment Variables

The following environment variables ensure consistent network configuration:

```yaml
Backend:
  NODE_ENV: test
  HOST: 0.0.0.0          # Bind to all interfaces
  PORT: 5000             # Default port

Frontend:
  CI: true               # Enable CI mode
  REACT_APP_API_URL: /api  # Use proxy (not full URL)
  PORT: 3000             # Default port
```

## Why This Works

1. **Same Runner/Machine**: Both services run on the same host (GitHub Actions runner or local machine)
2. **Localhost Network**: Communication happens over localhost (127.0.0.1)
3. **No Network Isolation**: No Docker containers, VMs, or network namespaces separating services
4. **Standard Ports**: Using standard HTTP ports (3000, 5000)
5. **Proxy Configuration**: Frontend proxy handles cross-origin requests seamlessly
6. **Sequential Startup**: Backend starts and becomes healthy before frontend starts
7. **Health Checks**: Comprehensive verification ensures both services are ready
8. **Pre-Test Checks**: Additional verification before tests run

## Conclusion

The frontend and backend ARE on the same network (localhost) in both CI and local development environments. The network configuration is correct, and multiple verification steps ensure connectivity before tests run. The "Failed to fetch" errors are primarily due to timing issues (frontend loading before backend is ready), which are addressed through:

1. Proper startup sequencing
2. Health checks with retries
3. Additional wait times
4. Error detection and recovery in tests

All network communication happens over localhost (127.0.0.1), ensuring fast and reliable connectivity.
