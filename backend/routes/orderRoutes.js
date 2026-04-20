const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/', async (req, res) => {
    try {
        const { items, totalAmount } = req.body;
        const newOrder = new Order({ items, totalAmount });
        await newOrder.save();
        res.status(201).json({ message: 'Order placed successfully!', orderId: newOrder._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;