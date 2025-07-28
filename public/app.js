/**
 * Cloudflare Workers Nginx - Demo JavaScript
 * This file demonstrates static JavaScript serving
 */

// Global configuration
const CONFIG = {
    apiBase: '/api',
    endpoints: {
        status: '/status',
        echo: '/echo',
        health: '/health',
        serverInfo: '/server-info'
    },
    updateInterval: 30000 // 30 seconds
};

// Utility functions
const Utils = {
    /**
     * Format timestamp
     */
    formatTime: (timestamp) => {
        return new Date(timestamp).toLocaleString();
    },

    /**
     * Format uptime
     */
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

    /**
     * Show notification
     */
    showNotification: (message, type = 'info') => {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        if (type === 'success') {
            notification.style.background = '#28a745';
        } else if (type === 'error') {
            notification.style.background = '#dc3545';
        } else {
            notification.style.background = '#17a2b8';
        }
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
};

// API client
const API = {
    /**
     * Make API request
     */
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${CONFIG.apiBase}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            Utils.showNotification(`API Error: ${error.message}`, 'error');
            throw error;
        }
    },

    /**
     * Get server status
     */
    async getStatus() {
        return this.request(CONFIG.endpoints.status);
    },

    /**
     * Echo request details
     */
    async echo(data = {}) {
        return this.request(CONFIG.endpoints.echo, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    /**
     * Get health status
     */
    async getHealth() {
        const response = await fetch('/health');
        return response.json();
    },

    /**
     * Get server info
     */
    async getServerInfo() {
        const response = await fetch('/server-info');
        return response.json();
    }
};

// Dashboard functionality
const Dashboard = {
    /**
     * Initialize dashboard
     */
    init() {
        console.log('🚀 Cloudflare Workers Nginx Dashboard initialized');
        this.updateServerInfo();
        this.startUptimeCounter();
        this.setupEventListeners();
        
        // Update server info periodically
        setInterval(() => {
            this.updateServerInfo();
        }, CONFIG.updateInterval);
    },

    /**
     * Update server information
     */
    async updateServerInfo() {
        try {
            const serverInfo = await API.getServerInfo();
            this.displayServerInfo(serverInfo);
        } catch (error) {
            console.error('Failed to update server info:', error);
        }
    },

    /**
     * Display server information
     */
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

    /**
     * Start uptime counter
     */
    startUptimeCounter() {
        const startTime = Date.now();
        const uptimeElement = document.getElementById('uptime');
        
        if (!uptimeElement) return;
        
        setInterval(() => {
            const uptime = Date.now() - startTime;
            uptimeElement.textContent = Utils.formatUptime(uptime);
        }, 1000);
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Test API button
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

        // Health check button
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
    /**
     * Track page load performance
     */
    trackPageLoad() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            });
        }
    },

    /**
     * Track API response times
     */
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
    
    // Add some demo functionality
    console.log('📊 Dashboard loaded successfully');
    console.log('🔧 Available endpoints:', Object.values(CONFIG.endpoints));
});

// Export for global access
window.NginxWorker = {
    API,
    Utils,
    Dashboard,
    Performance,
    CONFIG
};