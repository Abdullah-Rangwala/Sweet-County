const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true, enum: ['All', 'Cakes', 'Pastries', 'Donuts', 'Brownies'] },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String },
    rating: { type: Number, default: 5.0 }
});

module.exports = mongoose.model('Product', productSchema);