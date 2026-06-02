require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const Product = require('./models/Product');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  'https://sweetcounty.vercel.app/' // Replace with your actual Vercel URL later if needed
];
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sweetcounty';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        // Seed default products
        const productCount = await Product.countDocuments();
        if (productCount < 10) {
            // Remove old seed data if any, then insert full catalog
            if (productCount > 0) await Product.deleteMany({});
            await Product.insertMany([
                // ============ CAKES (11) ============
                { name: 'Chocolate Truffle', category: 'Cakes', price: 500, description: 'Rich, dense chocolate layers with a velvety ganache finish.', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500', rating: 4.8 },
                { name: 'Rasmalai Cake', category: 'Cakes', price: 700, description: 'A fusion delight blending creamy rasmalai with soft sponge layers.', image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500', rating: 4.9 },
                { name: 'Red Velvet Dream', category: 'Cakes', price: 650, description: 'Classic red velvet with tangy cream cheese frosting.', image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=500', rating: 4.7 },
                { name: 'Vanilla Bean Delight', category: 'Cakes', price: 450, description: 'Light and fluffy vanilla sponge with real vanilla bean specks.', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500', rating: 4.6 },
                { name: 'Butterscotch Bliss', category: 'Cakes', price: 520, description: 'Creamy butterscotch layers topped with crunchy praline.', image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500', rating: 4.5 },
                { name: 'Strawberry Shortcake', category: 'Cakes', price: 580, description: 'Fresh strawberries layered with whipped cream and sponge.', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500', rating: 4.8 },
                { name: 'Mango Mousse Cake', category: 'Cakes', price: 620, description: 'Tropical mango mousse on a biscuit base, summer in every bite.', image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=500', rating: 4.7 },
                { name: 'Tiramisu Cake', category: 'Cakes', price: 750, description: 'Italian classic with espresso-soaked layers and mascarpone cream.', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500', rating: 4.9 },

                { name: 'Dark Forest Cake', category: 'Cakes', price: 600, description: 'Dark chocolate sponge with cherry filling and chocolate shavings.', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500', rating: 4.6 },

                // ============ PASTRIES (11) ============
                { name: 'Black Forest Pastry', category: 'Pastries', price: 130, description: 'Classic cherry and cream pastry with chocolate shavings.', image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500', rating: 4.7 },

                { name: 'Apple Turnover', category: 'Pastries', price: 110, description: 'Golden puff pastry pocket with cinnamon-spiced apple filling.', image: 'https://images.unsplash.com/photo-1633383718081-22ac93e3db65?w=500', rating: 4.5 },
                { name: 'Fruit Danish', category: 'Pastries', price: 140, description: 'Layered Danish pastry topped with seasonal fruits and glaze.', image: 'https://images.unsplash.com/photo-1509365390695-33aee754301f?w=500', rating: 4.4 },
                { name: 'Cream Puff', category: 'Pastries', price: 100, description: 'Light choux shell filled with vanilla whipped cream.', image: 'https://images.unsplash.com/photo-1612203985729-70726954388c?w=500', rating: 4.5 },
                { name: 'Palmier Cookie', category: 'Pastries', price: 90, description: 'Crispy, caramelized puff pastry shaped like an elephant ear.', image: 'https://images.unsplash.com/photo-1558312657-b2dead03d494?w=500', rating: 4.3 },
                { name: 'Cannoli', category: 'Pastries', price: 160, description: 'Crisp Italian pastry tubes filled with sweet ricotta cream.', image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500', rating: 4.7 },
                { name: 'Baklava', category: 'Pastries', price: 180, description: 'Layers of flaky phyllo pastry with nuts and honey syrup.', image: 'https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=500', rating: 4.9 },
                { name: 'Portuguese Egg Tart', category: 'Pastries', price: 120, description: 'Caramelized custard in a crispy puff pastry shell.', image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500', rating: 4.6 },
                { name: 'Napoleon Pastry', category: 'Pastries', price: 170, description: 'Layers of puff pastry with vanilla pastry cream, a French classic.', image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=500', rating: 4.5 },

                // ============ DONUTS (11) ============
                { name: 'Classic Glaze', category: 'Donuts', price: 80, description: 'Soft, airy, sugar-coated donut with a sweet glaze.', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500', rating: 4.5 },
                { name: 'Chocolate Sprinkle', category: 'Donuts', price: 100, description: 'Rich chocolate-coated donut with rainbow sprinkles.', image: 'https://images.unsplash.com/photo-1527904324834-3bda86da6771?w=500', rating: 4.6 },

                { name: 'Boston Cream', category: 'Donuts', price: 120, description: 'Custard-filled donut topped with a rich chocolate glaze.', image: 'https://images.unsplash.com/photo-1559656914-a30970c1affd?w=500', rating: 4.7 },
                { name: 'Maple Bacon', category: 'Donuts', price: 130, description: 'Sweet maple glaze topped with crispy bacon bits.', image: 'https://images.unsplash.com/photo-1533910534207-90f31029a78e?w=500', rating: 4.3 },

                { name: 'Cinnamon Sugar', category: 'Donuts', price: 85, description: 'Warm donut rolled in cinnamon sugar, simple perfection.', image: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=500', rating: 4.6 },
                { name: 'Blueberry Crumb', category: 'Donuts', price: 110, description: 'Blueberry cake donut with a buttery crumb topping.', image: 'https://images.unsplash.com/photo-1504387828636-abeb50778c0c?w=500', rating: 4.4 },
                { name: 'Oreo Crunch', category: 'Donuts', price: 115, description: 'Vanilla glazed donut loaded with crushed Oreo cookies.', image: 'https://images.unsplash.com/photo-1612240498936-65f5101365d2?w=500', rating: 4.7 },
                { name: 'Caramel Delight', category: 'Donuts', price: 105, description: 'Donut drizzled with salted caramel and topped with toffee bits.', image: 'https://images.unsplash.com/photo-1560180474-e8563fd75bab?w=500', rating: 4.5 },
                { name: 'Matcha Green Tea', category: 'Donuts', price: 125, description: 'Japanese-inspired donut with matcha glaze and white chocolate.', image: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=500', rating: 4.3 },

                // ============ BROWNIES (11) ============
                { name: 'Classic Fudge Brownie', category: 'Brownies', price: 150, description: 'Dense, fudgy brownie with a crackly top and gooey center.', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500', rating: 4.8 },
                { name: 'Walnut Brownie', category: 'Brownies', price: 170, description: 'Rich chocolate brownie studded with crunchy walnut pieces.', image: 'https://images.unsplash.com/photo-1515037893149-de7f840978e2?w=500', rating: 4.7 },
                { name: 'Salted Caramel Brownie', category: 'Brownies', price: 180, description: 'Fudgy brownie with a salted caramel swirl and sea salt flakes.', image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500', rating: 4.9 },
                { name: 'Red Velvet Brownie', category: 'Brownies', price: 165, description: 'Vibrant red velvet brownie with cream cheese swirl on top.', image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=500', rating: 4.5 },
                { name: 'Peanut Butter Brownie', category: 'Brownies', price: 175, description: 'Chocolate brownie with a rich peanut butter ripple throughout.', image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=500', rating: 4.6 },
                { name: 'Double Chocolate Brownie', category: 'Brownies', price: 160, description: 'Extra chocolatey with both dark and white chocolate chips.', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500', rating: 4.7 },
                { name: 'Espresso Brownie', category: 'Brownies', price: 170, description: 'Rich brownie infused with espresso for a bold coffee kick.', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500', rating: 4.4 },
                { name: 'Cream Cheese Brownie', category: 'Brownies', price: 175, description: 'Marble swirl of tangy cream cheese in a dense chocolate base.', image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=500', rating: 4.6 },

                { name: 'Mint Chocolate Brownie', category: 'Brownies', price: 165, description: 'Cool mint layer on top of a dense dark chocolate brownie.', image: 'https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=500', rating: 4.5 },
                { name: 'Cookie Dough Brownie', category: 'Brownies', price: 190, description: 'Fudgy brownie base topped with chunks of edible cookie dough.', image: 'https://images.unsplash.com/photo-1590841609987-4ac211afdde1?w=500', rating: 4.9 },
            ]);
            console.log('Added 44 bakery items to database!');
        }

        // Seed default admin user
        const adminExists = await User.findOne({ email: 'admin@sweetcounty.com' });
        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            await User.create({
                name: 'Admin',
                email: 'admin@sweetcounty.com',
                password: hashedPassword,
                isAdmin: true
            });
            console.log('Default admin account created (admin@sweetcounty.com / admin123)');
        }
    })
    .catch(err => console.log('DB Connection Error: ', err));

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
