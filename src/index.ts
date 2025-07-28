/**
 * Optimized Nginx-like Application for Cloudflare Workers
 */

interface Env {
  ASSETS: Fetcher;
}

// MIME types
const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.txt': 'text/plain', '.xml': 'application/xml',
  '.pdf': 'application/pdf', '.zip': 'application/zip', '.woff': 'font/woff',
  '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.eot': 'application/vnd.ms-fontobject',
};

// Error page template
const createErrorPage = (code: number, title: string, message: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${code} - ${title}</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .error-code { font-size: 72px; color: #e74c3c; margin-bottom: 20px; }
        .error-message { font-size: 24px; color: #2c3e50; margin-bottom: 30px; }
        .back-link { color: #3498db; text-decoration: none; }
        .back-link:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="error-code">${code}</div>
    <div class="error-message">${title}</div>
    <p>${message}</p>
    <a href="/" class="back-link">← Back to Home</a>
</body>
</html>`;

const ERROR_PAGES = {
  404: createErrorPage(404, 'Not Found', 'The requested page could not be found on this server.'),
  500: createErrorPage(500, 'Internal Server Error', 'Something went wrong on our end. Please try again later.'),
  403: createErrorPage(403, 'Forbidden', 'You don\'t have permission to access this resource.')
};

// API handlers
const API_HANDLERS = {
  '/api/status': () => ({
    status: 'running',
    uptime: Date.now(),
    endpoints: ['/', '/health', '/server-info', '/api/status', '/api/echo']
  }),
  
  '/api/echo': (request: Request) => ({
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
    timestamp: new Date().toISOString()
  }),
  
  '/health': () => ({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    worker: 'nginx-default'
  }),
  
  '/server-info': (request: Request) => ({
    server: 'Cloudflare Workers Nginx',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    userAgent: request.headers.get('User-Agent'),
    ip: request.headers.get('CF-Connecting-IP'),
    country: request.headers.get('CF-IPCountry')
  })
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // API routes
      if (API_HANDLERS[path]) {
        const data = API_HANDLERS[path](request);
        return new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Static files
      if (path === '/' || path === '/index.html') {
        return env.ASSETS.fetch(request);
      }

      const staticResponse = await env.ASSETS.fetch(request);
      if (staticResponse.status !== 404) {
        return staticResponse;
      }

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
