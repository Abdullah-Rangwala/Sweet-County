const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

// POST /api/orders — create a new order with payment (requires login)
router.post('/', protect, async (req, res) => {
    try {
        const { items, totalAmount, paymentMethod } = req.body;

        if (!paymentMethod) {
            return res.status(400).json({ message: 'Payment method is required' });
        }

        // Determine initial status based on payment method
        const isCOD = paymentMethod === 'Cash on Delivery';
        const newOrder = new Order({
            items,
            totalAmount,
            user: req.user.id,
            paymentMethod,
            paymentStatus: isCOD ? 'Pending' : 'Paid',
            status: isCOD ? 'Pending' : 'Confirmed'
        });

        await newOrder.save();
        res.status(201).json({
            message: isCOD
                ? 'Order placed! Payment will be collected on delivery.'
                : 'Payment successful! Order confirmed.',
            orderId: newOrder._id,
            paymentStatus: newOrder.paymentStatus,
            status: newOrder.status
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/orders/my — get current user's orders
router.get('/my', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/orders/all — get ALL orders (admin only)
router.get('/all', protect, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/orders/:id/status — update order status (admin only)
router.put('/:id/status', protect, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }
        const { status } = req.body;
        const validStatuses = ['Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Handle cancellation → refund
        if (status === 'Cancelled' && order.paymentStatus === 'Paid') {
            order.paymentStatus = 'Refunded';
        }

        // If confirming a COD order that was pending
        if (status === 'Delivered' && order.paymentMethod === 'Cash on Delivery') {
            order.paymentStatus = 'Paid';
        }

        order.status = status;
        await order.save();

        // Re-fetch with populated user
        const populated = await Order.findById(order._id).populate('user', 'name email');
        res.json(populated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;