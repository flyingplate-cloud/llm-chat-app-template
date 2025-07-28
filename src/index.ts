/**
 * CasaOS-like Application for Cloudflare Workers
 *
 * A comprehensive home server management application that mimics CasaOS functionality
 * including app management, system monitoring, and file serving.
 *
 * @license MIT
 */

interface Env {
  ASSETS: Fetcher;
}

// System information
interface SystemInfo {
  server: string;
  version: string;
  uptime: number;
  memory: {
    total: number;
    used: number;
    free: number;
  };
  cpu: {
    cores: number;
    usage: number;
  };
  storage: {
    total: number;
    used: number;
    free: number;
  };
  network: {
    connections: number;
    bandwidth: {
      incoming: number;
      outgoing: number;
    };
  };
}

// App information
interface AppInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'running' | 'stopped' | 'error';
  port: number;
  url: string;
  category: string;
  version: string;
  lastUpdated: string;
}

// Default apps
const DEFAULT_APPS: AppInfo[] = [
  {
    id: 'nginx-default',
    name: 'Nginx Default',
    description: 'Lightweight web server with static file serving',
    icon: '🌐',
    status: 'running',
    port: 3000,
    url: 'https://llm.flyingplate.cloud',
    category: 'web-server',
    version: '1.0.0',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'file-manager',
    name: 'File Manager',
    description: 'Web-based file management system',
    icon: '📁',
    status: 'running',
    port: 8080,
    url: 'https://files.flyingplate.cloud',
    category: 'file-management',
    version: '2.1.0',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'media-server',
    name: 'Media Server',
    description: 'Stream and manage your media files',
    icon: '🎬',
    status: 'stopped',
    port: 8096,
    url: 'https://media.flyingplate.cloud',
    category: 'media',
    version: '1.5.2',
    lastUpdated: new Date().toISOString()
  }
];

// Default MIME types
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

// Error pages
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
    <a href="/" class="back-link">← Back to CasaOS</a>
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
    <a href="/" class="back-link">← Back to CasaOS</a>
</body>
</html>`
};

export default {
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
    case '/api/system':
      return new Response(JSON.stringify(getSystemInfo()), {
        headers: { 'Content-Type': 'application/json' }
      });

    case '/api/apps':
      return new Response(JSON.stringify({
        apps: DEFAULT_APPS,
        total: DEFAULT_APPS.length,
        running: DEFAULT_APPS.filter(app => app.status === 'running').length
      }), {
        headers: { 'Content-Type': 'application/json' }
      });

    case '/api/apps/start':
      return handleAppAction(request, 'start');

    case '/api/apps/stop':
      return handleAppAction(request, 'stop');

    case '/api/apps/restart':
      return handleAppAction(request, 'restart');

    case '/api/health':
      return new Response(JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        worker: 'casaos-cloudflare-worker',
        uptime: Date.now(),
        version: '1.0.0'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });

    case '/api/stats':
      return new Response(JSON.stringify(getSystemStats()), {
        headers: { 'Content-Type': 'application/json' }
      });

    default:
      return new Response(JSON.stringify({
        error: 'API endpoint not found',
        available: [
          '/api/system',
          '/api/apps',
          '/api/apps/start',
          '/api/apps/stop',
          '/api/apps/restart',
          '/api/health',
          '/api/stats'
        ]
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
  }
}

/**
 * Get system information
 */
function getSystemInfo(): SystemInfo {
  return {
    server: 'CasaOS Cloudflare Worker',
    version: '1.0.0',
    uptime: Date.now(),
    memory: {
      total: 128 * 1024 * 1024, // 128MB (Workers limit)
      used: 64 * 1024 * 1024,   // 64MB
      free: 64 * 1024 * 1024    // 64MB
    },
    cpu: {
      cores: 1,
      usage: 15.5
    },
    storage: {
      total: 1024 * 1024 * 1024, // 1GB
      used: 256 * 1024 * 1024,   // 256MB
      free: 768 * 1024 * 1024    // 768MB
    },
    network: {
      connections: 42,
      bandwidth: {
        incoming: 1024 * 1024,   // 1MB/s
        outgoing: 512 * 1024      // 512KB/s
      }
    }
  };
}

/**
 * Get system statistics
 */
function getSystemStats() {
  return {
    timestamp: new Date().toISOString(),
    system: getSystemInfo(),
    apps: {
      total: DEFAULT_APPS.length,
      running: DEFAULT_APPS.filter(app => app.status === 'running').length,
      stopped: DEFAULT_APPS.filter(app => app.status === 'stopped').length,
      error: DEFAULT_APPS.filter(app => app.status === 'error').length
    },
    performance: {
      responseTime: Math.random() * 100 + 10, // 10-110ms
      requestsPerSecond: Math.random() * 1000 + 100, // 100-1100 req/s
      errorRate: Math.random() * 2 // 0-2%
    }
  };
}

/**
 * Handle app actions (start/stop/restart)
 */
function handleAppAction(request: Request, action: string): Response {
  const url = new URL(request.url);
  const appId = url.searchParams.get('id');

  if (!appId) {
    return new Response(JSON.stringify({
      error: 'App ID is required',
      example: `/api/apps/${action}?id=nginx-default`
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const app = DEFAULT_APPS.find(a => a.id === appId);
  if (!app) {
    return new Response(JSON.stringify({
      error: 'App not found',
      available: DEFAULT_APPS.map(a => a.id)
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Simulate app action
  const newStatus = action === 'start' ? 'running' : 
                   action === 'stop' ? 'stopped' : 'running';

  return new Response(JSON.stringify({
    success: true,
    action,
    appId,
    previousStatus: app.status,
    newStatus,
    message: `App ${appId} ${action}ed successfully`,
    timestamp: new Date().toISOString()
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
