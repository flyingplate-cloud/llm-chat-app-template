# CasaOS Cloudflare Worker

🏠 **A comprehensive home server management application for Cloudflare Workers that mimics CasaOS functionality**

## 🌟 Features

### 📊 System Monitoring
- **Real-time system stats** - CPU, Memory, Storage, Network usage
- **Performance metrics** - Response time, requests per second, error rates
- **Health monitoring** - System status and uptime tracking

### 📱 Application Management
- **App dashboard** - Visual management of all applications
- **Start/Stop/Restart** - Control application states
- **Status monitoring** - Real-time app status tracking
- **App details** - Detailed information and configuration

### 🎨 Modern UI
- **Responsive design** - Works on desktop and mobile
- **Real-time updates** - Auto-refresh every 30 seconds
- **Interactive dashboard** - Click to view app details
- **Status indicators** - Visual status for all components

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Wrangler CLI
- Cloudflare account with Workers enabled

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd casaos-cloudflare-worker
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure your Cloudflare settings**
```bash
# Update wrangler.jsonc with your account and zone IDs
# Update package.json with your Cloudflare account details
```

4. **Deploy to Cloudflare Workers**
```bash
npm run deploy
```

## 📡 API Endpoints

### System Information
- `GET /api/system` - Get system information and stats
- `GET /api/stats` - Get detailed performance statistics
- `GET /api/health` - Health check endpoint

### Application Management
- `GET /api/apps` - List all applications
- `POST /api/apps/start?id=<app-id>` - Start an application
- `POST /api/apps/stop?id=<app-id>` - Stop an application
- `POST /api/apps/restart?id=<app-id>` - Restart an application

## 🏗️ Architecture

### Frontend
- **Modern JavaScript** - ES6+ with classes and async/await
- **Responsive CSS** - Flexbox and Grid layouts
- **Font Awesome** - Beautiful icons throughout the interface
- **Real-time updates** - Auto-refresh and live status indicators

### Backend (Cloudflare Workers)
- **TypeScript** - Type-safe server-side code
- **Static file serving** - HTML, CSS, JS assets
- **API endpoints** - RESTful API for system management
- **Error handling** - Custom error pages and responses

## 📁 Project Structure

```
casaos-cloudflare-worker/
├── src/
│   └── index.ts              # Main Worker code
├── public/
│   ├── index.html            # Main dashboard
│   ├── styles.css            # Modern CSS styles
│   └── app.js               # Frontend JavaScript
├── wrangler.jsonc           # Cloudflare Workers config
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## 🎯 Default Applications

The system comes with pre-configured applications:

1. **Nginx Default** - Lightweight web server
2. **File Manager** - Web-based file management
3. **Media Server** - Stream and manage media files

## 🔧 Development

### Local Development
```bash
npm run dev
```

### Type Checking
```bash
npm run check
```

### Testing
```bash
npm test
```

## 🌐 Deployment

### Manual Deployment
1. Update `wrangler.jsonc` with your domain settings
2. Run `npm run deploy`
3. Configure routes in Cloudflare dashboard

### Environment Variables
- No environment variables required
- All configuration is in `wrangler.jsonc`

## 📊 Performance

- **Edge Computing** - Runs on 200+ Cloudflare locations
- **Fast Response** - Sub-100ms response times
- **Auto-scaling** - Handles traffic spikes automatically
- **Low latency** - Global CDN distribution

## 🔒 Security

- **HTTPS only** - All traffic encrypted
- **CORS headers** - Proper cross-origin handling
- **Input validation** - Sanitized API inputs
- **Error handling** - Secure error responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Issues** - Report bugs on GitHub
- **Documentation** - Check Cloudflare Workers docs
- **Community** - Join Cloudflare community forums

---

**Built with ❤️ for Cloudflare Workers**
