/**
 * Default Nginx-like Application for CasaOS
 *
 * A simple web server application that mimics basic nginx functionality
 * including static file serving, basic routing, and HTTP status handling.
 *
 * @license MIT
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
app.use(compression());
app.use(cors());
app.use(morgan('combined'));

// Default MIME types for common file extensions
const MIME_TYPES = {
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    server: 'casaos-nginx-default',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Server info endpoint
app.get('/server-info', (req, res) => {
  res.json({
    server: 'CasaOS Nginx Default',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    hostname: require('os').hostname(),
    platform: process.platform,
    nodeVersion: process.version
  });
});

// API routes
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    uptime: process.uptime(),
    endpoints: [
      '/',
      '/health',
      '/server-info',
      '/api/status',
      '/api/echo'
    ]
  });
});

app.get('/api/echo', (req, res) => {
  res.json({
    method: req.method,
    url: req.url,
    headers: req.headers,
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
});

// Handle API 404
app.get('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    available: ['/api/status', '/api/echo']
  });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (MIME_TYPES[ext]) {
      res.setHeader('Content-Type', MIME_TYPES[ext]);
    }
  }
}));

// Default route handler
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler for unmatched routes
app.use('*', (req, res) => {
  res.status(404).send(ERROR_PAGES[404]);
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error handling request:', err);
  res.status(500).send(ERROR_PAGES[500]);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CasaOS Nginx Default Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`ℹ️  Server info: http://localhost:${PORT}/server-info`);
  console.log(`🌐 Dashboard: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});