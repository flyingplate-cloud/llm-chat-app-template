# Nginx Default Application

A lightweight nginx-like web server application available in two versions: **CasaOS** and **Cloudflare Workers**. This template provides a simple web server with static file serving, basic routing, and HTTP status handling.

## 🚀 Quick Start

Choose your deployment platform:

### CasaOS Version
```bash
cd casaos
docker-compose up -d
```
Access: http://localhost:3000

### Cloudflare Workers Version
```bash
cd cloudflare-worker
npm install
npm run deploy
```

## 📁 Project Structure

```
├── casaos/                    # CasaOS version (Node.js + Express)
│   ├── server.js             # Main server code
│   ├── package.json          # Dependencies
│   ├── Dockerfile           # Docker configuration
│   ├── docker-compose.yml   # Docker Compose setup
│   ├── public/              # Static files
│   └── README.md           # CasaOS documentation
├── cloudflare-worker/         # Cloudflare Workers version
│   ├── src/
│   │   ├── index.ts         # Main worker code
│   │   └── types.ts         # TypeScript types
│   ├── public/              # Static files
│   ├── wrangler.jsonc       # Wrangler configuration
│   ├── package.json         # Dependencies
│   └── README.md           # Cloudflare documentation
└── README.md                # This file
```

## 🎯 Features

### Common Features
- 🚀 **Static File Serving** - Serve HTML, CSS, JS, images, and other static files
- 🔧 **API Endpoints** - Built-in API routes for status and debugging
- 📊 **Health Checks** - Monitor server status and uptime
- 🎨 **Modern UI** - Beautiful dashboard with real-time server information
- 🔒 **Security** - Built-in security features

### CasaOS Version
- 📦 **Docker Ready** - Easy deployment with Docker and Docker Compose
- 🔧 **Express.js** - Full Node.js runtime with middleware support
- 📝 **Logging** - HTTP request logging with Morgan
- 🗜️ **Compression** - Automatic response compression

### Cloudflare Workers Version
- ⚡ **Edge Computing** - Global edge network deployment
- 🔒 **HTTPS Only** - Automatic HTTPS and DDoS protection
- 📊 **Analytics** - Cloudflare Analytics integration
- 🚀 **Zero Cold Start** - Instant response times

## 📋 Available Endpoints

Both versions provide the same API endpoints:

### Web Routes
- `/` - Main dashboard page
- `/health` - Health check endpoint (JSON)
- `/server-info` - Server information (JSON)

### API Routes
- `/api/status` - API status and available endpoints
- `/api/echo` - Echo request details for debugging

## 🛠️ Development

### CasaOS Development
```bash
cd casaos
npm install
npm run dev
```

### Cloudflare Workers Development
```bash
cd cloudflare-worker
npm install
npm run dev
```

## 🚀 Deployment

### CasaOS Deployment
```bash
cd casaos
docker-compose up -d
```

### Cloudflare Workers Deployment
```bash
cd cloudflare-worker
npm run deploy
```

## 📊 Monitoring

Both versions include built-in monitoring endpoints:
- **Health Check**: `/health` - Returns server status
- **Server Info**: `/server-info` - Returns detailed server information
- **API Status**: `/api/status` - Returns API status and available endpoints

## 🔧 Customization

### Adding Static Files
Place any static files in the `public/` directory. They will be automatically served.

### Adding API Routes

**CasaOS Version:**
```javascript
app.get('/api/your-endpoint', (req, res) => {
  res.json({ message: 'Hello World' });
});
```

**Cloudflare Workers Version:**
```typescript
case '/api/your-endpoint':
  return new Response(JSON.stringify({ message: 'Hello World' }), {
    headers: { 'Content-Type': 'application/json' }
  });
```

## 🔒 Security

### CasaOS Security
- **Helmet.js**: Automatic security headers
- **CORS**: Cross-origin resource sharing support
- **Compression**: Automatic response compression

### Cloudflare Workers Security
- **HTTPS Only**: All requests automatically served over HTTPS
- **DDoS Protection**: Cloudflare's global network protection
- **Rate Limiting**: Configurable in Cloudflare dashboard

## 📈 Performance

### CasaOS Performance
- **Compression**: Automatic response compression
- **Caching**: Configurable static file caching
- **Docker**: Optimized container deployment

### Cloudflare Workers Performance
- **Edge Caching**: Global edge network caching
- **Zero Cold Start**: Instant response times
- **Minimal Bundle**: Optimized worker size

## 🐛 Troubleshooting

### Common Issues

**CasaOS:**
- Port already in use: Change port in `docker-compose.yml`
- Permission issues: Check file permissions
- Container won't start: Check logs with `docker-compose logs`

**Cloudflare Workers:**
- 404 errors: Ensure static files are in `public/` directory
- Deployment failures: Check Wrangler configuration
- Type errors: Run `npm run check`

## 📚 Documentation

- [CasaOS Version](./casaos/README.md) - Complete CasaOS documentation
- [Cloudflare Workers Version](./cloudflare-worker/README.md) - Complete Cloudflare documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### CasaOS Support
- [CasaOS Documentation](https://docs.casaos.io/)
- [Docker Documentation](https://docs.docker.com/)
- [Express.js Documentation](https://expressjs.com/)

### Cloudflare Workers Support
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Community](https://community.cloudflare.com/)

---

Built with ❤️ for CasaOS and Cloudflare Workers
