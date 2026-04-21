const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

// POST /api/orders — create a new order (requires login)
router.post('/', protect, async (req, res) => {
    try {
        const { items, totalAmount } = req.body;
        const newOrder = new Order({
            items,
            totalAmount,
            user: req.user.id  // comes from the JWT token via protect middleware
        });
        await newOrder.save();
        res.status(201).json({ message: 'Order placed successfully!', orderId: newOrder._id });
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
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;