require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const VendorProfile = require('../models/VendorProfile');
const DriverProfile = require('../models/DriverProfile');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blinkit';

const categories = [
  { name: 'Fruits & Vegetables', image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-2_9.png', description: 'Fresh fruits and vegetables sourced daily', order: 1 },
  { name: 'Dairy & Eggs', image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-3_7.png', description: 'Fresh dairy products and eggs', order: 2 },
  { name: 'Bakery', image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-4_4.png', description: 'Fresh breads, cakes and bakery items', order: 3 },
  { name: 'Beverages', image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-5_4.png', description: 'Juices, sodas, water and more', order: 4 },
  { name: 'Snacks', image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-6_4.png', description: 'Chips, namkeen, biscuits and more', order: 5 },
  { name: 'Meat & Fish', image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-7_2.png', description: 'Fresh and frozen meat and seafood', order: 6 },
  { name: 'Personal Care', image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-8_2.png', description: 'Skincare, haircare and personal hygiene', order: 7 },
  { name: 'Home & Kitchen', image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-9_2.png', description: 'Cleaning, kitchen and household essentials', order: 8 },
  { name: 'Baby Care', image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-10_1.png', description: 'Baby food, diapers and baby care products', order: 9 },
  { name: 'Pet Food', image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-11.png', description: 'Food and accessories for your pets', order: 10 },
];

const getProductsData = (categoryMap, vendorId) => [
  // Fruits & Vegetables (6 products)
  { name: 'Fresh Tomatoes', description: 'Farm fresh tomatoes, rich in lycopene', price: 40, discountPrice: 35, category: categoryMap['Fruits & Vegetables'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471734.jpg'], unit: '500g', stock: 100, tags: ['vegetable', 'fresh', 'organic'], rating: 4.5, numReviews: 230, deliveryTime: '10 mins' },
  { name: 'Bananas', description: 'Ripe yellow bananas, rich in potassium', price: 49, discountPrice: 40, category: categoryMap['Fruits & Vegetables'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/469925.jpg'], unit: '6 pcs', stock: 80, tags: ['fruit', 'fresh', 'tropical'], rating: 4.3, numReviews: 190, deliveryTime: '10 mins' },
  { name: 'Onions', description: 'Fresh red onions, essential for cooking', price: 30, discountPrice: 25, category: categoryMap['Fruits & Vegetables'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/469908.jpg'], unit: '1kg', stock: 150, tags: ['vegetable', 'staple'], rating: 4.2, numReviews: 312, deliveryTime: '10 mins' },
  { name: 'Apple - Shimla', description: 'Crisp and sweet Shimla apples', price: 180, discountPrice: 149, category: categoryMap['Fruits & Vegetables'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471735.jpg'], unit: '4 pcs (approx 600g)', stock: 60, tags: ['fruit', 'fresh', 'imported'], rating: 4.6, numReviews: 156, deliveryTime: '10 mins' },
  { name: 'Spinach', description: 'Fresh green spinach leaves, rich in iron', price: 25, discountPrice: 20, category: categoryMap['Fruits & Vegetables'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/470178.jpg'], unit: '250g', stock: 70, tags: ['vegetable', 'leafy', 'healthy'], rating: 4.4, numReviews: 98, deliveryTime: '10 mins' },
  { name: 'Potatoes', description: 'Farm fresh potatoes, perfect for curries', price: 35, discountPrice: 29, category: categoryMap['Fruits & Vegetables'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/469901.jpg'], unit: '1kg', stock: 200, tags: ['vegetable', 'staple'], rating: 4.1, numReviews: 425, deliveryTime: '10 mins' },

  // Dairy & Eggs (5 products)
  { name: 'Amul Taaza Milk', description: 'Full cream milk, fresh and pasteurized', price: 31, discountPrice: null, category: categoryMap['Dairy & Eggs'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471736.jpg'], unit: '500ml', stock: 200, tags: ['dairy', 'milk', 'amul'], rating: 4.7, numReviews: 820, deliveryTime: '10 mins' },
  { name: 'Farm Eggs', description: 'Free-range chicken eggs, protein rich', price: 84, discountPrice: 75, category: categoryMap['Dairy & Eggs'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/469905.jpg'], unit: '12 pcs', stock: 150, tags: ['eggs', 'protein', 'breakfast'], rating: 4.5, numReviews: 560, deliveryTime: '10 mins' },
  { name: 'Amul Butter', description: 'Creamy salted butter, made from fresh cream', price: 56, discountPrice: 52, category: categoryMap['Dairy & Eggs'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471737.jpg'], unit: '100g', stock: 120, tags: ['dairy', 'butter', 'amul'], rating: 4.8, numReviews: 445, deliveryTime: '10 mins' },
  { name: 'Paneer', description: 'Fresh cottage cheese, soft and creamy', price: 99, discountPrice: 89, category: categoryMap['Dairy & Eggs'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/469912.jpg'], unit: '200g', stock: 80, tags: ['dairy', 'paneer', 'protein'], rating: 4.4, numReviews: 298, deliveryTime: '10 mins' },
  { name: 'Curd / Dahi', description: 'Fresh and creamy set curd', price: 45, discountPrice: 40, category: categoryMap['Dairy & Eggs'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471738.jpg'], unit: '400g', stock: 100, tags: ['dairy', 'curd', 'probiotic'], rating: 4.3, numReviews: 378, deliveryTime: '10 mins' },

  // Bakery (5 products)
  { name: 'Britannia Bread', description: 'Soft sandwich bread, stays fresh longer', price: 45, discountPrice: 40, category: categoryMap['Bakery'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471739.jpg'], unit: '400g', stock: 90, tags: ['bread', 'bakery', 'britannia'], rating: 4.4, numReviews: 620, deliveryTime: '10 mins' },
  { name: 'Croissants', description: 'Flaky butter croissants, freshly baked', price: 99, discountPrice: 85, category: categoryMap['Bakery'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471740.jpg'], unit: '4 pcs', stock: 40, tags: ['bakery', 'croissant', 'breakfast'], rating: 4.6, numReviews: 145, deliveryTime: '15 mins' },
  { name: 'Whole Wheat Bread', description: 'High fiber whole wheat loaf', price: 55, discountPrice: 49, category: categoryMap['Bakery'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471741.jpg'], unit: '400g', stock: 75, tags: ['bread', 'whole wheat', 'healthy'], rating: 4.3, numReviews: 230, deliveryTime: '10 mins' },
  { name: 'Chocolate Muffin', description: 'Moist chocolate chip muffins', price: 79, discountPrice: 65, category: categoryMap['Bakery'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471742.jpg'], unit: '2 pcs', stock: 50, tags: ['bakery', 'muffin', 'dessert'], rating: 4.5, numReviews: 189, deliveryTime: '15 mins' },
  { name: 'Pita Bread', description: 'Soft Middle-Eastern style pita pockets', price: 65, discountPrice: 55, category: categoryMap['Bakery'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471743.jpg'], unit: '4 pcs', stock: 35, tags: ['bread', 'pita', 'international'], rating: 4.2, numReviews: 78, deliveryTime: '15 mins' },

  // Beverages (5 products)
  { name: 'Coca-Cola Can', description: 'Refreshing cola drink, chilled', price: 45, discountPrice: 40, category: categoryMap['Beverages'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471744.jpg'], unit: '330ml', stock: 200, tags: ['cola', 'soda', 'cold drink'], rating: 4.6, numReviews: 950, deliveryTime: '10 mins' },
  { name: 'Real Juice - Orange', description: 'No added sugar fresh orange juice', price: 99, discountPrice: 85, category: categoryMap['Beverages'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471745.jpg'], unit: '1L', stock: 120, tags: ['juice', 'orange', 'real'], rating: 4.3, numReviews: 320, deliveryTime: '10 mins' },
  { name: 'Bisleri Water', description: 'Packaged drinking water, pure and safe', price: 20, discountPrice: null, category: categoryMap['Beverages'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471746.jpg'], unit: '1L', stock: 500, tags: ['water', 'bisleri', 'packaged water'], rating: 4.5, numReviews: 1200, deliveryTime: '10 mins' },
  { name: 'Red Bull Energy Drink', description: 'Energy drink for an extra boost', price: 125, discountPrice: 110, category: categoryMap['Beverages'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471747.jpg'], unit: '250ml', stock: 80, tags: ['energy drink', 'red bull'], rating: 4.4, numReviews: 280, deliveryTime: '10 mins' },
  { name: 'Nescafe Classic Coffee', description: 'Rich and aromatic instant coffee', price: 245, discountPrice: 210, category: categoryMap['Beverages'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471748.jpg'], unit: '100g jar', stock: 90, tags: ['coffee', 'nescafe', 'instant'], rating: 4.7, numReviews: 560, deliveryTime: '10 mins' },

  // Snacks (5 products)
  { name: "Lay's Classic Salted", description: 'Crispy potato chips, classic salted flavor', price: 30, discountPrice: 28, category: categoryMap['Snacks'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471749.jpg'], unit: '73g', stock: 300, tags: ['chips', 'lays', 'snack'], rating: 4.5, numReviews: 1100, deliveryTime: '10 mins' },
  { name: 'Haldiram Bhujia', description: 'Classic spicy and crunchy bhujia namkeen', price: 99, discountPrice: 89, category: categoryMap['Snacks'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471750.jpg'], unit: '400g', stock: 150, tags: ['namkeen', 'haldiram', 'bhujia'], rating: 4.6, numReviews: 780, deliveryTime: '10 mins' },
  { name: 'Oreo Biscuits', description: 'Chocolate sandwich cookies with cream', price: 35, discountPrice: 30, category: categoryMap['Snacks'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471751.jpg'], unit: '120g', stock: 250, tags: ['biscuit', 'oreo', 'chocolate'], rating: 4.7, numReviews: 940, deliveryTime: '10 mins' },
  { name: 'Maggi Noodles', description: '2-minute instant noodles, masala flavor', price: 14, discountPrice: 13, category: categoryMap['Snacks'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471752.jpg'], unit: '70g', stock: 400, tags: ['noodles', 'maggi', 'instant'], rating: 4.4, numReviews: 1850, deliveryTime: '10 mins' },
  { name: 'Dark Fantasy Cream Biscuits', description: 'Premium chocolate cream filled biscuits', price: 45, discountPrice: 40, category: categoryMap['Snacks'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471753.jpg'], unit: '150g', stock: 180, tags: ['biscuit', 'sunfeast', 'chocolate'], rating: 4.5, numReviews: 420, deliveryTime: '10 mins' },

  // Meat & Fish (5 products)
  { name: 'Chicken Breast', description: 'Fresh boneless chicken breast, antibiotic-free', price: 249, discountPrice: 219, category: categoryMap['Meat & Fish'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471754.jpg'], unit: '500g', stock: 60, tags: ['chicken', 'protein', 'fresh'], rating: 4.3, numReviews: 310, deliveryTime: '15 mins' },
  { name: 'Rohu Fish', description: 'Fresh Rohu fish, cleaned and cut', price: 189, discountPrice: 165, category: categoryMap['Meat & Fish'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471755.jpg'], unit: '500g', stock: 40, tags: ['fish', 'seafood', 'fresh'], rating: 4.2, numReviews: 145, deliveryTime: '15 mins' },
  { name: 'Mutton Curry Cut', description: 'Fresh goat mutton, curry cut pieces', price: 569, discountPrice: 529, category: categoryMap['Meat & Fish'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471756.jpg'], unit: '500g', stock: 30, tags: ['mutton', 'goat', 'fresh'], rating: 4.4, numReviews: 198, deliveryTime: '15 mins' },
  { name: 'Prawns', description: 'Fresh tiger prawns, deveined', price: 299, discountPrice: 269, category: categoryMap['Meat & Fish'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471757.jpg'], unit: '250g', stock: 35, tags: ['prawns', 'seafood', 'shrimp'], rating: 4.5, numReviews: 178, deliveryTime: '15 mins' },
  { name: 'Chicken Sausages', description: 'Juicy chicken sausages, great for grilling', price: 189, discountPrice: 165, category: categoryMap['Meat & Fish'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471758.jpg'], unit: '200g (5 pcs)', stock: 55, tags: ['sausage', 'chicken', 'processed'], rating: 4.1, numReviews: 225, deliveryTime: '10 mins' },

  // Personal Care (5 products)
  { name: 'Dove Soap', description: 'Moisturizing beauty soap with 1/4 moisturizing cream', price: 48, discountPrice: 42, category: categoryMap['Personal Care'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471759.jpg'], unit: '100g (pack of 3)', stock: 150, tags: ['soap', 'dove', 'skincare'], rating: 4.6, numReviews: 680, deliveryTime: '10 mins' },
  { name: 'Head & Shoulders Shampoo', description: 'Anti-dandruff shampoo for clean scalp', price: 295, discountPrice: 265, category: categoryMap['Personal Care'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471760.jpg'], unit: '400ml', stock: 90, tags: ['shampoo', 'head and shoulders', 'anti-dandruff'], rating: 4.4, numReviews: 445, deliveryTime: '10 mins' },
  { name: 'Colgate Max Fresh', description: 'Cooling crystals toothpaste for fresh breath', price: 119, discountPrice: 99, category: categoryMap['Personal Care'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471761.jpg'], unit: '150g', stock: 120, tags: ['toothpaste', 'colgate', 'oral care'], rating: 4.5, numReviews: 510, deliveryTime: '10 mins' },
  { name: 'Nivea Moisturizer', description: 'Daily moisture body lotion with Aloe Vera', price: 199, discountPrice: 175, category: categoryMap['Personal Care'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471762.jpg'], unit: '200ml', stock: 80, tags: ['lotion', 'nivea', 'moisturizer'], rating: 4.3, numReviews: 320, deliveryTime: '10 mins' },
  { name: 'Gillette Mach3 Razor', description: 'Smooth shave with 3 blades, anti-friction', price: 299, discountPrice: 265, category: categoryMap['Personal Care'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471763.jpg'], unit: '1 pc (cartridge included)', stock: 60, tags: ['razor', 'gillette', 'shaving'], rating: 4.7, numReviews: 380, deliveryTime: '10 mins' },

  // Home & Kitchen (5 products)
  { name: 'Vim Dishwash Bar', description: 'Removes grease and tough stains from utensils', price: 40, discountPrice: 36, category: categoryMap['Home & Kitchen'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471764.jpg'], unit: '300g (pack of 2)', stock: 200, tags: ['dishwash', 'vim', 'cleaning'], rating: 4.3, numReviews: 590, deliveryTime: '10 mins' },
  { name: 'Harpic Toilet Cleaner', description: '10x cleaning power, kills 99.9% germs', price: 125, discountPrice: 110, category: categoryMap['Home & Kitchen'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471765.jpg'], unit: '1L', stock: 150, tags: ['toilet cleaner', 'harpic', 'cleaning'], rating: 4.5, numReviews: 420, deliveryTime: '10 mins' },
  { name: 'Ariel Washing Powder', description: 'Superior cleaning even in cold water', price: 249, discountPrice: 220, category: categoryMap['Home & Kitchen'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471766.jpg'], unit: '1kg', stock: 100, tags: ['detergent', 'ariel', 'laundry'], rating: 4.4, numReviews: 380, deliveryTime: '10 mins' },
  { name: 'Steel Tawa', description: 'Non-stick coated tawa for making rotis and dosas', price: 449, discountPrice: 399, category: categoryMap['Home & Kitchen'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471767.jpg'], unit: '28cm diameter', stock: 40, tags: ['cookware', 'tawa', 'non-stick'], rating: 4.2, numReviews: 190, deliveryTime: '10 mins' },
  { name: 'Scotch-Brite Scrub Pad', description: 'Heavy duty scrubber for tough cleaning', price: 45, discountPrice: 40, category: categoryMap['Home & Kitchen'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471768.jpg'], unit: 'pack of 3', stock: 250, tags: ['scrubber', 'scotch brite', 'cleaning'], rating: 4.6, numReviews: 610, deliveryTime: '10 mins' },

  // Baby Care (5 products)
  { name: "Pampers Active Baby Diapers", description: 'Soft and comfortable diapers with 12 hours protection', price: 649, discountPrice: 579, category: categoryMap['Baby Care'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471769.jpg'], unit: 'M - 56 pcs', stock: 70, tags: ['diapers', 'pampers', 'baby'], rating: 4.7, numReviews: 720, deliveryTime: '10 mins' },
  { name: "Cerelac Stage 1 Wheat", description: 'Nestle Cerelac wheat with milk infant cereal', price: 249, discountPrice: 225, category: categoryMap['Baby Care'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471770.jpg'], unit: '300g', stock: 60, tags: ['baby food', 'cerelac', 'nestle'], rating: 4.5, numReviews: 310, deliveryTime: '10 mins' },
  { name: "Johnson's Baby Lotion", description: 'Gentle moisturizing lotion for baby skin', price: 199, discountPrice: 179, category: categoryMap['Baby Care'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471771.jpg'], unit: '200ml', stock: 90, tags: ['baby lotion', 'johnsons', 'skincare'], rating: 4.6, numReviews: 420, deliveryTime: '10 mins' },
  { name: 'Mamaearth Baby Wash', description: 'Toxin-free tear-free baby body wash', price: 249, discountPrice: 219, category: categoryMap['Baby Care'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471772.jpg'], unit: '400ml', stock: 55, tags: ['baby wash', 'mamaearth', 'organic'], rating: 4.4, numReviews: 285, deliveryTime: '10 mins' },
  { name: 'Chicco Baby Wipes', description: 'Ultra-soft wet wipes for sensitive baby skin', price: 199, discountPrice: 175, category: categoryMap['Baby Care'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471773.jpg'], unit: '72 wipes', stock: 80, tags: ['baby wipes', 'chicco', 'gentle'], rating: 4.5, numReviews: 350, deliveryTime: '10 mins' },

  // Pet Food (4 products)
  { name: "Pedigree Adult Dog Food", description: 'Complete nutrition for adult dogs', price: 399, discountPrice: 349, category: categoryMap['Pet Food'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471774.jpg'], unit: '1.2kg', stock: 50, tags: ['dog food', 'pedigree', 'pet'], rating: 4.5, numReviews: 380, deliveryTime: '15 mins' },
  { name: "Whiskas Cat Food", description: 'Tasty and nutritious dry food for cats', price: 299, discountPrice: 265, category: categoryMap['Pet Food'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471775.jpg'], unit: '450g', stock: 40, tags: ['cat food', 'whiskas', 'pet'], rating: 4.4, numReviews: 220, deliveryTime: '15 mins' },
  { name: "Royal Canin Kitten Food", description: 'Specially formulated for kittens under 12 months', price: 649, discountPrice: 590, category: categoryMap['Pet Food'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471776.jpg'], unit: '400g', stock: 30, tags: ['kitten food', 'royal canin', 'premium'], rating: 4.7, numReviews: 180, deliveryTime: '15 mins' },
  { name: "Drools Focus Puppy Food", description: 'High protein diet for growing puppies', price: 549, discountPrice: 499, category: categoryMap['Pet Food'], vendor: vendorId, images: ['https://cdn.grofers.com/app/images/products/full_img/471777.jpg'], unit: '1.2kg', stock: 35, tags: ['puppy food', 'drools', 'pet'], rating: 4.3, numReviews: 155, deliveryTime: '15 mins' },
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      Cart.deleteMany({}),
      VendorProfile.deleteMany({}),
      DriverProfile.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Create users
    console.log('Creating users...');
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@blinkit.com',
      password: 'admin123',
      phone: '9999900000',
      role: 'admin',
    });

    const vendor1 = await User.create({
      name: 'Fresh Mart Store',
      email: 'vendor1@blinkit.com',
      password: 'vendor123',
      phone: '9999900001',
      role: 'vendor',
    });

    const vendor2 = await User.create({
      name: 'Green Basket',
      email: 'vendor2@blinkit.com',
      password: 'vendor123',
      phone: '9999900002',
      role: 'vendor',
    });

    const driver1 = await User.create({
      name: 'Rahul Kumar',
      email: 'driver1@blinkit.com',
      password: 'driver123',
      phone: '9999900003',
      role: 'driver',
    });

    const driver2 = await User.create({
      name: 'Amit Singh',
      email: 'driver2@blinkit.com',
      password: 'driver123',
      phone: '9999900004',
      role: 'driver',
    });

    const customer = await User.create({
      name: 'Test Customer',
      email: 'user@blinkit.com',
      password: 'user123',
      phone: '9999900005',
      role: 'user',
      addresses: [
        {
          type: 'home',
          street: '123 MG Road',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
          lat: 12.9716,
          lng: 77.5946,
          isDefault: true,
        },
      ],
    });

    console.log('Users created');

    // Create vendor profiles
    await VendorProfile.create({
      user: vendor1._id,
      storeName: 'Fresh Mart Store',
      description: 'Your one-stop shop for fresh groceries and daily essentials',
      address: { street: '45 Commercial Street', city: 'Bangalore', state: 'Karnataka', pincode: '560001', lat: 12.975, lng: 77.605 },
      isOpen: true,
      openTime: '08:00',
      closeTime: '23:00',
      rating: 4.5,
      totalOrders: 1250,
      earnings: 187500,
      isApproved: true,
    });

    await VendorProfile.create({
      user: vendor2._id,
      storeName: 'Green Basket',
      description: 'Organic and fresh produce delivered to your doorstep',
      address: { street: '78 Indiranagar', city: 'Bangalore', state: 'Karnataka', pincode: '560038', lat: 12.978, lng: 77.641 },
      isOpen: true,
      openTime: '07:00',
      closeTime: '22:00',
      rating: 4.3,
      totalOrders: 870,
      earnings: 130500,
      isApproved: true,
    });

    // Create driver profiles
    await DriverProfile.create({
      user: driver1._id,
      vehicleType: 'bike',
      vehicleNumber: 'KA01AB1234',
      licenseNumber: 'KA0120191234567',
      isAvailable: true,
      currentLocation: { lat: 12.9716, lng: 77.5946 },
      totalDeliveries: 542,
      earnings: 32520,
      rating: 4.6,
      isApproved: true,
    });

    await DriverProfile.create({
      user: driver2._id,
      vehicleType: 'scooter',
      vehicleNumber: 'KA02CD5678',
      licenseNumber: 'KA0220205678901',
      isAvailable: false,
      currentLocation: { lat: 12.978, lng: 77.641 },
      totalDeliveries: 318,
      earnings: 19080,
      rating: 4.4,
      isApproved: true,
    });

    console.log('Vendor and driver profiles created');

    // Create categories
    console.log('Creating categories...');
    const createdCategories = await Category.insertMany(categories);
    const categoryMap = {};
    createdCategories.forEach((cat) => { categoryMap[cat.name] = cat._id; });
    console.log(`${createdCategories.length} categories created`);

    // Create products
    console.log('Creating products...');
    const productsData = getProductsData(categoryMap, vendor1._id);
    const createdProducts = await Product.insertMany(productsData);
    console.log(`${createdProducts.length} products created`);

    // Create sample orders
    console.log('Creating sample orders...');
    const sampleOrders = [];
    const statuses = ['delivered', 'delivered', 'delivered', 'out_for_delivery', 'preparing', 'confirmed', 'pending', 'cancelled'];
    
    for (let i = 0; i < 8; i++) {
      const randomProducts = createdProducts.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);
      const items = randomProducts.map(p => ({
        product: p._id,
        name: p.name,
        price: p.discountPrice || p.price,
        quantity: Math.floor(Math.random() * 2) + 1,
        image: p.images[0] || '',
      }));
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const deliveryFee = subtotal >= 199 ? 0 : 20;
      const total = subtotal + deliveryFee;
      const status = statuses[i];

      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - i);

      sampleOrders.push({
        user: customer._id,
        vendor: vendor1._id,
        driver: (status === 'delivered' || status === 'out_for_delivery') ? driver1._id : null,
        items,
        deliveryAddress: {
          street: '123 MG Road',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
          lat: 12.9716,
          lng: 77.5946,
        },
        status,
        paymentMethod: i % 2 === 0 ? 'cod' : 'online',
        paymentStatus: status === 'delivered' ? 'paid' : 'pending',
        subtotal,
        deliveryFee,
        total,
        estimatedDelivery: new Date(orderDate.getTime() + 10 * 60 * 1000),
        deliveredAt: status === 'delivered' ? new Date(orderDate.getTime() + 15 * 60 * 1000) : null,
        createdAt: orderDate,
      });
    }

    await Order.insertMany(sampleOrders);
    console.log(`${sampleOrders.length} sample orders created`);

    console.log('\n========================================');
    console.log('Database seeded successfully!');
    console.log('========================================');
    console.log('\nTest Accounts:');
    console.log('Admin:    admin@blinkit.com   / admin123');
    console.log('Vendor 1: vendor1@blinkit.com / vendor123');
    console.log('Vendor 2: vendor2@blinkit.com / vendor123');
    console.log('Driver 1: driver1@blinkit.com / driver123');
    console.log('Driver 2: driver2@blinkit.com / driver123');
    console.log('Customer: user@blinkit.com    / user123');
    console.log('========================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedDatabase();
