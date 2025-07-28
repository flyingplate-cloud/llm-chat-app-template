# Deployment Guide

This guide covers deployment instructions for both CasaOS and Cloudflare Workers versions of the Nginx Default Application.

## 🏠 CasaOS Deployment

### Prerequisites
- Docker and Docker Compose installed
- CasaOS running on your system

### Quick Deployment

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd casaos
```

2. **Start the application:**
```bash
docker-compose up -d
```

3. **Access the application:**
   - Dashboard: http://localhost:3000
   - Health check: http://localhost:3000/health
   - Server info: http://localhost:3000/server-info

### Manual Docker Deployment

1. **Build the image:**
```bash
docker build -t nginx-default-casaos .
```

2. **Run the container:**
```bash
docker run -d -p 3000:3000 --name nginx-default-casaos nginx-default-casaos
```

### Development Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Access at:** http://localhost:3000

### CasaOS Integration

The application includes CasaOS-specific labels in `docker-compose.yml`:

```yaml
labels:
  - "casaos.app.name=Nginx Default"
  - "casaos.app.description=A lightweight nginx-like web server"
  - "casaos.app.icon=nginx"
  - "casaos.app.category=web-server"
  - "casaos.app.port=3000"
  - "casaos.app.protocol=http"
```

## ☁️ Cloudflare Workers Deployment

### Prerequisites
- Node.js (v18 or later)
- Wrangler CLI installed
- Cloudflare account

### Quick Deployment

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd cloudflare-worker
```

2. **Install dependencies:**
```bash
npm install
```

3. **Login to Cloudflare:**
```bash
wrangler login
```

4. **Deploy the worker:**
```bash
npm run deploy
```

### Development Setup

1. **Start development server:**
```bash
npm run dev
```

2. **Access at:** http://localhost:8787

### Configuration

The `wrangler.jsonc` file contains the main configuration:

```json
{
  "name": "nginx-default-cloudflare-worker",
  "main": "src/index.ts",
  "compatibility_date": "2025-04-01",
  "assets": {
    "binding": "ASSETS",
    "directory": "./public"
  }
}
```

## 🔧 Environment Variables

### CasaOS Version
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (default: production)

### Cloudflare Workers Version
- No environment variables required for basic functionality
- Uses Cloudflare's built-in features for IP detection and geolocation

## 📊 Monitoring

### Health Checks
Both versions provide health check endpoints:
- **CasaOS**: `http://localhost:3000/health`
- **Cloudflare Workers**: `https://your-worker.your-subdomain.workers.dev/health`

### Server Information
- **CasaOS**: `http://localhost:3000/server-info`
- **Cloudflare Workers**: `https://your-worker.your-subdomain.workers.dev/server-info`

## 🔒 Security

### CasaOS Security Features
- **Helmet.js**: Automatic security headers
- **CORS**: Cross-origin resource sharing support
- **Compression**: Automatic response compression
- **Non-root user**: Docker container runs as non-root user

### Cloudflare Workers Security Features
- **HTTPS Only**: All requests automatically served over HTTPS
- **DDoS Protection**: Cloudflare's global network protection
- **Rate Limiting**: Configurable in Cloudflare dashboard
- **Security Headers**: Automatic security headers

## 🚀 Performance Optimization

### CasaOS Performance
- **Compression**: Automatic response compression with gzip
- **Caching**: Configurable static file caching headers
- **Docker**: Optimized container deployment
- **Logging**: HTTP request logging with Morgan

### Cloudflare Workers Performance
- **Edge Caching**: Global edge network caching
- **Zero Cold Start**: Instant response times
- **Minimal Bundle**: Optimized worker size
- **Global Distribution**: Deployed to 200+ locations worldwide

## 🐛 Troubleshooting

### CasaOS Issues

**Port Already in Use:**
```bash
# Change port in docker-compose.yml
ports:
  - "3001:3000"  # Use port 3001 instead
```

**Container Won't Start:**
```bash
# Check logs
docker-compose logs nginx-default

# Restart container
docker-compose restart nginx-default
```

**Permission Issues:**
```bash
# Fix file permissions
chmod -R 755 casaos/
```

### Cloudflare Workers Issues

**Deployment Failures:**
```bash
# Check Wrangler configuration
wrangler deploy --dry-run

# Verify TypeScript compilation
npm run check
```

**404 Errors:**
- Ensure static files are in the `public/` directory
- Check that assets are properly configured in `wrangler.jsonc`

**Type Errors:**
```bash
# Run TypeScript check
npm run check

# Generate types
npm run cf-typegen
```

## 📝 Logs

### CasaOS Logs
```bash
# View container logs
docker-compose logs -f nginx-default

# View application logs
docker exec nginx-default-casaos cat /app/logs/app.log
```

### Cloudflare Workers Logs
- Logs are available in the Cloudflare dashboard
- Use `console.log()` statements for debugging
- Enable real-time logs with `wrangler tail`

## 🔄 Updates

### CasaOS Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Cloudflare Workers Updates
```bash
# Pull latest changes
git pull origin main

# Deploy updates
npm run deploy
```

## 📚 Additional Resources

### CasaOS
- [CasaOS Documentation](https://docs.casaos.io/)
- [Docker Documentation](https://docs.docker.com/)
- [Express.js Documentation](https://expressjs.com/)

### Cloudflare Workers
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Community](https://community.cloudflare.com/)

---

For detailed documentation, see:
- [CasaOS Version](./casaos/README.md)
- [Cloudflare Workers Version](./cloudflare-worker/README.md)