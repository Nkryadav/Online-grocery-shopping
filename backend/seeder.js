const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Offer = require('./models/Offer');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const users = [
    {
        name: 'Admin User',
        email: 'admin@freshmart.com',
        password: 'admin123',
        isAdmin: true,
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
    },
];

const products = [
    {
        name: 'Fresh Organic Apples',
        price: 120,
        description: 'Crisp and sweet organic apples, perfect for snacking or baking.',
        image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500',
        category: 'Fruits',
        stock: 50,
        unit: 'kg',
        discount: 10,
        isFeatured: true,
        rating: 4.5,
        numReviews: 12,
    },
    {
        name: 'Fresh Bananas',
        price: 40,
        description: 'Ripe yellow bananas, rich in potassium and energy.',
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500',
        category: 'Fruits',
        stock: 100,
        unit: 'dozen',
        discount: 0,
        isFeatured: true,
        rating: 4.8,
        numReviews: 25,
    },
    {
        name: 'Organic Tomatoes',
        price: 30,
        description: 'Fresh, juicy organic tomatoes for salads and cooking.',
        image: 'https://images.unsplash.com/photo-1546470427-227c1e3e0b1f?w=500',
        category: 'Vegetables',
        stock: 75,
        unit: 'kg',
        discount: 15,
        isFeatured: true,
        rating: 4.3,
        numReviews: 18,
    },
    {
        name: 'Fresh Carrots',
        price: 35,
        description: 'Crunchy and sweet carrots, great for snacking and cooking.',
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500',
        category: 'Vegetables',
        stock: 60,
        unit: 'kg',
        discount: 0,
        isFeatured: false,
        rating: 4.6,
        numReviews: 15,
    },
    {
        name: 'Whole Wheat Bread',
        price: 45,
        description: 'Freshly baked whole wheat bread, healthy and delicious.',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
        category: 'Bakery',
        stock: 30,
        unit: 'loaf',
        discount: 5,
        isFeatured: true,
        rating: 4.7,
        numReviews: 22,
    },
    {
        name: 'Fresh Milk',
        price: 60,
        description: 'Pure and fresh milk, delivered daily.',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500',
        category: 'Dairy',
        stock: 40,
        unit: 'liter',
        discount: 0,
        isFeatured: true,
        rating: 4.9,
        numReviews: 30,
    },
    {
        name: 'Organic Eggs',
        price: 80,
        description: 'Farm-fresh organic eggs, rich in protein.',
        image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500',
        category: 'Dairy',
        stock: 50,
        unit: 'dozen',
        discount: 10,
        isFeatured: false,
        rating: 4.8,
        numReviews: 20,
    },
    {
        name: 'Basmati Rice',
        price: 150,
        description: 'Premium quality basmati rice with long grains.',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500',
        category: 'Grains',
        stock: 100,
        unit: 'kg',
        discount: 20,
        isFeatured: true,
        rating: 4.6,
        numReviews: 35,
    },
];

const offers = [
    {
        title: 'Weekend Special - 25% Off',
        description: 'Get 25% off on all fruits and vegetables this weekend!',
        code: 'WEEKEND25',
        offerType: 'percentage',
        discountValue: 25,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        minPurchase: 200,
        maxDiscount: 100,
        isActive: true,
    },
    {
        title: 'First Order Discount',
        description: 'Flat ₹100 off on your first order above ₹500',
        code: 'FIRST100',
        offerType: 'flat',
        discountValue: 100,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        minPurchase: 500,
        isActive: true,
    },
    {
        title: 'Mega Savings - 30% Off',
        description: 'Save 30% on orders above ₹1000',
        code: 'MEGA30',
        offerType: 'percentage',
        discountValue: 30,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        minPurchase: 1000,
        maxDiscount: 300,
        isActive: true,
    },
];

const importData = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();
        await Offer.deleteMany();

        // Use create instead of insertMany to trigger password hashing
        await User.create(users);
        await Product.insertMany(products);
        await Offer.insertMany(offers);

        console.log('Data imported successfully!');
        process.exit();
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();
        await Offer.deleteMany();

        console.log('Data destroyed successfully!');
        process.exit();
    } catch (error) {
        console.error('Error destroying data:', error);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
