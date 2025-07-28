/**
 * CasaOS Cloudflare Worker - Frontend JavaScript
 */

class CasaOSApp {
    constructor() {
        this.currentFilter = 'all';
        this.apps = [];
        this.systemInfo = {};
        this.performanceStats = {};
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.startAutoRefresh();
    }

    async loadData() {
        try {
            await Promise.all([
                this.loadSystemInfo(),
                this.loadApps(),
                this.loadPerformanceStats()
            ]);
            this.updateUI();
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Failed to load data. Please refresh the page.');
        }
    }

    async loadSystemInfo() {
        const response = await fetch('/api/system');
        this.systemInfo = await response.json();
    }

    async loadApps() {
        const response = await fetch('/api/apps');
        const data = await response.json();
        this.apps = data.apps;
    }

    async loadPerformanceStats() {
        const response = await fetch('/api/stats');
        this.performanceStats = await response.json();
    }

    updateUI() {
        this.updateSystemStats();
        this.updateAppsGrid();
        this.updatePerformanceMetrics();
    }

    updateSystemStats() {
        const { systemInfo } = this;
        
        // CPU Usage
        const cpuElement = document.getElementById('cpu-usage');
        if (cpuElement) {
            cpuElement.textContent = `${systemInfo.cpu?.usage?.toFixed(1) || 0}%`;
        }

        // Memory Usage
        const memoryElement = document.getElementById('memory-usage');
        if (memoryElement && systemInfo.memory) {
            const used = systemInfo.memory.used;
            const total = systemInfo.memory.total;
            const percentage = ((used / total) * 100).toFixed(1);
            memoryElement.textContent = `${percentage}%`;
        }

        // Storage Usage
        const storageElement = document.getElementById('storage-usage');
        if (storageElement && systemInfo.storage) {
            const used = systemInfo.storage.used;
            const total = systemInfo.storage.total;
            const percentage = ((used / total) * 100).toFixed(1);
            storageElement.textContent = `${percentage}%`;
        }

        // Network Connections
        const networkElement = document.getElementById('network-connections');
        if (networkElement) {
            networkElement.textContent = systemInfo.network?.connections || 0;
        }
    }

    updateAppsGrid() {
        const appsGrid = document.getElementById('apps-grid');
        if (!appsGrid) return;

        const filteredApps = this.filterApps(this.apps, this.currentFilter);
        
        appsGrid.innerHTML = filteredApps.map(app => this.createAppCard(app)).join('');
        
        // Add event listeners to app cards
        appsGrid.querySelectorAll('.app-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.app-actions')) {
                    this.showAppDetails(card.dataset.appId);
                }
            });
        });
    }

    filterApps(apps, filter) {
        if (filter === 'all') return apps;
        return apps.filter(app => app.status === filter);
    }

    createAppCard(app) {
        const statusClass = `app-status ${app.status}`;
        const statusText = app.status.charAt(0).toUpperCase() + app.status.slice(1);
        
        return `
            <div class="app-card" data-app-id="${app.id}">
                <div class="app-header">
                    <div class="app-icon">${app.icon}</div>
                    <div class="app-info">
                        <h3>${app.name}</h3>
                        <p class="app-description">${app.description}</p>
                    </div>
                </div>
                <div class="${statusClass}">
                    <i class="fas fa-circle"></i>
                    ${statusText}
                </div>
                <div class="app-actions">
                    ${this.createAppActions(app)}
                </div>
            </div>
        `;
    }

    createAppActions(app) {
        const actions = [];
        
        if (app.status === 'running') {
            actions.push(`
                <button class="btn btn-danger" onclick="appManager.stopApp('${app.id}')">
                    <i class="fas fa-stop"></i> Stop
                </button>
            `);
        } else {
            actions.push(`
                <button class="btn btn-success" onclick="appManager.startApp('${app.id}')">
                    <i class="fas fa-play"></i> Start
                </button>
            `);
        }
        
        actions.push(`
            <button class="btn btn-secondary" onclick="appManager.restartApp('${app.id}')">
                <i class="fas fa-redo"></i> Restart
            </button>
        `);
        
        return actions.join('');
    }

    updatePerformanceMetrics() {
        const { performanceStats } = this;
        
        // Response Time
        const responseTimeElement = document.getElementById('response-time');
        if (responseTimeElement && performanceStats.performance) {
            responseTimeElement.textContent = `${performanceStats.performance.responseTime?.toFixed(1) || 0}ms`;
        }

        // Requests per second
        const requestsElement = document.getElementById('requests-per-sec');
        if (requestsElement && performanceStats.performance) {
            requestsElement.textContent = `${Math.round(performanceStats.performance.requestsPerSecond || 0)}/s`;
        }

        // Error Rate
        const errorRateElement = document.getElementById('error-rate');
        if (errorRateElement && performanceStats.performance) {
            errorRateElement.textContent = `${performanceStats.performance.errorRate?.toFixed(2) || 0}%`;
        }
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.updateAppsGrid();
            });
        });

        // Refresh button
        const refreshBtn = document.querySelector('.btn-secondary');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshData());
        }
    }

    async refreshData() {
        const refreshBtn = document.querySelector('.btn-secondary i');
        if (refreshBtn) {
            refreshBtn.classList.add('fa-spin');
        }
        
        await this.loadData();
        
        if (refreshBtn) {
            refreshBtn.classList.remove('fa-spin');
        }
    }

    startAutoRefresh() {
        // Refresh data every 30 seconds
        setInterval(() => {
            this.loadData();
        }, 30000);
    }

    showAppDetails(appId) {
        const app = this.apps.find(a => a.id === appId);
        if (!app) return;

        const modal = document.getElementById('app-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');

        modalTitle.textContent = app.name;
        modalBody.innerHTML = this.createAppDetailsHTML(app);
        
        modal.style.display = 'block';
    }

    createAppDetailsHTML(app) {
        return `
            <div class="app-details">
                <div class="detail-row">
                    <strong>Status:</strong>
                    <span class="status-badge ${app.status}">${app.status}</span>
                </div>
                <div class="detail-row">
                    <strong>Description:</strong>
                    <span>${app.description}</span>
                </div>
                <div class="detail-row">
                    <strong>Version:</strong>
                    <span>${app.version}</span>
                </div>
                <div class="detail-row">
                    <strong>Category:</strong>
                    <span>${app.category}</span>
                </div>
                <div class="detail-row">
                    <strong>Port:</strong>
                    <span>${app.port}</span>
                </div>
                <div class="detail-row">
                    <strong>URL:</strong>
                    <a href="${app.url}" target="_blank">${app.url}</a>
                </div>
                <div class="detail-row">
                    <strong>Last Updated:</strong>
                    <span>${new Date(app.lastUpdated).toLocaleString()}</span>
                </div>
            </div>
            <div class="app-actions-modal">
                <button class="btn btn-primary" onclick="appManager.openApp('${app.id}')">
                    <i class="fas fa-external-link-alt"></i> Open App
                </button>
                ${app.status === 'running' ? 
                    `<button class="btn btn-danger" onclick="appManager.stopApp('${app.id}')">
                        <i class="fas fa-stop"></i> Stop App
                    </button>` :
                    `<button class="btn btn-success" onclick="appManager.startApp('${app.id}')">
                        <i class="fas fa-play"></i> Start App
                    </button>`
                }
            </div>
        `;
    }

    showError(message) {
        // Create a simple error notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f44336;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// App Manager for handling app actions
class AppManager {
    async startApp(appId) {
        try {
            const response = await fetch(`/api/apps/start?id=${appId}`);
            const result = await response.json();
            
            if (result.success) {
                this.showNotification(`App ${appId} started successfully`, 'success');
                appManager.refreshData();
            } else {
                this.showNotification(`Failed to start app ${appId}`, 'error');
            }
        } catch (error) {
            console.error('Error starting app:', error);
            this.showNotification(`Error starting app ${appId}`, 'error');
        }
    }

    async stopApp(appId) {
        try {
            const response = await fetch(`/api/apps/stop?id=${appId}`);
            const result = await response.json();
            
            if (result.success) {
                this.showNotification(`App ${appId} stopped successfully`, 'success');
                appManager.refreshData();
            } else {
                this.showNotification(`Failed to stop app ${appId}`, 'error');
            }
        } catch (error) {
            console.error('Error stopping app:', error);
            this.showNotification(`Error stopping app ${appId}`, 'error');
        }
    }

    async restartApp(appId) {
        try {
            const response = await fetch(`/api/apps/restart?id=${appId}`);
            const result = await response.json();
            
            if (result.success) {
                this.showNotification(`App ${appId} restarted successfully`, 'success');
                appManager.refreshData();
            } else {
                this.showNotification(`Failed to restart app ${appId}`, 'error');
            }
        } catch (error) {
            console.error('Error restarting app:', error);
            this.showNotification(`Error restarting app ${appId}`, 'error');
        }
    }

    openApp(appId) {
        const app = appManager.apps.find(a => a.id === appId);
        if (app && app.url) {
            window.open(app.url, '_blank');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Global functions
function closeModal() {
    document.getElementById('app-modal').style.display = 'none';
}

function refreshData() {
    appManager.refreshData();
}

// Initialize the application
let appManager;
document.addEventListener('DOMContentLoaded', () => {
    appManager = new CasaOSApp();
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('app-modal');
    if (e.target === modal) {
        closeModal();
    }
});