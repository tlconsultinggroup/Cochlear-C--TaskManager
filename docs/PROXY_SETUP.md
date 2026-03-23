# Frontend-Backend Proxy Configuration

## Overview

This document explains how the proxy is configured between the frontend and backend to ensure seamless API communication during development and testing.

## Proxy Configuration

### Method 1: Simple Proxy (package.json)

**File:** `frontend/package.json`

```json
{
  "proxy": "http://localhost:5000"
}
```

This simple configuration tells `react-scripts` development server to proxy all requests that don't match static assets to the backend server.

**How it works:**
- Request to `/api/tasks` from frontend → proxied to `http://localhost:5000/api/tasks`
- Request to `/static/image.png` → served from frontend build directory
- Request to `/index.html` → served from frontend

### Method 2: Advanced Proxy (setupProxy.js)

**File:** `frontend/src/setupProxy.js`

```javascript
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy API requests to backend server
  // Using http-proxy-middleware v2.x+ syntax (no deprecation warnings)
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      logger: console,  // Use logger instead of deprecated logLevel
      on: {
        proxyReq: (proxyReq, req, res) => {
          console.log(`[Proxy] ${req.method} ${req.url} -> http://localhost:5000${req.url}`);
        },
        proxyRes: (proxyRes, req, res) => {
          console.log(`[Proxy] Response ${proxyRes.statusCode} for ${req.url}`);
        },
        error: (err, req, res) => {
          console.error('[Proxy] Error:', err.message);
          if (res.writeHead) {
            res.writeHead(500, {
              'Content-Type': 'application/json',
            });
          }
          res.end(JSON.stringify({ 
            error: 'Proxy error',
            message: err.message,
            backend: 'http://localhost:5000'
          }));
        }
      }
    })
  );
};
```

**Benefits:**
- ✅ Explicit error handling
- ✅ Console logging for troubleshooting (using modern `logger` option)
- ✅ Better control over proxy behavior
- ✅ Clear error messages when backend is unreachable
- ✅ No deprecation warnings (uses http-proxy-middleware v2.x+ API)
- ✅ Works consistently in all environments (dev, test, CI)

**When to use:**
- Use `setupProxy.js` for better control and debugging
- It overrides the simple `proxy` setting in `package.json`
- Recommended for production-grade applications

## How Requests Flow

```
┌─────────────┐
│   Browser   │
│  (Playwright│
│   or User)  │
└──────┬──────┘
       │
       │ GET http://localhost:3000/api/tasks
       ▼
┌─────────────────────────────────┐
│  Frontend Dev Server (port 3000)│
│                                  │
│  ┌────────────────────────────┐ │
│  │  setupProxy.js detects     │ │
│  │  /api prefix               │ │
│  └────────┬───────────────────┘ │
│           │                      │
│           │ Proxy Request        │
│           ▼                      │
│  ┌────────────────────────────┐ │
│  │  http-proxy-middleware     │ │
│  │  forwards to:              │ │
│  │  http://localhost:5000     │ │
│  └────────┬───────────────────┘ │
└───────────┼──────────────────────┘
            │
            │ GET http://localhost:5000/api/tasks
            ▼
┌─────────────────────────────────┐
│  Backend Server (port 5000)     │
│                                  │
│  ┌────────────────────────────┐ │
│  │  Express app handles       │ │
│  │  GET /api/tasks            │ │
│  └────────┬───────────────────┘ │
│           │                      │
│           │ Returns JSON        │
│           ▼                      │
└───────────┼──────────────────────┘
            │
            │ Response flows back through proxy
            ▼
┌─────────────┐
│   Browser   │
└─────────────┘
```

## Frontend Code

**File:** `frontend/src/App.tsx`

```typescript
const API_URL = process.env.REACT_APP_API_URL || '/api';

const fetchTasks = async () => {
  const response = await fetch(`${API_URL}/tasks`);
  // ...
};
```

**Key Points:**
- Uses `/api` prefix (relative URL)
- Proxy middleware intercepts and forwards to backend
- No CORS issues because proxy handles it
- Environment variable allows override if needed

## Verification

### 1. Check Proxy is Working

```bash
# Start backend
cd backend && npm run dev

# In another terminal, start frontend
cd frontend && npm start

# Test direct backend access
curl http://localhost:5000/api/tasks
# Should return: []

# Test through frontend proxy
curl http://localhost:3000/api/tasks
# Should also return: []
```

### 2. Check Proxy Logs

When using `setupProxy.js` with `logLevel: 'debug'`, you'll see:

```
[Proxy] GET /api/tasks -> http://localhost:5000/api/tasks
[Proxy] Response 200 for /api/tasks
```

### 3. Common Issues

**Issue:** "Proxy error: ECONNREFUSED"

**Cause:** Backend is not running or not accessible

**Solution:**
1. Start backend first: `cd backend && npm run dev`
2. Wait for "Server is running on http://0.0.0.0:5000"
3. Then start frontend: `cd frontend && npm start`

**Issue:** "404 Not Found" when accessing `/api/tasks`

**Cause:** Proxy not configured or route doesn't exist

**Solution:**
1. Check `setupProxy.js` exists in `frontend/src/`
2. Check backend has the route: `app.get('/api/tasks', ...)`
3. Restart frontend dev server

**Issue:** Proxy works in dev but not in tests

**Cause:** Test environment might not initialize proxy

**Solution:**
1. Ensure `http-proxy-middleware` is in dependencies
2. Ensure both servers are running before tests
3. Check CI workflow starts backend before frontend

## CI/CD Configuration

In GitHub Actions, the workflow ensures:

```yaml
# 1. Start backend first
- name: Start backend server
  run: npm run dev > backend.log 2>&1 &
  env:
    HOST: 0.0.0.0

# 2. Wait for backend to be ready
- name: Wait for backend
  run: |
    curl -f http://localhost:5000/api/tasks
    
# 3. Start frontend (proxy will connect to backend)
- name: Start frontend server
  run: npm start > frontend.log 2>&1 &
  env:
    REACT_APP_API_URL: /api

# 4. Wait for frontend
- name: Wait for frontend
  run: |
    curl -f http://localhost:3000
    
# 5. Test proxy connectivity
- name: Verify proxy
  run: |
    RESPONSE=$(curl -s http://localhost:3000/api/tasks)
    echo "Proxy response: $RESPONSE"
```

## Troubleshooting

### Enable Debug Logging

Modify `setupProxy.js`:

```javascript
createProxyMiddleware({
  target: 'http://localhost:5000',
  logLevel: 'debug',  // Shows all proxy activity
  // ...
})
```

### Check Network Connectivity

```bash
# Check if backend is listening
netstat -tuln | grep 5000

# Check if frontend is listening
netstat -tuln | grep 3000

# Test backend directly
curl -v http://localhost:5000/api/tasks

# Test through proxy
curl -v http://localhost:3000/api/tasks
```

### View Proxy Errors

Frontend logs will show proxy errors:

```bash
# Development
# Look in browser console or terminal running npm start

# CI
cat frontend/frontend.log | grep -i proxy
```

## Dependencies

**Required:**
```json
{
  "dependencies": {
    "http-proxy-middleware": "^2.0.6"
  }
}
```

Install with:
```bash
cd frontend
npm install http-proxy-middleware
```

## Best Practices

1. ✅ **Always start backend before frontend**
   - Backend must be listening before proxy tries to connect
   
2. ✅ **Use relative URLs in frontend code**
   - `/api/tasks` instead of `http://localhost:5000/api/tasks`
   - Allows proxy to intercept requests
   
3. ✅ **Wait for services to be ready**
   - Don't run tests until both services respond to health checks
   
4. ✅ **Use setupProxy.js for better debugging**
   - Provides clear error messages
   - Logs all proxy activity
   
5. ✅ **Handle proxy errors gracefully**
   - Show user-friendly error messages
   - Retry failed requests
   - Detect when backend is unavailable

## Summary

The proxy configuration ensures:
- ✅ Frontend can communicate with backend without CORS issues
- ✅ Requests to `/api/*` are automatically forwarded to backend
- ✅ Clear error messages when backend is unreachable
- ✅ Debug logging helps troubleshoot connectivity issues
- ✅ Works consistently in development, testing, and CI environments

The key is that both services run on localhost, and the proxy middleware seamlessly forwards API requests from frontend (port 3000) to backend (port 5000).
