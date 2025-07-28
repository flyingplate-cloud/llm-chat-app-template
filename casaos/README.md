# CasaOS Nginx Default App

A lightweight nginx-like web server application built for CasaOS. This template provides a simple web server with static file serving, basic routing, and HTTP status handling.

## Features

- 🚀 **Static File Serving** - Serve HTML, CSS, JS, images, and other static files
- 🔧 **API Endpoints** - Built-in API routes for status and debugging
- 📊 **Health Checks** - Monitor server status and uptime
- 🎨 **Modern UI** - Beautiful dashboard with real-time server information
- 🔒 **Security** - Built-in security headers and CORS support
- 📦 **Docker Ready** - Easy deployment with Docker and Docker Compose

## Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Installation

1. Clone this repository:
```bash
git clone <your-repo-url>
cd casaos
```

2. Start the application:
```bash
docker-compose up -d
```

3. Access the application:
   - Dashboard: http://localhost:3000
   - Health check: http://localhost:3000/health
   - Server info: http://localhost:3000/server-info

## Available Endpoints

### Web Routes
- `/` - Main dashboard page
- `/health` - Health check endpoint (JSON)
- `/server-info` - Server information (JSON)

### API Routes
- `/api/status` - API status and available endpoints
- `/api/echo` - Echo request details for debugging

## Configuration

### Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (default: production)

### Docker Configuration

The `docker-compose.yml` file contains the main configuration:

```yaml
services:
  nginx-default:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
```

## Development

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Access the application at http://localhost:3000

### Project Structure

```
├── server.js              # Main server code
├── package.json           # Dependencies and scripts
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose configuration
├── public/               # Static files
│   ├── index.html        # Main dashboard page
│   ├── styles.css        # Styles
│   └── app.js           # Client-side JavaScript
└── README.md            # This file
```

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `docker-compose up -d` - Start with Docker Compose
- `docker-compose down` - Stop Docker Compose services

## Customization

### Adding Static Files

Place any static files in the `public/` directory. They will be automatically served by the server.

### Adding API Routes

To add new API routes, modify the `server.js` file:

```javascript
app.get('/api/your-endpoint', (req, res) => {
  res.json({ message: 'Hello World' });
});
```

### Custom Error Pages

Modify the `ERROR_PAGES` object in `server.js` to customize error pages:

```javascript
const ERROR_PAGES = {
  404: `<!DOCTYPE html>...`,
  500: `<!DOCTYPE html>...`,
  // Add more error pages as needed
};
```

## Deployment

### Docker Deployment

1. Build and run with Docker:
```bash
docker build -t nginx-default-casaos .
docker run -p 3000:3000 nginx-default-casaos
```

2. Or use Docker Compose:
```bash
docker-compose up -d
```

### CasaOS Integration

This application is designed to work seamlessly with CasaOS. The Docker Compose configuration includes CasaOS-specific labels for easy integration.

## Monitoring

### Built-in Monitoring

The application includes several monitoring endpoints:

- **Health Check**: `/health` - Returns server status and memory usage
- **Server Info**: `/server-info` - Returns detailed server information
- **API Status**: `/api/status` - Returns API status and available endpoints

### Logging

The application uses Morgan for HTTP request logging. Logs are output to stdout/stderr for Docker container monitoring.

## Security

### Built-in Security Features

- **Helmet.js**: Automatic security headers
- **CORS**: Cross-origin resource sharing support
- **Compression**: Automatic response compression
- **Input Validation**: Basic request validation

### Custom Security

Add custom security middleware in `server.js`:

```javascript
app.use((req, res, next) => {
  // Custom security logic
  next();
});
```

## Performance

### Optimization Tips

1. **Use Compression**: Already enabled with compression middleware
2. **Static File Caching**: Configure appropriate cache headers
3. **Optimize Images**: Use WebP format and appropriate sizes
4. **Minimize Dependencies**: Keep the application bundle size small

### Performance Monitoring

Monitor performance using:
- Application logs
- Docker container metrics
- Custom performance endpoints

## Troubleshooting

### Common Issues

1. **Port Already in Use**: Change the port in docker-compose.yml
2. **Permission Issues**: Ensure proper file permissions
3. **Container Won't Start**: Check logs with `docker-compose logs`

### Debug Mode

Enable debug logging by setting environment variable:

```bash
NODE_ENV=development docker-compose up
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

- [CasaOS Documentation](https://docs.casaos.io/)
- [Docker Documentation](https://docs.docker.com/)
- [Express.js Documentation](https://expressjs.com/)

---

Built with ❤️ for CasaOS