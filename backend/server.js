const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const Product = require('./models/Product');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = 'mongodb://127.0.0.1:27017/sweetcounty';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        const count = await Product.countDocuments();
        if (count === 0) {
            await Product.insertMany([
                { name: 'Chocolate Truffle', category: 'Cakes', price: 500, description: 'Rich, dense chocolate layers.', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500', rating: 4.8 },
                { name: 'Rasmalai Cake', category: 'Cakes', price: 700, description: 'A fusion delight.', image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500', rating: 4.9 },
                { name: 'Classic Glaze', category: 'Donuts', price: 80, description: 'Soft, airy, sugar-coated.', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500', rating: 4.5 },
                { name: 'Black Forest Pastry', category: 'Pastries', price: 130, description: 'Classic cherry and cream.', image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500', rating: 4.7 },
            ]);
            console.log('Added initial bakery items to database!');
        }
    })
    .catch(err => console.log('DB Connection Error: ', err));

app.use('/api/products', productRoutes);
app.use('/api/products', require('./routes/productRoutes')); 
app.use('/api/orders', orderRoutes); 

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
