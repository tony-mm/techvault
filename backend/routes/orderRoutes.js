const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
    getSalesStats
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(createOrder)     // Public endpoint for customers to checkout
    .get(protect, getOrders); // Protected endpoint for admin to view all orders

router.route('/stats')
    .get(protect, getSalesStats); // Protected endpoint for admin dashboard

module.exports = router;
