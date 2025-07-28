/**
 * Default Nginx-like Application for Cloudflare Workers
 *
 * A simple web server application that mimics basic nginx functionality
 * including static file serving, basic routing, and HTTP status handling.
 *
 * @license MIT
 */

interface Env {
  ASSETS: Fetcher;
}

// Default MIME types for common file extensions
const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

// Default error pages
const ERROR_PAGES = {
  404: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Not Found</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .error-code { font-size: 72px; color: #e74c3c; margin-bottom: 20px; }
        .error-message { font-size: 24px; color: #2c3e50; margin-bottom: 30px; }
        .back-link { color: #3498db; text-decoration: none; }
        .back-link:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="error-code">404</div>
    <div class="error-message">Page Not Found</div>
    <p>The requested page could not be found on this server.</p>
    <a href="/" class="back-link">← Back to Home</a>
</body>
</html>`,
  500: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>500 - Internal Server Error</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .error-code { font-size: 72px; color: #e74c3c; margin-bottom: 20px; }
        .error-message { font-size: 24px; color: #2c3e50; margin-bottom: 30px; }
        .back-link { color: #3498db; text-decoration: none; }
        .back-link:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="error-code">500</div>
    <div class="error-message">Internal Server Error</div>
    <p>Something went wrong on our end. Please try again later.</p>
    <a href="/" class="back-link">← Back to Home</a>
</body>
</html>`,
  403: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>403 - Forbidden</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .error-code { font-size: 72px; color: #e74c3c; margin-bottom: 20px; }
        .error-message { font-size: 24px; color: #2c3e50; margin-bottom: 30px; }
        .back-link { color: #3498db; text-decoration: none; }
        .back-link:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="error-code">403</div>
    <div class="error-message">Forbidden</div>
    <p>You don't have permission to access this resource.</p>
    <a href="/" class="back-link">← Back to Home</a>
</body>
</html>`
};

export default {
  /**
   * Main request handler for the Worker
   */
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Handle API routes
      if (path.startsWith('/api/')) {
        return handleApiRoutes(request, path);
      }

      // Handle health check
      if (path === '/health') {
        return new Response(JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          worker: 'nginx-default'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Handle server info
      if (path === '/server-info') {
        return new Response(JSON.stringify({
          server: 'Cloudflare Workers Nginx',
          version: '1.0.0',
          timestamp: new Date().toISOString(),
          userAgent: request.headers.get('User-Agent'),
          ip: request.headers.get('CF-Connecting-IP'),
          country: request.headers.get('CF-IPCountry')
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Handle static files
      if (path === '/' || path === '/index.html') {
        return env.ASSETS.fetch(request);
      }

      // Try to serve static files from assets
      const staticResponse = await env.ASSETS.fetch(request);
      if (staticResponse.status !== 404) {
        return staticResponse;
      }

      // Return 404 for unmatched routes
      return new Response(ERROR_PAGES[404], {
        status: 404,
        headers: { 'Content-Type': 'text/html' }
      });

    } catch (error) {
      console.error('Error handling request:', error);
      return new Response(ERROR_PAGES[500], {
        status: 500,
        headers: { 'Content-Type': 'text/html' }
      });
    }
  },
} satisfies ExportedHandler<Env>;

/**
 * Handle API routes
 */
function handleApiRoutes(request: Request, path: string): Response {
  switch (path) {
    case '/api/status':
      return new Response(JSON.stringify({
        status: 'running',
        uptime: Date.now(),
        endpoints: [
          '/',
          '/health',
          '/server-info',
          '/api/status',
          '/api/echo'
        ]
      }), {
        headers: { 'Content-Type': 'application/json' }
      });

    case '/api/echo':
      return new Response(JSON.stringify({
        method: request.method,
        url: request.url,
        headers: Object.fromEntries(request.headers.entries()),
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });

    default:
      return new Response(JSON.stringify({
        error: 'API endpoint not found',
        available: ['/api/status', '/api/echo']
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
  }
}
