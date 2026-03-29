const mongoose = require('mongoose');
const Brand = require('../models/brandModel'); // adjust path
const connectDB = require('../config/db'); // your DB connection file

connectDB();

const seedBrands = async () => {
  try {
    console.log('MongoDB connected...');

    // Clear old brands
    await Brand.deleteMany();

    const brands = [
      { name: 'Apple', description: 'Electronics brand', logo: 'apple.png' },
      { name: 'Samsung', description: 'Electronics brand', logo: 'samsung.png' },
      { name: 'Nike', description: 'Sportswear brand', logo: 'nike.png' },
    ];

    await Brand.insertMany(brands);

    console.log('Brands seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedBrands();