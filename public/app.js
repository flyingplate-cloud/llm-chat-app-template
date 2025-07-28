/**
 * Optimized Cloudflare Workers Nginx Dashboard
 */

const CONFIG = {
    apiBase: '/api',
    endpoints: { status: '/status', echo: '/echo', health: '/health', serverInfo: '/server-info' },
    updateInterval: 30000
};

// Utility functions
const Utils = {
    formatTime: (timestamp) => new Date(timestamp).toLocaleString(),
    
    formatUptime: (milliseconds) => {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        let uptimeStr = '';
        if (days > 0) uptimeStr += `${days}d `;
        if (hours % 24 > 0) uptimeStr += `${hours % 24}h `;
        if (minutes % 60 > 0) uptimeStr += `${minutes % 60}m `;
        uptimeStr += `${seconds % 60}s`;
        return uptimeStr;
    },

    showNotification: (message, type = 'info') => {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 1rem;
            border-radius: 5px; color: white; font-weight: bold; z-index: 1000;
            animation: slideIn 0.3s ease; background: ${type === 'success' ? '#28a745' : 
            type === 'error' ? '#dc3545' : '#17a2b8'};
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
};

// API client
const API = {
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${CONFIG.apiBase}${endpoint}`, {
                headers: { 'Content-Type': 'application/json', ...options.headers },
                ...options
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            Utils.showNotification(`API Error: ${error.message}`, 'error');
            throw error;
        }
    },

    async getStatus() { return this.request(CONFIG.endpoints.status); },
    async echo(data = {}) { return this.request(CONFIG.endpoints.echo, { method: 'POST', body: JSON.stringify(data) }); },
    async getHealth() { return (await fetch('/health')).json(); },
    async getServerInfo() { return (await fetch('/server-info')).json(); }
};

// Dashboard functionality
const Dashboard = {
    init() {
        console.log('🚀 Cloudflare Workers Nginx Dashboard initialized');
        this.updateServerInfo();
        this.startUptimeCounter();
        this.setupEventListeners();
        
        setInterval(() => this.updateServerInfo(), CONFIG.updateInterval);
    },

    async updateServerInfo() {
        try {
            const serverInfo = await API.getServerInfo();
            this.displayServerInfo(serverInfo);
        } catch (error) {
            console.error('Failed to update server info:', error);
        }
    },

    displayServerInfo(data) {
        const serverInfoElement = document.getElementById('server-info');
        if (!serverInfoElement) return;

        serverInfoElement.innerHTML = `
            <div class="info-item">
                <div class="info-label">Server</div>
                <div class="info-value">${data.server}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Version</div>
                <div class="info-value">${data.version}</div>
            </div>
            <div class="info-item">
                <div class="info-label">IP Address</div>
                <div class="info-value">${data.ip || 'Unknown'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Country</div>
                <div class="info-value">${data.country || 'Unknown'}</div>
            </div>
        `;
    },

    startUptimeCounter() {
        const startTime = Date.now();
        const uptimeElement = document.getElementById('uptime');
        
        if (!uptimeElement) return;
        
        setInterval(() => {
            const uptime = Date.now() - startTime;
            uptimeElement.textContent = Utils.formatUptime(uptime);
        }, 1000);
    },

    setupEventListeners() {
        const testApiBtn = document.getElementById('test-api-btn');
        if (testApiBtn) {
            testApiBtn.addEventListener('click', async () => {
                try {
                    const result = await API.echo({
                        message: 'Hello from dashboard!',
                        timestamp: new Date().toISOString()
                    });
                    Utils.showNotification('API test successful!', 'success');
                    console.log('API test result:', result);
                } catch (error) {
                    Utils.showNotification('API test failed!', 'error');
                }
            });
        }

        const healthCheckBtn = document.getElementById('health-check-btn');
        if (healthCheckBtn) {
            healthCheckBtn.addEventListener('click', async () => {
                try {
                    const health = await API.getHealth();
                    Utils.showNotification(`Health: ${health.status}`, 'success');
                    console.log('Health check result:', health);
                } catch (error) {
                    Utils.showNotification('Health check failed!', 'error');
                }
            });
        }
    }
};

// Performance monitoring
const Performance = {
    trackPageLoad() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            });
        }
    },

    async trackApiPerformance(apiCall) {
        const start = performance.now();
        try {
            const result = await apiCall();
            const duration = performance.now() - start;
            console.log('API response time:', duration.toFixed(2), 'ms');
            return result;
        } catch (error) {
            const duration = performance.now() - start;
            console.log('API error time:', duration.toFixed(2), 'ms');
            throw error;
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Dashboard.init();
    Performance.trackPageLoad();
    console.log('📊 Dashboard loaded successfully');
    console.log('🔧 Available endpoints:', Object.values(CONFIG.endpoints));
});

// Export for global access
window.NginxWorker = { API, Utils, Dashboard, Performance, CONFIG };