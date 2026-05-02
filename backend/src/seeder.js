const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('./data/users');
const products = require('./data/products');
const content = require('./data/content');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Content = require('./models/Content');
const Settings = require('./models/Settings');
const { connectDB } = require('./config/db');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Content.deleteMany();
    await Settings.deleteMany();

    // Map users to include roles correctly
    const usersWithRoles = users.map(u => ({
      ...u,
      role: u.email === 'admin@example.com' ? 'super-admin' : 'user'
    }));

    const usersWithHashedPasswords = await Promise.all(usersWithRoles.map(async (u) => ({
      ...u,
      password: await require('bcryptjs').hash(u.password, 10),
    })));

    const createdUsers = await User.insertMany(usersWithHashedPasswords);

    const adminUser = createdUsers.find(u => u.role === 'super-admin')._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);
    await Content.insertMany(content);

    // Initial Settings
    const defaultSettings = [
      { key: 'globalDiscount', value: { enabled: false, percentage: 0 }, label: 'Global Discount' },
      { key: 'flashSale', value: { enabled: false, label: 'Flash Sale' }, label: 'Flash Sale' },
      { key: 'siteMeta', value: { name: 'Lotus & Lion', tagline: 'Luxury Essentials' }, label: 'Site Meta' },
    ];
    await Settings.insertMany(defaultSettings);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Content.deleteMany();
    await Settings.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
