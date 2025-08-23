// ===== ORDERS SERVICE =====

export class OrdersService {
    constructor() {
        this.orders = [];
        this.lastUpdate = null;
        this.updateInterval = null;
        this.isPaused = false;

        // Mock data for demonstration
        this.mockOrders = [
            {
                id: 'ORD-001',
                status: 'Delivered',
                date: '2024-01-15',
                customer: 'Agricultor Juan Pérez',
                total: '₹15,000',
                items: ['Coco Verde', 'Coco Seco'],
                progress: 80,
                estimatedDelivery: '2024-01-20',
                location: 'Bowenpally, Hyderabad'
            },
            {
                id: 'ORD-002',
                status: 'Delivered',
                date: '2024-01-18',
                customer: 'Agricultor María García',
                total: '₹12,500',
                items: ['Coco Tender'],
                progress: 80,
                estimatedDelivery: '2024-01-25',
                location: 'Bowenpally, Hyderabad'
            },
            {
                id: 'ORD-003',
                status: 'Loaded',
                date: '2024-01-20',
                customer: 'Agricultor Carlos López',
                total: '₹18,750',
                items: ['Coco Verde', 'Coco Seco', 'Coco Tender'],
                progress: 40,
                estimatedDelivery: '2024-01-30',
                location: 'Bowenpally, Hyderabad'
            },
            {
                id: 'ORD-004',
                status: 'Accepted',
                date: '2024-01-22',
                customer: 'Agricultor Ana Rodríguez',
                total: '₹9,800',
                items: ['Coco Verde'],
                progress: 20,
                estimatedDelivery: '2024-02-05',
                location: 'Bowenpally, Hyderabad'
            },
            {
                id: 'ORD-005',
                status: 'Placed',
                date: '2024-01-25',
                customer: 'Agricultor Luis Martínez',
                total: '₹22,300',
                items: ['Coco Seco', 'Coco Tender'],
                progress: 10,
                estimatedDelivery: '2024-02-10',
                location: 'Bowenpally, Hyderabad'
            }
        ];

        // Bind methods
        this.updateOrders = this.updateOrders.bind(this);
        this.handleOrderUpdate = this.handleOrderUpdate.bind(this);
    }

    async initialize() {
        try {
            console.log('📋 Initializing Orders Service...');

            // Load initial orders
            await this.loadOrders();

            // Start periodic updates
            this.startUpdates();

            console.log('✅ Orders Service initialized successfully');

        } catch (error) {
            console.error('❌ Failed to initialize Orders Service:', error);
        }
    }

    async loadOrders() {
        try {
            console.log('📋 Loading orders...');

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // For now, use mock data
            // In real app, this would fetch from API
            this.orders = [...this.mockOrders];

            this.lastUpdate = new Date();

            console.log(`✅ Loaded ${this.orders.length} orders`);

        } catch (error) {
            console.error('❌ Failed to load orders:', error);
            throw error;
        }
    }

    async getOrders() {
        try {
            // Return cached orders if available
            if (this.orders.length > 0) {
                return this.orders;
            }

            // Load orders if not cached
            await this.loadOrders();
            return this.orders;

        } catch (error) {
            console.error('❌ Failed to get orders:', error);
            return [];
        }
    }

    async getOrderById(orderId) {
        try {
            const orders = await this.getOrders();
            return orders.find(order => order.id === orderId);

        } catch (error) {
            console.error('❌ Failed to get order by ID:', error);
            return null;
        }
    }

    async getOrdersByStatus(status) {
        try {
            const orders = await this.getOrders();
            return orders.filter(order => order.status === status);

        } catch (error) {
            console.error('❌ Failed to get orders by status:', error);
            return [];
        }
    }

    async getOrdersByCustomer(customerName) {
        try {
            const orders = await this.getOrders();
            return orders.filter(order =>
                order.customer.toLowerCase().includes(customerName.toLowerCase())
            );

        } catch (error) {
            console.error('❌ Failed to get orders by customer:', error);
            return [];
        }
    }

    async createOrder(orderData) {
        try {
            console.log('📋 Creating new order:', orderData);

            // Generate new order ID
            const newOrderId = `ORD-${String(this.orders.length + 1).padStart(3, '0')}`;

            const newOrder = {
                id: newOrderId,
                status: 'Placed',
                date: new Date().toISOString().split('T')[0],
                customer: orderData.customer || 'Nuevo Cliente',
                total: orderData.total || '₹0',
                items: orderData.items || [],
                progress: 10,
                estimatedDelivery: this.calculateEstimatedDelivery(),
                location: orderData.location || 'Bowenpally, Hyderabad',
                createdAt: new Date().toISOString()
            };

            // Add to orders array
            this.orders.unshift(newOrder);

            // Update last update time
            this.lastUpdate = new Date();

            // Dispatch order created event
            this.dispatchEvent('order:created', { order: newOrder });

            console.log('✅ Order created successfully:', newOrder.id);

            return newOrder;

        } catch (error) {
            console.error('❌ Failed to create order:', error);
            throw error;
        }
    }

    async updateOrderStatus(orderId, newStatus) {
        try {
            console.log(`📋 Updating order ${orderId} status to: ${newStatus}`);

            const order = this.orders.find(o => o.id === orderId);
            if (!order) {
                throw new Error(`Order ${orderId} not found`);
            }

            // Update status
            order.status = newStatus;

            // Update progress based on status
            order.progress = this.calculateProgress(newStatus);

            // Update last modified
            order.lastModified = new Date().toISOString();

            // Update last update time
            this.lastUpdate = new Date();

            // Dispatch order updated event
            this.dispatchEvent('order:updated', {
                orderId,
                oldStatus: order.status,
                newStatus,
                order
            });

            console.log(`✅ Order ${orderId} status updated to ${newStatus}`);

            return order;

        } catch (error) {
            console.error('❌ Failed to update order status:', error);
            throw error;
        }
    }

    async deleteOrder(orderId) {
        try {
            console.log(`📋 Deleting order: ${orderId}`);

            const orderIndex = this.orders.findIndex(o => o.id === orderId);
            if (orderIndex === -1) {
                throw new Error(`Order ${orderId} not found`);
            }

            const deletedOrder = this.orders.splice(orderIndex, 1)[0];

            // Update last update time
            this.lastUpdate = new Date();

            // Dispatch order deleted event
            this.dispatchEvent('order:deleted', { orderId, order: deletedOrder });

            console.log(`✅ Order ${orderId} deleted successfully`);

            return deletedOrder;

        } catch (error) {
            console.error('❌ Failed to delete order:', error);
            throw error;
        }
    }

    calculateProgress(status) {
        try {
            const statusProgress = {
                'Placed': 10,
                'Accepted': 20,
                'Harvested': 30,
                'Loaded': 40,
                'InTransit': 60,
                'Delivered': 80,
                'Received': 90,
                'Payment': 95,
                'Completed': 100
            };

            return statusProgress[status] || 0;

        } catch (error) {
            console.error('❌ Error calculating progress:', error);
            return 0;
        }
    }

    calculateEstimatedDelivery() {
        try {
            // Calculate estimated delivery date (7-14 days from now)
            const today = new Date();
            const estimatedDays = Math.floor(Math.random() * 8) + 7; // 7-14 days
            const estimatedDate = new Date(today);
            estimatedDate.setDate(today.getDate() + estimatedDays);

            return estimatedDate.toISOString().split('T')[0];

        } catch (error) {
            console.error('❌ Error calculating estimated delivery:', error);
            return new Date().toISOString().split('T')[0];
        }
    }

    getOrderStatistics() {
        try {
            const totalOrders = this.orders.length;
            const completedOrders = this.orders.filter(o => o.status === 'Completed').length;
            const pendingOrders = this.orders.filter(o => o.status !== 'Completed').length;
            const totalValue = this.orders.reduce((sum, o) => {
                const value = parseFloat(o.total.replace('₹', '').replace(',', ''));
                return sum + (isNaN(value) ? 0 : value);
            }, 0);

            return {
                totalOrders,
                completedOrders,
                pendingOrders,
                totalValue: `₹${totalValue.toLocaleString()}`,
                completionRate: totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : 0
            };

        } catch (error) {
            console.error('❌ Error getting order statistics:', error);
            return {
                totalOrders: 0,
                completedOrders: 0,
                pendingOrders: 0,
                totalValue: '₹0',
                completionRate: 0
            };
        }
    }

    async updateOrders() {
        try {
            if (this.isPaused) return;

            console.log('📋 Updating orders...');

            // Simulate real-time updates
            // In real app, this would poll the API for updates
            await this.loadOrders();

            // Dispatch update event
            this.dispatchEvent('orders:updated', {
                orders: this.orders,
                lastUpdate: this.lastUpdate
            });

        } catch (error) {
            console.error('❌ Failed to update orders:', error);
        }
    }

    startUpdates() {
        try {
            // Update immediately
            this.updateOrders();

            // Set up periodic updates (every 5 minutes)
            this.updateInterval = setInterval(() => {
                this.updateOrders();
            }, 5 * 60 * 1000);

            console.log('✅ Orders updates started');

        } catch (error) {
            console.error('❌ Error starting orders updates:', error);
        }
    }

    pauseUpdates() {
        try {
            this.isPaused = true;
            console.log('⏸️ Orders updates paused');
        } catch (error) {
            console.error('❌ Error pausing orders updates:', error);
        }
    }

    resumeUpdates() {
        try {
            this.isPaused = false;
            console.log('▶️ Orders updates resumed');

            // Update immediately when resuming
            this.updateOrders();
        } catch (error) {
            console.error('❌ Error resuming orders updates:', error);
        }
    }

    handleOrderUpdate(event) {
        try {
            const { orderId, newStatus } = event.detail;
            this.updateOrderStatus(orderId, newStatus);
        } catch (error) {
            console.error('❌ Error handling order update:', error);
        }
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

    // Search and filtering methods
    async searchOrders(query) {
        try {
            const orders = await this.getOrders();

            if (!query || query.trim() === '') {
                return orders;
            }

            const searchTerm = query.toLowerCase().trim();

            return orders.filter(order =>
                order.id.toLowerCase().includes(searchTerm) ||
                order.customer.toLowerCase().includes(searchTerm) ||
                order.status.toLowerCase().includes(searchTerm) ||
                order.items.some(item => item.toLowerCase().includes(searchTerm))
            );

        } catch (error) {
            console.error('❌ Error searching orders:', error);
            return [];
        }
    }

    async filterOrders(filters) {
        try {
            const orders = await this.getOrders();

            return orders.filter(order => {
                // Status filter
                if (filters.status && order.status !== filters.status) {
                    return false;
                }

                // Date range filter
                if (filters.startDate && new Date(order.date) < new Date(filters.startDate)) {
                    return false;
                }

                if (filters.endDate && new Date(order.date) > new Date(filters.endDate)) {
                    return false;
                }

                // Customer filter
                if (filters.customer && !order.customer.toLowerCase().includes(filters.customer.toLowerCase())) {
                    return false;
                }

                // Amount range filter
                if (filters.minAmount || filters.maxAmount) {
                    const amount = parseFloat(order.total.replace('₹', '').replace(',', ''));

                    if (filters.minAmount && amount < filters.minAmount) {
                        return false;
                    }

                    if (filters.maxAmount && amount > filters.maxAmount) {
                        return false;
                    }
                }

                return true;
            });

        } catch (error) {
            console.error('❌ Error filtering orders:', error);
            return [];
        }
    }

    // Export methods
    async exportOrders(format = 'json') {
        try {
            const orders = await this.getOrders();

            switch (format.toLowerCase()) {
                case 'json':
                    return JSON.stringify(orders, null, 2);

                case 'csv':
                    return this.convertToCSV(orders);

                case 'pdf':
                    // Placeholder for PDF export
                    console.log('PDF export not implemented yet');
                    return null;

                default:
                    throw new Error(`Unsupported export format: ${format}`);
            }

        } catch (error) {
            console.error('❌ Error exporting orders:', error);
            throw error;
        }
    }

    convertToCSV(orders) {
        try {
            if (orders.length === 0) return '';

            const headers = ['ID', 'Status', 'Date', 'Customer', 'Total', 'Items', 'Progress', 'Estimated Delivery', 'Location'];
            const csvRows = [headers.join(',')];

            orders.forEach(order => {
                const row = [
                    order.id,
                    order.status,
                    order.date,
                    `"${order.customer}"`,
                    order.total,
                    `"${order.items.join('; ')}"`,
                    order.progress,
                    order.estimatedDelivery,
                    `"${order.location}"`
                ];
                csvRows.push(row.join(','));
            });

            return csvRows.join('\n');

        } catch (error) {
            console.error('❌ Error converting to CSV:', error);
            return '';
        }
    }

    // Public API methods
    getLastUpdate() {
        return this.lastUpdate;
    }

    getOrderCount() {
        return this.orders.length;
    }

    // Cleanup method
    cleanup() {
        try {
            // Clear update interval
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
                this.updateInterval = null;
            }

            console.log('✅ Orders Service cleanup completed');

        } catch (error) {
            console.error('❌ Error during orders service cleanup:', error);
        }
    }
}
