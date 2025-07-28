# Deployment Guide - Cloudflare Workers Nginx

This guide will help you deploy the nginx-like application to Cloudflare Workers.

## Prerequisites

1. **Node.js** (v18 or later)
2. **Wrangler CLI** - Cloudflare's command-line tool
3. **Cloudflare Account** with Workers enabled

## Installation Steps

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

This will open your browser to authenticate with Cloudflare.

### 3. Install Dependencies

```bash
npm install
```

## Development

### Start Development Server

```bash
npm run dev
```

This will start a local development server at `http://localhost:8787`.

### Type Checking

```bash
npm run check
```

This runs TypeScript compilation and a dry-run deployment to catch any issues.

## Deployment

### Deploy to Cloudflare Workers

```bash
npm run deploy
```

Or directly with wrangler:

```bash
wrangler deploy
```

### Environment-Specific Deployment

You can deploy to different environments:

```bash
# Deploy to production
wrangler deploy --env production

# Deploy to staging
wrangler deploy --env staging
```

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

### Custom Domains

To use a custom domain:

1. Add your domain in the Cloudflare dashboard
2. Add the domain to your wrangler configuration:

```json
{
  "name": "nginx-default-worker",
  "routes": [
    {
      "pattern": "your-domain.com/*",
      "zone_name": "your-domain.com"
    }
  ]
}
```

### Environment Variables

If you need environment variables, add them to your wrangler configuration:

```json
{
  "name": "nginx-default-worker",
  "vars": {
    "ENVIRONMENT": "production",
    "API_VERSION": "v1"
  }
}
```

## Monitoring

### Built-in Endpoints

After deployment, you can monitor your application using these endpoints:

- **Dashboard**: `https://your-worker.your-subdomain.workers.dev/`
- **Health Check**: `https://your-worker.your-subdomain.workers.dev/health`
- **Server Info**: `https://your-worker.your-subdomain.workers.dev/server-info`
- **API Status**: `https://your-worker.your-subdomain.workers.dev/api/status`

### Cloudflare Analytics

Enable analytics in your Cloudflare dashboard to monitor:

- Request volume
- Response times
- Error rates
- Geographic distribution

## Troubleshooting

### Common Issues

1. **Deployment Fails**
   - Check your Wrangler configuration
   - Ensure you're logged in: `wrangler whoami`
   - Verify your account has Workers enabled

2. **Static Files Not Loading**
   - Ensure files are in the `public/` directory
   - Check the assets binding in `wrangler.jsonc`
   - Verify file permissions

3. **TypeScript Errors**
   - Run `npm run check` to see compilation errors
   - Ensure all dependencies are installed

4. **API Endpoints Not Working**
   - Check the worker logs in Cloudflare dashboard
   - Verify the route handling in `src/index.ts`

### Debug Mode

Enable debug logging by adding console.log statements to your worker code:

```typescript
console.log('Request URL:', request.url);
console.log('Request Method:', request.method);
```

### Viewing Logs

```bash
# View real-time logs
wrangler tail

# View logs for specific environment
wrangler tail --env production
```

## Performance Optimization

### Bundle Size

Keep your worker bundle small:

1. Use tree-shaking
2. Minimize dependencies
3. Use dynamic imports when possible

### Caching

Leverage Cloudflare's edge caching:

1. Set appropriate cache headers
2. Use Cloudflare's cache API
3. Configure cache rules in the dashboard

### Static Assets

Optimize static assets:

1. Compress images (WebP format)
2. Minify CSS and JavaScript
3. Use appropriate cache headers

## Security

### HTTPS

All requests are automatically served over HTTPS.

### Security Headers

Add security headers in your worker:

```typescript
return new Response(content, {
  headers: {
    'Content-Type': 'text/html',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  }
});
```

### Rate Limiting

Configure rate limiting in your Cloudflare dashboard:

1. Go to Security > WAF
2. Create custom rules
3. Set rate limiting rules

## Scaling

### Automatic Scaling

Cloudflare Workers automatically scales based on demand.

### Limits

Be aware of Cloudflare Workers limits:

- **CPU Time**: 10ms per request (free), 50ms (paid)
- **Memory**: 128MB per request
- **Request Size**: 100MB
- **Response Size**: 100MB

## Support

### Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Community](https://community.cloudflare.com/)

### Getting Help

1. Check the [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/)
2. Search the [Cloudflare Community](https://community.cloudflare.com/)
3. Open an issue in this repository

---

Happy deploying! 🚀