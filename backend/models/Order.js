const { readDB, writeDB } = require('../config/dbAdapter');

class Order {
    static async create(orderData) {
        const data = readDB();
        
        const newOrder = {
            id: Date.now().toString(), // Generate a unique timestamp-based ID
            items: orderData.items, // Array of { productId, name, price, quantity, options }
            totalAmount: orderData.totalAmount, // Calculated total
            customerInfo: orderData.customerInfo, // { name, email, phone, address } (Optional for now)
            status: 'completed', // Can be pending, completed, shipped in the future
            createdAt: new Date().toISOString()
        };

        data.orders.push(newOrder);
        writeDB(data);
        return newOrder;
    }

    static async findAll() {
        const data = readDB();
        return data.orders || [];
    }

    static async getStats() {
        const data = readDB();
        const orders = data.orders || [];

        let totalRevenue = 0;
        let totalItemsSold = 0;

        orders.forEach(order => {
            totalRevenue += order.totalAmount;
            order.items.forEach(item => {
                totalItemsSold += item.quantity;
            });
        });

        return {
            totalRevenue: parseFloat(totalRevenue.toFixed(2)),
            totalItemsSold,
            totalOrders: orders.length,
            recentOrders: orders.slice(-5).reverse() // Get last 5 orders, newest first
        };
    }
}

module.exports = Order;
