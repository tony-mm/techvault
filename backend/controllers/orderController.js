const Order = require('../models/Order');
const Product = require('../models/Product');
const { writeDB, readDB } = require('../config/dbAdapter');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, customerInfo } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        // Deduct stock from products
        const data = readDB();
        let stockError = false;

        items.forEach(item => {
            const product = data.products.find(p => p.id === item.id);
            if (product) {
                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                } else {
                    stockError = true;
                }
            }
        });

        if (stockError) {
            return res.status(400).json({ message: 'Not enough stock for one or more items' });
        }

        // Save updated products stock
        writeDB(data);

        // Create the order
        const order = await Order.create({
            items,
            totalAmount,
            customerInfo
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get sales stats (revenue, items sold)
// @route   GET /api/orders/stats
// @access  Private/Admin
const getSalesStats = async (req, res) => {
    try {
        const stats = await Order.getStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getSalesStats
};
