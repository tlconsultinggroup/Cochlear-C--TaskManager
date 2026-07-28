const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy API requests to backend server
  // Using http-proxy-middleware v2.x+ syntax (no deprecation warnings)
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      // Use logger instead of deprecated logLevel
      logger: console,
      // Event handlers for monitoring proxy activity
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
