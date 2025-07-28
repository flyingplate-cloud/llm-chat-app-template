# Cloudflare Workers Nginx Default App

A lightweight nginx-like web server application built with Cloudflare Workers. This template provides a simple web server with static file serving, basic routing, and HTTP status handling.

## Features

- 🚀 **Static File Serving** - Serve HTML, CSS, JS, images, and other static files
- 🔧 **API Endpoints** - Built-in API routes for status and debugging
- 📊 **Health Checks** - Monitor server status and uptime
- 🎨 **Modern UI** - Beautiful dashboard with real-time server information
- ⚡ **Fast Performance** - Built on Cloudflare's global edge network
- 🔒 **Security** - Automatic HTTPS and DDoS protection

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### Installation

1. Clone this repository:
```bash
git clone <your-repo-url>
cd nginx-default-worker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Deploy to Cloudflare Workers:
```bash
npm run deploy
```

## Available Endpoints

### Web Routes
- `/` - Main dashboard page
- `/health` - Health check endpoint (JSON)
- `/server-info` - Server information (JSON)

### API Routes
- `/api/status` - API status and available endpoints
- `/api/echo` - Echo request details for debugging

## Configuration

### Wrangler Configuration

The `wrangler.jsonc` file contains the main configuration:

```json
{
  "name": "nginx-default-worker",
  "main": "src/index.ts",
  "compatibility_date": "2025-04-01",
  "assets": {
    "binding": "ASSETS",
    "directory": "./public"
  }
}
```

### Environment Variables

No environment variables are required for basic functionality. The application uses Cloudflare's built-in features for IP detection and geolocation.

## Development

### Project Structure

```
├── src/
│   ├── index.ts          # Main worker code
│   └── types.ts          # TypeScript type definitions
├── public/
│   └── index.html        # Main dashboard page
├── wrangler.jsonc        # Wrangler configuration
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm run check` - Type check and dry-run deployment
- `npm test` - Run tests (if configured)

## Customization

### Adding Static Files

Place any static files in the `public/` directory. They will be automatically served by the worker.

### Adding API Routes

To add new API routes, modify the `handleApiRoutes` function in `src/index.ts`:

```typescript
function handleApiRoutes(request: Request, path: string): Response {
  switch (path) {
    case '/api/your-endpoint':
      return new Response(JSON.stringify({ message: 'Hello World' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    // ... existing routes
  }
}
```

### Custom Error Pages

Modify the `ERROR_PAGES` object in `src/index.ts` to customize error pages:

```typescript
const ERROR_PAGES = {
  404: `<!DOCTYPE html>...`,
  500: `<!DOCTYPE html>...`,
  // Add more error pages as needed
};
```

## Deployment

### Manual Deployment

1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Deploy the worker:
```bash
wrangler deploy
```

### Automatic Deployment

The project includes GitHub Actions for automatic deployment. Simply push to the main branch to trigger deployment.

## Monitoring

### Built-in Monitoring

The application includes several monitoring endpoints:

- **Health Check**: `/health` - Returns server status
- **Server Info**: `/server-info` - Returns detailed server information
- **API Status**: `/api/status` - Returns API status and available endpoints

### Cloudflare Analytics

Enable Cloudflare Analytics in your dashboard to monitor:
- Request volume
- Response times
- Error rates
- Geographic distribution

## Security

### Built-in Security Features

- **HTTPS Only**: All requests are automatically served over HTTPS
- **DDoS Protection**: Cloudflare's global network provides DDoS protection
- **Rate Limiting**: Configure rate limiting in Cloudflare dashboard
- **Security Headers**: Automatic security headers are added

### Custom Security

Add custom security headers in the worker code:

```typescript
return new Response(content, {
  headers: {
    'Content-Type': 'text/html',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block'
  }
});
```

## Performance

### Optimization Tips

1. **Minimize Dependencies**: Keep the worker bundle size small
2. **Use Caching**: Leverage Cloudflare's edge caching
3. **Optimize Images**: Use WebP format and appropriate sizes
4. **Compress Assets**: Enable gzip compression

### Performance Monitoring

Monitor performance using:
- Cloudflare Analytics
- Real User Monitoring (RUM)
- Custom performance metrics

## Troubleshooting

### Common Issues

1. **404 Errors**: Ensure static files are in the `public/` directory
2. **Deployment Failures**: Check Wrangler configuration and credentials
3. **Type Errors**: Run `npm run check` to verify TypeScript compilation

### Debug Mode

Enable debug logging by adding console.log statements:

```typescript
console.log('Request URL:', request.url);
console.log('Request Method:', request.method);
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Community](https://community.cloudflare.com/)

---

Built with ❤️ using Cloudflare Workers
