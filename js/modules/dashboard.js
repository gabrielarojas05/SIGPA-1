// ===== DASHBOARD MODULE =====

export class Dashboard {
    constructor(config) {
        this.weatherWidget = config.weatherWidget;
        this.ordersTable = config.ordersTable;
        this.productsGrid = config.productsGrid;
        this.weatherService = config.weatherService;
        this.ordersService = config.ordersService;
        this.productsService = config.productsService;

        // KPI elements
        this.kpiElements = {
            totalProducts: document.getElementById('totalProducts'),
            connectedFarmers: document.getElementById('connectedFarmers'),
            activeSite: document.getElementById('activeSite')
        };

        // State
        this.isLoading = false;
        this.lastUpdate = null;

        // Bind methods
        this.handleResize = this.handleResize.bind(this);
        this.handleOrderClick = this.handleOrderClick.bind(this);
        this.handleProductClick = this.handleProductClick.bind(this);

        this.init();
    }

    init() {
        try {
            // Setup event listeners
            this.setupEventListeners();

            // Initialize dashboard components
            this.initializeComponents();

            console.log('✅ Dashboard module initialized');

        } catch (error) {
            console.error('❌ Failed to initialize Dashboard module:', error);
        }
    }

    setupEventListeners() {
        try {
            // Window resize
            window.addEventListener('resize', this.handleResize);

            // Custom events
            document.addEventListener('dashboard:refresh', () => this.refresh());
            document.addEventListener('orders:update', () => this.loadOrders());
            document.addEventListener('products:update', () => this.loadProducts());
            document.addEventListener('kpis:update', () => this.loadKPIs());

            console.log('✅ Dashboard event listeners setup successfully');

        } catch (error) {
            console.error('❌ Failed to setup dashboard event listeners:', error);
        }
    }

    initializeComponents() {
        try {
            // Initialize orders table
            this.initializeOrdersTable();

            // Initialize products grid
            this.initializeProductsGrid();

            // Initialize KPIs
            this.initializeKPIs();

            console.log('✅ Dashboard components initialized successfully');

        } catch (error) {
            console.error('❌ Failed to initialize dashboard components:', error);
        }
    }

    initializeOrdersTable() {
        try {
            if (!this.ordersTable) return;

            // Create table header
            const header = document.createElement('div');
            header.className = 'orders-header';
            header.innerHTML = `
                <div>Order ID</div>
                <div>Placed</div>
                <div>Accepted</div>
                <div>Harvested</div>
                <div>Loaded</div>
                <div>In Transit</div>
                <div>Delivered</div>
                <div>Received</div>
                <div>Payment</div>
                <div>Completed</div>
            `;

            this.ordersTable.appendChild(header);

            console.log('✅ Orders table initialized');

        } catch (error) {
            console.error('❌ Failed to initialize orders table:', error);
        }
    }

    initializeProductsGrid() {
        try {
            if (!this.productsGrid) return;

            // Clear existing content
            this.productsGrid.innerHTML = '';

            console.log('✅ Products grid initialized');

        } catch (error) {
            console.error('❌ Failed to initialize products grid:', error);
        }
    }

    initializeKPIs() {
        try {
            // Add loading state to KPI cards
            Object.values(this.kpiElements).forEach(element => {
                if (element) {
                    element.closest('.kpi-card').classList.add('loading');
                }
            });

            console.log('✅ KPIs initialized');

        } catch (error) {
            console.error('❌ Failed to initialize KPIs:', error);
        }
    }

    async loadKPIs() {
        try {
            console.log('📊 Loading KPIs...');

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update KPI values (in real app, these would come from API)
            const kpiData = {
                totalProducts: '62,783',
                connectedFarmers: '262',
                activeSite: '11.91%'
            };

            // Update DOM elements
            Object.entries(kpiData).forEach(([key, value]) => {
                const element = this.kpiElements[key];
                if (element) {
                    element.textContent = value;
                    element.closest('.kpi-card').classList.remove('loading');
                }
            });

            this.lastUpdate = new Date();

            console.log('✅ KPIs loaded successfully');

        } catch (error) {
            console.error('❌ Failed to load KPIs:', error);
            this.showKPIError();
        }
    }

    async loadOrders() {
        try {
            console.log('📋 Loading orders...');

            if (!this.ordersTable) return;

            // Clear existing orders (keep header)
            const header = this.ordersTable.querySelector('.orders-header');
            this.ordersTable.innerHTML = '';
            if (header) {
                this.ordersTable.appendChild(header);
            }

            // Get orders from service
            const orders = await this.ordersService.getOrders();

            // Render orders
            orders.forEach(order => {
                this.renderOrder(order);
            });

            console.log('✅ Orders loaded successfully');

        } catch (error) {
            console.error('❌ Failed to load orders:', error);
            this.showOrdersError();
        }
    }

    async loadProducts() {
        try {
            console.log('🛍️ Loading products...');

            if (!this.productsGrid) return;

            // Clear existing products
            this.productsGrid.innerHTML = '';

            // Get products from service
            const products = await this.productsService.getProducts();

            // Render products
            products.forEach(product => {
                this.renderProduct(product);
            });

            console.log('✅ Products loaded successfully');

        } catch (error) {
            console.error('❌ Failed to load products:', error);
            this.showProductsError();
        }
    }

    renderOrder(order) {
        try {
            const orderRow = document.createElement('div');
            orderRow.className = 'order-row';
            orderRow.setAttribute('data-order-id', order.id);

            // Create progress steps
            const progressSteps = this.createProgressSteps(order.status);

            orderRow.innerHTML = `
                <div class="order-id">${order.id}</div>
                ${progressSteps.map(step => `<div class="order-progress">${step}</div>`).join('')}
            `;

            // Add click handler
            orderRow.addEventListener('click', () => this.handleOrderClick(order));

            this.ordersTable.appendChild(orderRow);

        } catch (error) {
            console.error('❌ Failed to render order:', error);
        }
    }

    createProgressSteps(status) {
        try {
            const steps = ['Placed', 'Accepted', 'Harvested', 'Loaded', 'InTransit', 'Delivered', 'Received', 'Payment', 'Completed'];
            const currentStepIndex = steps.indexOf(status);

            return steps.map((step, index) => {
                let stepClass = 'progress-step';
                let lineClass = 'progress-line';

                if (index <= currentStepIndex) {
                    stepClass += ' completed';
                    lineClass += ' completed';
                } else if (index === currentStepIndex + 1) {
                    stepClass += ' current';
                }

                const stepElement = `<div class="${stepClass}"></div>`;
                const lineElement = index < steps.length - 1 ? `<div class="${lineClass}"></div>` : '';

                return stepElement + lineElement;
            });

        } catch (error) {
            console.error('❌ Failed to create progress steps:', error);
            return [];
        }
    }

    renderProduct(product) {
        try {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.setAttribute('data-product-id', product.id);

            productCard.innerHTML = `
                <div class="product-image">
                    ${product.image ? `<img src="${product.image}" alt="${product.name}">` : ''}
                </div>
                <div class="product-info">
                    <h4 class="product-name">${product.name}</h4>
                    <div class="product-price">${product.price}</div>
                    <div class="product-location">
                        <i class="bi bi-geo-alt"></i>
                        <span>${product.location}</span>
                    </div>
                </div>
            `;

            // Add click handler
            productCard.addEventListener('click', () => this.handleProductClick(product));

            this.productsGrid.appendChild(productCard);

        } catch (error) {
            console.error('❌ Failed to render product:', error);
        }
    }

    handleOrderClick(order) {
        try {
            console.log('📋 Order clicked:', order);

            // Show order details (placeholder for future implementation)
            this.showOrderDetails(order);

        } catch (error) {
            console.error('❌ Error handling order click:', error);
        }
    }

    handleProductClick(product) {
        try {
            console.log('🛍️ Product clicked:', product);

            // Show product details (placeholder for future implementation)
            this.showProductDetails(product);

        } catch (error) {
            console.error('❌ Error handling product click:', error);
        }
    }

    showOrderDetails(order) {
        try {
            // Create modal for order details
            const modal = document.createElement('div');
            modal.className = 'modal show';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">Order Details - ${order.id}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Status:</strong> ${order.status}</p>
                        <p><strong>Date:</strong> ${order.date}</p>
                        <p><strong>Customer:</strong> ${order.customer}</p>
                        <p><strong>Total:</strong> ${order.total}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary">View Full Details</button>
                        <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                    </div>
                </div>
            `;

            // Add close functionality
            const closeBtn = modal.querySelector('.modal-close');
            closeBtn.addEventListener('click', () => modal.remove());

            // Close on outside click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.remove();
            });

            document.body.appendChild(modal);

        } catch (error) {
            console.error('❌ Error showing order details:', error);
        }
    }

    showProductDetails(product) {
        try {
            // Create modal for product details
            const modal = document.createElement('div');
            modal.className = 'modal show';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">Product Details - ${product.name}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Price:</strong> ${product.price}</p>
                        <p><strong>Location:</strong> ${product.location}</p>
                        <p><strong>Category:</strong> ${product.category || 'N/A'}</p>
                        <p><strong>Description:</strong> ${product.description || 'No description available'}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary">Add to Cart</button>
                        <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                    </div>
                </div>
            `;

            // Add close functionality
            const closeBtn = modal.querySelector('.modal-close');
            closeBtn.addEventListener('click', () => modal.remove());

            // Close on outside click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.remove();
            });

            document.body.appendChild(modal);

        } catch (error) {
            console.error('❌ Error showing product details:', error);
        }
    }

    showKPIError() {
        try {
            Object.values(this.kpiElements).forEach(element => {
                if (element) {
                    element.textContent = 'Error';
                    element.closest('.kpi-card').classList.remove('loading');
                    element.closest('.kpi-card').classList.add('error');
                }
            });
        } catch (error) {
            console.error('❌ Error showing KPI error:', error);
        }
    }

    showOrdersError() {
        try {
            if (this.ordersTable) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'empty-state';
                errorDiv.innerHTML = `
                    <i class="bi bi-exclamation-triangle"></i>
                    <h4>Error Loading Orders</h4>
                    <p>No se pudieron cargar las órdenes. Inténtalo de nuevo más tarde.</p>
                `;

                // Clear table and show error
                this.ordersTable.innerHTML = '';
                this.ordersTable.appendChild(errorDiv);
            }
        } catch (error) {
            console.error('❌ Error showing orders error:', error);
        }
    }

    showProductsError() {
        try {
            if (this.productsGrid) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'empty-state';
                errorDiv.innerHTML = `
                    <i class="bi bi-exclamation-triangle"></i>
                    <h4>Error Loading Products</h4>
                    <p>No se pudieron cargar los productos. Inténtalo de nuevo más tarde.</p>
                `;

                // Clear grid and show error
                this.productsGrid.innerHTML = '';
                this.productsGrid.appendChild(errorDiv);
            }
        } catch (error) {
            console.error('❌ Error showing products error:', error);
        }
    }

    async refresh() {
        try {
            console.log('🔄 Refreshing dashboard...');

            this.isLoading = true;

            // Refresh all data
            await Promise.all([
                this.loadKPIs(),
                this.loadOrders(),
                this.loadProducts()
            ]);

            this.isLoading = false;
            this.lastUpdate = new Date();

            console.log('✅ Dashboard refreshed successfully');

        } catch (error) {
            console.error('❌ Failed to refresh dashboard:', error);
            this.isLoading = false;
        }
    }

    handleResize() {
        try {
            // Handle responsive adjustments
            if (window.innerWidth <= 768) {
                // Mobile adjustments
                this.adjustForMobile();
            } else {
                // Desktop adjustments
                this.adjustForDesktop();
            }
        } catch (error) {
            console.error('❌ Error handling resize:', error);
        }
    }

    adjustForMobile() {
        try {
            // Mobile-specific adjustments
            if (this.ordersTable) {
                this.ordersTable.style.fontSize = '0.875rem';
            }

            if (this.productsGrid) {
                this.productsGrid.style.gap = '1rem';
            }

        } catch (error) {
            console.error('❌ Error adjusting for mobile:', error);
        }
    }

    adjustForDesktop() {
        try {
            // Desktop-specific adjustments
            if (this.ordersTable) {
                this.ordersTable.style.fontSize = '1rem';
            }

            if (this.productsGrid) {
                this.productsGrid.style.gap = '1.5rem';
            }

        } catch (error) {
            console.error('❌ Error adjusting for desktop:', error);
        }
    }

    // Public API methods
    getLastUpdate() {
        return this.lastUpdate;
    }

    isLoading() {
        return this.isLoading;
    }

    // Cleanup method
    cleanup() {
        try {
            // Remove event listeners
            window.removeEventListener('resize', this.handleResize);

            // Clear intervals/timeouts if any
            if (this.refreshInterval) {
                clearInterval(this.refreshInterval);
            }

            console.log('✅ Dashboard module cleanup completed');

        } catch (error) {
            console.error('❌ Error during dashboard cleanup:', error);
        }
    }
}
