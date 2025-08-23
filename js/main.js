// ===== MAIN JAVASCRIPT - SIGPA Dashboard =====

import { Navigation } from './modules/navigation.js';
import { Dashboard } from './modules/dashboard.js';
import { WeatherService } from './services/weatherService.js';
import { OrdersService } from './services/ordersService.js';
import { ProductsService } from './services/productsService.js';

class SIGPADashboard {
    constructor() {
        this.navigation = null;
        this.dashboard = null;
        this.weatherService = null;
        this.ordersService = null;
        this.productsService = null;
        this.isInitialized = false;

        // Bind methods
        this.handleResize = this.handleResize.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        this.handleBeforeUnload = this.handleBeforeUnload.bind(this);

        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    async init() {
        try {
            console.log('🚀 Initializing SIGPA Dashboard...');

            // Initialize services
            await this.initializeServices();

            // Initialize modules
            this.initializeModules();

            // Setup event listeners
            this.setupEventListeners();

            // Initialize dashboard data
            await this.initializeDashboardData();

            // Mark as initialized
            this.isInitialized = true;

            console.log('✅ SIGPA Dashboard initialized successfully');

            // Trigger custom event for other modules
            this.dispatchEvent('dashboard:initialized');

        } catch (error) {
            console.error('❌ Failed to initialize SIGPA Dashboard:', error);
            this.showError('Error al inicializar el dashboard', error.message);
        }
    }

    async initializeServices() {
        try {
            // Initialize weather service
            this.weatherService = new WeatherService();
            await this.weatherService.initialize();

            // Initialize orders service
            this.ordersService = new OrdersService();
            await this.ordersService.initialize();

            // Initialize products service
            this.productsService = new ProductsService();
            await this.productsService.initialize();

            console.log('✅ Services initialized successfully');

        } catch (error) {
            console.error('❌ Failed to initialize services:', error);
            throw error;
        }
    }

    initializeModules() {
        try {
            // Initialize navigation
            this.navigation = new Navigation({
                sidebar: document.getElementById('sidebar'),
                sidebarToggle: document.getElementById('sidebarToggle'),
                mainContent: document.getElementById('mainContent')
            });

            // Initialize dashboard
            this.dashboard = new Dashboard({
                weatherWidget: document.getElementById('weatherWidget'),
                ordersTable: document.getElementById('ordersTable'),
                productsGrid: document.getElementById('productsGrid'),
                weatherService: this.weatherService,
                ordersService: this.ordersService,
                productsService: this.productsService
            });

            console.log('✅ Modules initialized successfully');

        } catch (error) {
            console.error('❌ Failed to initialize modules:', error);
            throw error;
        }
    }

    setupEventListeners() {
        try {
            // Window events
            window.addEventListener('resize', this.handleResize);
            window.addEventListener('beforeunload', this.handleBeforeUnload);

            // Page visibility events
            document.addEventListener('visibilitychange', this.handleVisibilityChange);

            // Custom events
            document.addEventListener('dashboard:refresh', () => this.refreshDashboard());
            document.addEventListener('sidebar:toggle', () => this.navigation.toggleSidebar());
            document.addEventListener('weather:update', () => this.updateWeather());

            console.log('✅ Event listeners setup successfully');

        } catch (error) {
            console.error('❌ Failed to setup event listeners:', error);
        }
    }

    async initializeDashboardData() {
        try {
            // Initialize weather data
            await this.updateWeather();

            // Initialize orders data
            await this.dashboard.loadOrders();

            // Initialize products data
            await this.dashboard.loadProducts();

            // Initialize KPIs
            await this.dashboard.loadKPIs();

            console.log('✅ Dashboard data initialized successfully');

        } catch (error) {
            console.error('❌ Failed to initialize dashboard data:', error);
        }
    }

    async refreshDashboard() {
        try {
            console.log('🔄 Refreshing dashboard...');

            // Show loading state
            this.showLoading();

            // Refresh all data
            await Promise.all([
                this.updateWeather(),
                this.dashboard.loadOrders(),
                this.dashboard.loadProducts(),
                this.dashboard.loadKPIs()
            ]);

            // Hide loading state
            this.hideLoading();

            console.log('✅ Dashboard refreshed successfully');

            // Show success message
            this.showSuccess('Dashboard actualizado', 'Los datos se han actualizado correctamente');

        } catch (error) {
            console.error('❌ Failed to refresh dashboard:', error);
            this.hideLoading();
            this.showError('Error al actualizar', 'No se pudieron actualizar los datos del dashboard');
        }
    }

    async updateWeather() {
        try {
            if (this.weatherService) {
                await this.weatherService.updateWeather();
            }
        } catch (error) {
            console.error('❌ Failed to update weather:', error);
        }
    }

    handleResize() {
        try {
            // Debounce resize events
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                if (this.navigation) {
                    this.navigation.handleResize();
                }
                if (this.dashboard) {
                    this.dashboard.handleResize();
                }
            }, 250);
        } catch (error) {
            console.error('❌ Error handling resize:', error);
        }
    }

    handleVisibilityChange() {
        try {
            if (document.hidden) {
                // Page is hidden, pause updates
                this.pauseUpdates();
            } else {
                // Page is visible, resume updates
                this.resumeUpdates();
            }
        } catch (error) {
            console.error('❌ Error handling visibility change:', error);
        }
    }

    handleBeforeUnload(event) {
        try {
            // Cleanup before page unload
            this.cleanup();

            // Show confirmation dialog if there are unsaved changes
            if (this.hasUnsavedChanges()) {
                event.preventDefault();
                event.returnValue = 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?';
                return event.returnValue;
            }
        } catch (error) {
            console.error('❌ Error handling before unload:', error);
        }
    }

    pauseUpdates() {
        try {
            console.log('⏸️ Pausing dashboard updates');

            // Pause weather updates
            if (this.weatherService) {
                this.weatherService.pauseUpdates();
            }

            // Pause orders updates
            if (this.ordersService) {
                this.ordersService.pauseUpdates();
            }

            // Pause products updates
            if (this.productsService) {
                this.productsService.pauseUpdates();
            }

        } catch (error) {
            console.error('❌ Error pausing updates:', error);
        }
    }

    resumeUpdates() {
        try {
            console.log('▶️ Resuming dashboard updates');

            // Resume weather updates
            if (this.weatherService) {
                this.weatherService.resumeUpdates();
            }

            // Resume orders updates
            if (this.ordersService) {
                this.ordersService.resumeUpdates();
            }

            // Resume products updates
            if (this.productsService) {
                this.productsService.resumeUpdates();
            }

        } catch (error) {
            console.error('❌ Error resuming updates:', error);
        }
    }

    hasUnsavedChanges() {
        // Check if there are any unsaved changes
        // This is a placeholder - implement based on your needs
        return false;
    }

    cleanup() {
        try {
            console.log('🧹 Cleaning up dashboard...');

            // Cleanup services
            if (this.weatherService) {
                this.weatherService.cleanup();
            }

            if (this.ordersService) {
                this.ordersService.cleanup();
            }

            if (this.productsService) {
                this.productsService.cleanup();
            }

            // Cleanup modules
            if (this.navigation) {
                this.navigation.cleanup();
            }

            if (this.dashboard) {
                this.dashboard.cleanup();
            }

            // Remove event listeners
            window.removeEventListener('resize', this.handleResize);
            window.removeEventListener('beforeunload', this.handleBeforeUnload);
            document.removeEventListener('visibilitychange', this.handleVisibilityChange);

            console.log('✅ Dashboard cleanup completed');

        } catch (error) {
            console.error('❌ Error during cleanup:', error);
        }
    }

    showLoading() {
        try {
            document.body.classList.add('loading');

            // Show loading spinner in header
            const header = document.querySelector('.dashboard-header');
            if (header) {
                const loadingSpinner = document.createElement('div');
                loadingSpinner.className = 'loading-spinner';
                loadingSpinner.innerHTML = '<div class="spinner spinner-sm"></div>';
                header.appendChild(loadingSpinner);
            }

        } catch (error) {
            console.error('❌ Error showing loading:', error);
        }
    }

    hideLoading() {
        try {
            document.body.classList.remove('loading');

            // Remove loading spinner from header
            const loadingSpinner = document.querySelector('.loading-spinner');
            if (loadingSpinner) {
                loadingSpinner.remove();
            }

        } catch (error) {
            console.error('❌ Error hiding loading:', error);
        }
    }

    showSuccess(title, message) {
        this.showNotification('success', title, message);
    }

    showError(title, message) {
        this.showNotification('error', title, message);
    }

    showWarning(title, message) {
        this.showNotification('warning', title, message);
    }

    showInfo(title, message) {
        this.showNotification('info', title, message);
    }

    showNotification(type, title, message) {
        try {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `alert alert-${type} notification-toast`;
            notification.innerHTML = `
                <div class="alert-icon">
                    <i class="bi bi-${this.getNotificationIcon(type)}"></i>
                </div>
                <div class="alert-content">
                    <div class="alert-title">${title}</div>
                    <div class="alert-message">${message}</div>
                </div>
                <button class="notification-close" onclick="this.parentElement.remove()">
                    <i class="bi bi-x"></i>
                </button>
            `;

            // Add to page
            document.body.appendChild(notification);

            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 5000);

        } catch (error) {
            console.error('❌ Error showing notification:', error);
        }
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-triangle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    dispatchEvent(eventName, detail = {}) {
        try {
            const event = new CustomEvent(eventName, {
                detail,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(event);
        } catch (error) {
            console.error('❌ Error dispatching event:', error);
        }
    }

    // Public API methods
    getNavigation() {
        return this.navigation;
    }

    getDashboard() {
        return this.dashboard;
    }

    getWeatherService() {
        return this.weatherService;
    }

    getOrdersService() {
        return this.ordersService;
    }

    getProductsService() {
        return this.productsService;
    }

    isReady() {
        return this.isInitialized;
    }
}

// Initialize the dashboard when the script loads
const sigpaDashboard = new SIGPADashboard();

// Export for global access (if needed)
window.SIGPADashboard = sigpaDashboard;

// Export for module usage
export default sigpaDashboard;
