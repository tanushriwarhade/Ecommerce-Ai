const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Product = require('../models/Product');

const products = [
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Latest Samsung flagship with 200MP camera, Snapdragon 8 Gen 3, 5000mAh battery, and built-in S Pen. Experience the future of mobile photography.',
    price: 124999,
    category: 'electronics',
    subcategory: 'smartphones',
    brand: 'Samsung',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
    rating: { average: 4.7, count: 1250 },
    stock: 50,
    featured: true,
    tags: ['smartphone', '5G', 'camera', 'flagship'],
    features: ['200MP Camera', 'S Pen', '5000mAh Battery', 'Snapdragon 8 Gen 3']
  },
  {
    name: 'Apple MacBook Pro 14"',
    description: 'Powered by M3 Pro chip with up to 18 hours battery life. Perfect for professionals who demand the best in performance and portability.',
    price: 199900,
    category: 'electronics',
    subcategory: 'laptops',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    rating: { average: 4.9, count: 890 },
    stock: 30,
    featured: true,
    tags: ['laptop', 'macbook', 'apple', 'm3'],
    features: ['M3 Pro Chip', '18hr Battery', 'Liquid Retina Display', '16GB RAM']
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancelling headphones with 30-hour battery, multipoint connection, and crystal clear hands-free calling.',
    price: 29990,
    category: 'electronics',
    subcategory: 'audio',
    brand: 'Sony',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    rating: { average: 4.8, count: 2100 },
    stock: 80,
    tags: ['headphones', 'noise-cancelling', 'wireless'],
    features: ['Active Noise Cancellation', '30hr Battery', 'Multipoint Connection', 'Hi-Res Audio']
  },
  {
    name: 'iPad Pro 12.9" M2',
    description: 'The ultimate iPad experience with the M2 chip, ProMotion 120Hz display, and support for Apple Pencil 2nd gen. Create without limits.',
    price: 112900,
    category: 'electronics',
    subcategory: 'tablets',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
    rating: { average: 4.8, count: 650 },
    stock: 45,
    tags: ['tablet', 'ipad', 'apple', 'm2'],
    features: ['M2 Chip', '120Hz ProMotion', 'Apple Pencil Support', 'Thunderbolt Port']
  },
  {
    name: 'LG C3 55" OLED TV',
    description: 'Perfect blacks, vivid colors, and cinematic picture quality with Dolby Vision IQ and Atmos. Smart TV with webOS and built-in Google Assistant.',
    price: 149990,
    category: 'electronics',
    subcategory: 'televisions',
    brand: 'LG',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400',
    rating: { average: 4.7, count: 430 },
    stock: 20,
    featured: true,
    tags: ['tv', 'oled', '4k', 'smart tv'],
    features: ['OLED evo Panel', 'Dolby Vision IQ', 'G-Sync Compatible', 'WebOS 23']
  },
  {
    name: 'GoPro Hero 12 Black',
    description: 'Shoot stunning 5.3K video at 60fps, 27MP photos with HyperSmooth 6.0 stabilization. Waterproof to 10m. The ultimate action camera.',
    price: 47000,
    category: 'electronics',
    subcategory: 'cameras',
    brand: 'GoPro',
    image: 'https://images.unsplash.com/photo-1593152167544-085d3b9c4938?w=400',
    rating: { average: 4.6, count: 780 },
    stock: 60,
    tags: ['camera', 'action', 'waterproof', 'gopro'],
    features: ['5.3K60 Video', 'HyperSmooth 6.0', 'Waterproof 10m', '27MP Photos']
  },
  {
    name: 'Nike Air Max 270',
    description: 'Inspired by Air Max icons of the past, the Air Max 270 delivers all-day comfort with the tallest Air unit yet. Lightweight mesh upper for breathability.',
    price: 12995,
    category: 'footwear',
    subcategory: 'sneakers',
    brand: 'Nike',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    rating: { average: 4.5, count: 3200 },
    stock: 200,
    tags: ['shoes', 'nike', 'air max', 'running'],
    features: ['Air Max Unit', 'Mesh Upper', 'Foam Midsole', 'Rubber Outsole']
  },
  {
    name: 'Levi\'s 501 Original Jeans',
    description: 'The original straight fit jean, updated with modern stretch. Classic 5-pocket styling and iconic button fly. A wardrobe essential since 1873.',
    price: 3999,
    category: 'clothing',
    subcategory: 'jeans',
    brand: "Levi's",
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    rating: { average: 4.4, count: 5600 },
    stock: 500,
    tags: ['jeans', 'denim', 'levis', 'casual'],
    features: ['100% Cotton Denim', 'Button Fly', 'Classic Straight Fit', 'Shrink-to-Fit']
  },
  {
    name: 'Zara Premium Blazer',
    description: 'Sophisticated slim-fit blazer crafted from premium wool blend. Perfect for business casual and formal occasions. Available in multiple colors.',
    price: 7999,
    category: 'clothing',
    subcategory: 'formal',
    brand: 'Zara',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400',
    rating: { average: 4.3, count: 890 },
    stock: 120,
    featured: true,
    tags: ['blazer', 'formal', 'wool', 'business'],
    features: ['Wool Blend Fabric', 'Slim Fit', 'Notch Lapel', 'Two Button Closure']
  },
  {
    name: 'H&M Oversized Hoodie',
    description: 'Ultra-soft oversized hoodie made from 100% organic cotton. Features a kangaroo pocket, adjustable drawcord hood, and relaxed fit for all-day comfort.',
    price: 1999,
    category: 'clothing',
    subcategory: 'casual',
    brand: 'H&M',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400',
    rating: { average: 4.2, count: 1800 },
    stock: 350,
    tags: ['hoodie', 'organic cotton', 'casual', 'comfortable'],
    features: ['100% Organic Cotton', 'Kangaroo Pocket', 'Ribbed Cuffs', 'Relaxed Fit']
  },
  {
    name: 'Adidas Ultraboost 23',
    description: 'Exceptional energy return with BOOST midsole technology. Primeknit+ upper conforms to your foot. The perfect running shoe for serious runners.',
    price: 17999,
    category: 'footwear',
    subcategory: 'running',
    brand: 'Adidas',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
    rating: { average: 4.7, count: 2400 },
    stock: 150,
    featured: true,
    tags: ['shoes', 'running', 'adidas', 'boost'],
    features: ['BOOST Midsole', 'Primeknit+ Upper', 'Continental Rubber Outsole', 'Torsion System']
  },
  {
    name: 'Louis Philippe Formal Shirt',
    description: 'Premium cotton formal shirt with a classic point collar and single chest pocket. Wrinkle-resistant finish for a sharp look all day long.',
    price: 2499,
    category: 'clothing',
    subcategory: 'shirts',
    brand: 'Louis Philippe',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
    rating: { average: 4.3, count: 720 },
    stock: 280,
    tags: ['shirt', 'formal', 'cotton', 'office'],
    features: ['100% Cotton', 'Wrinkle Resistant', 'Point Collar', 'Regular Fit']
  },
  {
    name: 'Fossil Gen 6 Smartwatch',
    description: 'Powered by Wear OS, Gen 6 offers faster performance, 80+ workout modes, heart rate & SpO2 tracking, and 24hr battery. Classic watch aesthetics with smart features.',
    price: 22995,
    category: 'accessories',
    subcategory: 'smartwatches',
    brand: 'Fossil',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    rating: { average: 4.4, count: 560 },
    stock: 90,
    tags: ['smartwatch', 'fossil', 'wear os', 'fitness'],
    features: ['Wear OS by Google', 'Heart Rate Monitor', 'GPS', '24hr Battery']
  },
  {
    name: 'Ray-Ban Aviator Classic',
    description: 'The iconic pilot frame first designed for US aviators in 1937. Crystal glass lenses offer excellent clarity. Timeless style that never goes out of fashion.',
    price: 9990,
    category: 'accessories',
    subcategory: 'sunglasses',
    brand: 'Ray-Ban',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
    rating: { average: 4.6, count: 1890 },
    stock: 160,
    tags: ['sunglasses', 'rayban', 'aviator', 'classic'],
    features: ['Crystal Glass Lenses', 'Metal Frame', 'UV Protection', 'Classic Aviator Shape']
  },
  {
    name: 'Wildcraft Rucksack 55L',
    description: 'Heavy-duty trekking backpack with 55L capacity, laptop sleeve, rain cover, and ergonomic back support. Perfect for weekend treks and travel.',
    price: 4999,
    category: 'accessories',
    subcategory: 'bags',
    brand: 'Wildcraft',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    rating: { average: 4.3, count: 980 },
    stock: 200,
    tags: ['backpack', 'trekking', 'travel', 'outdoor'],
    features: ['55L Capacity', 'Rain Cover', 'Laptop Sleeve', 'Ergonomic Straps']
  },
  {
    name: 'Realme GT 5 Pro',
    description: 'Snapdragon 8 Gen 3 with 1TB storage option. 50MP triple camera with periscope telephoto. 240W fast charging. The ultimate performance smartphone.',
    price: 49999,
    category: 'electronics',
    subcategory: 'smartphones',
    brand: 'Realme',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    rating: { average: 4.5, count: 640 },
    stock: 100,
    tags: ['smartphone', 'realme', 'gaming', 'fast charge'],
    features: ['Snapdragon 8 Gen 3', '240W Fast Charging', '50MP Periscope Camera', '1TB Storage']
  },
  {
    name: 'Allen Solly Polo T-Shirt',
    description: 'Classic pique polo shirt crafted from premium cotton. Features a two-button placket, ribbed collar, and clean finish for a smart casual look.',
    price: 1299,
    category: 'clothing',
    subcategory: 'tshirts',
    brand: 'Allen Solly',
    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400',
    rating: { average: 4.1, count: 2100 },
    stock: 400,
    tags: ['polo', 'tshirt', 'casual', 'cotton'],
    features: ['100% Pique Cotton', 'Two-Button Placket', 'Ribbed Collar & Cuffs', 'Smart Casual Fit']
  },
  {
    name: 'Titan Analog Watch',
    description: 'Elegant analog watch with stainless steel case, sapphire crystal glass, 100m water resistance, and genuine leather strap. Swiss movement precision.',
    price: 8999,
    category: 'accessories',
    subcategory: 'watches',
    brand: 'Titan',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
    rating: { average: 4.5, count: 1340 },
    stock: 120,
    tags: ['watch', 'titan', 'analog', 'leather'],
    features: ['Stainless Steel Case', 'Sapphire Crystal Glass', '100m Water Resistance', 'Genuine Leather Strap']
  },
  {
    name: "Woodland Men's Trekking Shoes",
    description: 'Genuine leather upper with nubuck finish. High ankle support, slip-resistant rubber sole, and cushioned insole. Perfect for outdoor adventures.',
    price: 5995,
    category: 'footwear',
    subcategory: 'trekking',
    brand: 'Woodland',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400',
    rating: { average: 4.4, count: 1670 },
    stock: 180,
    tags: ['shoes', 'trekking', 'woodland', 'outdoor'],
    features: ['Genuine Leather', 'High Ankle Support', 'Slip-Resistant Sole', 'Cushioned Insole']
  },
  {
    name: 'JBL Flip 6 Bluetooth Speaker',
    description: 'Powerful sound with bold bass in a compact, waterproof design. 12 hours of playtime, PartyBoost for pairing with compatible JBL speakers.',
    price: 11999,
    category: 'electronics',
    subcategory: 'audio',
    brand: 'JBL',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    rating: { average: 4.6, count: 3100 },
    stock: 220,
    featured: true,
    tags: ['speaker', 'bluetooth', 'jbl', 'waterproof'],
    features: ['IP67 Waterproof', '12hr Battery', 'PartyBoost', 'Powerful Bass Radiators']
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    const inserted = await Product.insertMany(products);
    console.log(`✅ Inserted ${inserted.length} products`);

    mongoose.connection.close();
    console.log('🔌 Database connection closed');
    console.log('\n🎉 Seeding complete! Your store is ready.');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
