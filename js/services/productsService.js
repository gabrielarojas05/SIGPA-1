// ===== PRODUCTS SERVICE =====

export class ProductsService {
    constructor() {
        this.products = [];
        this.lastUpdate = null;
        this.updateInterval = null;
        this.isPaused = false;

        // Mock data for demonstration
        this.mockProducts = [
            {
                id: 'PROD-001',
                name: 'Coco Verde',
                category: 'Cocos',
                price: '₹50-60/Piece',
                priceRange: { min: 50, max: 60, currency: '₹', unit: 'Piece' },
                location: 'Bowenpally (3 KM)',
                description: 'Coco verde fresco y jugoso, perfecto para consumo directo',
                image: null,
                stock: 150,
                unit: 'Piece',
                supplier: 'Agricultor Juan Pérez',
                rating: 4.5,
                reviews: 23,
                tags: ['fresco', 'jugoso', 'natural'],
                lastUpdated: '2024-01-25'
            },
            {
                id: 'PROD-002',
                name: 'Coco Karnataka',
                category: 'Cocos',
                price: '₹50-60/Piece',
                priceRange: { min: 50, max: 60, currency: '₹', unit: 'Piece' },
                location: 'Bowenpally (3 KM)',
                description: 'Coco de la región de Karnataka, conocido por su dulzura',
                image: null,
                stock: 120,
                unit: 'Piece',
                supplier: 'Agricultor María García',
                rating: 4.3,
                reviews: 18,
                tags: ['dulce', 'karnataka', 'premium'],
                lastUpdated: '2024-01-25'
            },
            {
                id: 'PROD-003',
                name: 'Coco Kerala',
                category: 'Cocos',
                price: '₹50-60/Piece',
                priceRange: { min: 50, max: 60, currency: '₹', unit: 'Piece' },
                location: 'Bowenpally (3 KM)',
                description: 'Coco de Kerala, famoso por su calidad y sabor único',
                image: null,
                stock: 95,
                unit: 'Piece',
                supplier: 'Agricultor Carlos López',
                rating: 4.7,
                reviews: 31,
                tags: ['kerala', 'calidad', 'sabor'],
                lastUpdated: '2024-01-25'
            },
            {
                id: 'PROD-004',
                name: 'Coco Seco',
                category: 'Cocos',
                price: '₹80-100/Kg',
                priceRange: { min: 80, max: 100, currency: '₹', unit: 'Kg' },
                location: 'Bowenpally (5 KM)',
                description: 'Coco seco de alta calidad, perfecto para cocina y repostería',
                image: null,
                stock: 200,
                unit: 'Kg',
                supplier: 'Agricultor Ana Rodríguez',
                rating: 4.2,
                reviews: 15,
                tags: ['seco', 'cocina', 'repostería'],
                lastUpdated: '2024-01-25'
            },
            {
                id: 'PROD-005',
                name: 'Coco Rallado',
                category: 'Cocos Procesados',
                price: '₹120-150/Kg',
                priceRange: { min: 120, max: 150, currency: '₹', unit: 'Kg' },
                location: 'Bowenpally (2 KM)',
                description: 'Coco rallado fresco, listo para usar en recetas',
                image: null,
                stock: 75,
                unit: 'Kg',
                supplier: 'Agricultor Luis Martínez',
                rating: 4.6,
                reviews: 28,
                tags: ['rallado', 'fresco', 'listo'],
                lastUpdated: '2024-01-25'
            },
            {
                id: 'PROD-006',
                name: 'Aceite de Coco',
                category: 'Aceites',
                price: '₹300-400/Litro',
                priceRange: { min: 300, max: 400, currency: '₹', unit: 'Litro' },
                location: 'Bowenpally (8 KM)',
                description: 'Aceite de coco virgen extra, prensado en frío',
                image: null,
                stock: 45,
                unit: 'Litro',
                supplier: 'Agricultor Sofía Fernández',
                rating: 4.8,
                reviews: 42,
                tags: ['aceite', 'virgen', 'prensado'],
                lastUpdated: '2024-01-25'
            }
        ];

        // Bind methods
        this.updateProducts = this.updateProducts.bind(this);
        this.handleProductUpdate = this.handleProductUpdate.bind(this);
    }

    async initialize() {
        try {
            console.log('🛍️ Initializing Products Service...');

            // Load initial products
            await this.loadProducts();

            // Start periodic updates
            this.startUpdates();

            console.log('✅ Products Service initialized successfully');

        } catch (error) {
            console.error('❌ Failed to initialize Products Service:', error);
        }
    }

    async loadProducts() {
        try {
            console.log('🛍️ Loading products...');

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 600));

            // For now, use mock data
            // In real app, this would fetch from API
            this.products = [...this.mockProducts];

            this.lastUpdate = new Date();

            console.log(`✅ Loaded ${this.products.length} products`);

        } catch (error) {
            console.error('❌ Failed to load products:', error);
            throw error;
        }
    }

    async getProducts() {
        try {
            // Return cached products if available
            if (this.products.length > 0) {
                return this.products;
            }

            // Load products if not cached
            await this.loadProducts();
            return this.products;

        } catch (error) {
            console.error('❌ Failed to get products:', error);
            return [];
        }
    }

    async getProductById(productId) {
        try {
            const products = await this.getProducts();
            return products.find(product => product.id === productId);

        } catch (error) {
            console.error('❌ Failed to get product by ID:', error);
            return null;
        }
    }

    async getProductsByCategory(category) {
        try {
            const products = await this.getProducts();
            return products.filter(product => product.category === category);

        } catch (error) {
            console.error('❌ Failed to get products by category:', error);
            return [];
        }
    }

    async getProductsByLocation(location) {
        try {
            const products = await this.getProducts();
            return products.filter(product =>
                product.location.toLowerCase().includes(location.toLowerCase())
            );

        } catch (error) {
            console.error('❌ Failed to get products by location:', error);
            return [];
        }
    }

    async getProductsByPriceRange(minPrice, maxPrice) {
        try {
            const products = await this.getProducts();
            return products.filter(product => {
                const avgPrice = (product.priceRange.min + product.priceRange.max) / 2;
                return avgPrice >= minPrice && avgPrice <= maxPrice;
            });

        } catch (error) {
            console.error('❌ Failed to get products by price range:', error);
            return [];
        }
    }

    async createProduct(productData) {
        try {
            console.log('🛍️ Creating new product:', productData);

            // Generate new product ID
            const newProductId = `PROD-${String(this.products.length + 1).padStart(3, '0')}`;

            const newProduct = {
                id: newProductId,
                name: productData.name || 'Nuevo Producto',
                category: productData.category || 'Sin Categoría',
                price: productData.price || '₹0',
                priceRange: productData.priceRange || { min: 0, max: 0, currency: '₹', unit: 'Piece' },
                location: productData.location || 'Ubicación no especificada',
                description: productData.description || 'Sin descripción',
                image: productData.image || null,
                stock: productData.stock || 0,
                unit: productData.unit || 'Piece',
                supplier: productData.supplier || 'Proveedor no especificado',
                rating: 0,
                reviews: 0,
                tags: productData.tags || [],
                lastUpdated: new Date().toISOString().split('T')[0],
                createdAt: new Date().toISOString()
            };

            // Add to products array
            this.products.unshift(newProduct);

            // Update last update time
            this.lastUpdate = new Date();

            // Dispatch product created event
            this.dispatchEvent('product:created', { product: newProduct });

            console.log('✅ Product created successfully:', newProduct.id);

            return newProduct;

        } catch (error) {
            console.error('❌ Failed to create product:', error);
            throw error;
        }
    }

    async updateProduct(productId, updateData) {
        try {
            console.log(`🛍️ Updating product: ${productId}`);

            const product = this.products.find(p => p.id === productId);
            if (!product) {
                throw new Error(`Product ${productId} not found`);
            }

            // Update product data
            Object.assign(product, updateData);

            // Update last modified
            product.lastUpdated = new Date().toISOString().split('T')[0];

            // Update last update time
            this.lastUpdate = new Date();

            // Dispatch product updated event
            this.dispatchEvent('product:updated', {
                productId,
                product,
                updates: updateData
            });

            console.log(`✅ Product ${productId} updated successfully`);

            return product;

        } catch (error) {
            console.error('❌ Failed to update product:', error);
            throw error;
        }
    }

    async deleteProduct(productId) {
        try {
            console.log(`🛍️ Deleting product: ${productId}`);

            const productIndex = this.products.findIndex(p => p.id === productId);
            if (productIndex === -1) {
                throw new Error(`Product ${productId} not found`);
            }

            const deletedProduct = this.products.splice(productIndex, 1)[0];

            // Update last update time
            this.lastUpdate = new Date();

            // Dispatch product deleted event
            this.dispatchEvent('product:deleted', { productId, product: deletedProduct });

            console.log(`✅ Product ${productId} deleted successfully`);

            return deletedProduct;

        } catch (error) {
            console.error('❌ Failed to delete product:', error);
            throw error;
        }
    }

    async updateProductPrice(productId, newPrice, newPriceRange) {
        try {
            console.log(`🛍️ Updating product ${productId} price to: ${newPrice}`);

            const product = this.products.find(p => p.id === productId);
            if (!product) {
                throw new Error(`Product ${productId} not found`);
            }

            // Update price
            product.price = newPrice;
            if (newPriceRange) {
                product.priceRange = newPriceRange;
            }

            // Update last modified
            product.lastUpdated = new Date().toISOString().split('T')[0];

            // Update last update time
            this.lastUpdate = new Date();

            // Dispatch price update event
            this.dispatchEvent('product:priceUpdated', {
                productId,
                oldPrice: product.price,
                newPrice,
                product
            });

            console.log(`✅ Product ${productId} price updated to ${newPrice}`);

            return product;

        } catch (error) {
            console.error('❌ Failed to update product price:', error);
            throw error;
        }
    }

    async updateProductStock(productId, newStock) {
        try {
            console.log(`🛍️ Updating product ${productId} stock to: ${newStock}`);

            const product = this.products.find(p => p.id === productId);
            if (!product) {
                throw new Error(`Product ${productId} not found`);
            }

            // Update stock
            product.stock = newStock;

            // Update last modified
            product.lastUpdated = new Date().toISOString().split('T')[0];

            // Update last update time
            this.lastUpdate = new Date();

            // Dispatch stock update event
            this.dispatchEvent('product:stockUpdated', {
                productId,
                oldStock: product.stock,
                newStock,
                product
            });

            console.log(`✅ Product ${productId} stock updated to ${newStock}`);

            return product;

        } catch (error) {
            console.error('❌ Failed to update product stock:', error);
            throw error;
        }
    }

    getProductStatistics() {
        try {
            const totalProducts = this.products.length;
            const totalCategories = new Set(this.products.map(p => p.category)).size;
            const totalStock = this.products.reduce((sum, p) => sum + p.stock, 0);
            const totalValue = this.products.reduce((sum, p) => {
                const avgPrice = (p.priceRange.min + p.priceRange.max) / 2;
                return sum + (avgPrice * p.stock);
            }, 0);

            const categoryBreakdown = {};
            this.products.forEach(product => {
                if (!categoryBreakdown[product.category]) {
                    categoryBreakdown[product.category] = 0;
                }
                categoryBreakdown[product.category]++;
            });

            return {
                totalProducts,
                totalCategories,
                totalStock,
                totalValue: `₹${totalValue.toLocaleString()}`,
                categoryBreakdown,
                averageRating: this.products.length > 0 ?
                    (this.products.reduce((sum, p) => sum + p.rating, 0) / this.products.length).toFixed(1) : 0
            };

        } catch (error) {
            console.error('❌ Error getting product statistics:', error);
            return {
                totalProducts: 0,
                totalCategories: 0,
                totalStock: 0,
                totalValue: '₹0',
                categoryBreakdown: {},
                averageRating: 0
            };
        }
    }

    async updateProducts() {
        try {
            if (this.isPaused) return;

            console.log('🛍️ Updating products...');

            // Simulate real-time updates
            // In real app, this would poll the API for updates
            await this.loadProducts();

            // Dispatch update event
            this.dispatchEvent('products:updated', {
                products: this.products,
                lastUpdate: this.lastUpdate
            });

        } catch (error) {
            console.error('❌ Failed to update products:', error);
        }
    }

    startUpdates() {
        try {
            // Update immediately
            this.updateProducts();

            // Set up periodic updates (every 10 minutes)
            this.updateInterval = setInterval(() => {
                this.updateProducts();
            }, 10 * 60 * 1000);

            console.log('✅ Products updates started');

        } catch (error) {
            console.error('❌ Error starting products updates:', error);
        }
    }

    pauseUpdates() {
        try {
            this.isPaused = true;
            console.log('⏸️ Products updates paused');
        } catch (error) {
            console.error('❌ Error pausing products updates:', error);
        }
    }

    resumeUpdates() {
        try {
            this.isPaused = false;
            console.log('▶️ Products updates resumed');

            // Update immediately when resuming
            this.updateProducts();
        } catch (error) {
            console.error('❌ Error resuming products updates:', error);
        }
    }

    handleProductUpdate(event) {
        try {
            const { productId, updates } = event.detail;
            this.updateProduct(productId, updates);
        } catch (error) {
            console.error('❌ Error handling product update:', error);
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
    async searchProducts(query) {
        try {
            const products = await this.getProducts();

            if (!query || query.trim() === '') {
                return products;
            }

            const searchTerm = query.toLowerCase().trim();

            return products.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm) ||
                product.supplier.toLowerCase().includes(searchTerm) ||
                product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );

        } catch (error) {
            console.error('❌ Error searching products:', error);
            return [];
        }
    }

    async filterProducts(filters) {
        try {
            const products = await this.getProducts();

            return products.filter(product => {
                // Category filter
                if (filters.category && product.category !== filters.category) {
                    return false;
                }

                // Price range filter
                if (filters.minPrice || filters.maxPrice) {
                    const avgPrice = (product.priceRange.min + product.priceRange.max) / 2;

                    if (filters.minPrice && avgPrice < filters.minPrice) {
                        return false;
                    }

                    if (filters.maxPrice && avgPrice > filters.maxPrice) {
                        return false;
                    }
                }

                // Stock filter
                if (filters.minStock && product.stock < filters.minStock) {
                    return false;
                }

                // Rating filter
                if (filters.minRating && product.rating < filters.minRating) {
                    return false;
                }

                // Location filter
                if (filters.location && !product.location.toLowerCase().includes(filters.location.toLowerCase())) {
                    return false;
                }

                return true;
            });

        } catch (error) {
            console.error('❌ Error filtering products:', error);
            return [];
        }
    }

    // Export methods
    async exportProducts(format = 'json') {
        try {
            const products = await this.getProducts();

            switch (format.toLowerCase()) {
                case 'json':
                    return JSON.stringify(products, null, 2);

                case 'csv':
                    return this.convertToCSV(products);

                case 'pdf':
                    // Placeholder for PDF export
                    console.log('PDF export not implemented yet');
                    return null;

                default:
                    throw new Error(`Unsupported export format: ${format}`);
            }

        } catch (error) {
            console.error('❌ Error exporting products:', error);
            throw error;
        }
    }

    convertToCSV(products) {
        try {
            if (products.length === 0) return '';

            const headers = ['ID', 'Name', 'Category', 'Price', 'Location', 'Stock', 'Unit', 'Supplier', 'Rating', 'Last Updated'];
            const csvRows = [headers.join(',')];

            products.forEach(product => {
                const row = [
                    product.id,
                    `"${product.name}"`,
                    product.category,
                    product.price,
                    `"${product.location}"`,
                    product.stock,
                    product.unit,
                    `"${product.supplier}"`,
                    product.rating,
                    product.lastUpdated
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

    getProductCount() {
        return this.products.length;
    }

    getCategories() {
        return [...new Set(this.products.map(p => p.category))];
    }

    // Cleanup method
    cleanup() {
        try {
            // Clear update interval
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
                this.updateInterval = null;
            }

            console.log('✅ Products Service cleanup completed');

        } catch (error) {
            console.error('❌ Error during products service cleanup:', error);
        }
    }
}
