import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Coupon from './models/Coupon.js';
import Blog from './models/Blog.js';
import Review from './models/Review.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/anusree_tex');
    console.log('MongoDB connected for seeding...');
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await Category.deleteMany();
    await User.deleteMany();
    await Product.deleteMany();
    await Coupon.deleteMany();
    await Blog.deleteMany();
    await Review.deleteMany();

    console.log('Database cleared.');

    // 1. Seed Categories
    const categories = await Category.insertMany([
      { name: 'Cotton Veshti', slug: 'cotton-veshti', description: 'Traditional pure cotton veshtis for daily and casual wear.' },
      { name: 'Silk Veshti', slug: 'silk-veshti', description: 'Premium pure silk veshtis crafted for special milestones.' },
      { name: 'Wedding Collection', slug: 'wedding-collection', description: 'Splendid golden border veshtis for grooms and wedding ceremonies.' },
      { name: 'Premium Collection', slug: 'premium-collection', description: 'High thread count handloom veshtis for sophisticated looks.' },
      { name: 'Offers', slug: 'offers', description: 'Discounted traditional wear bundles and sales.' },
    ]);

    console.log('Categories seeded.');

    // Find category ids
    const cottonCat = categories[0]._id;
    const silkCat = categories[1]._id;
    const weddingCat = categories[2]._id;
    const premiumCat = categories[3]._id;
    const offersCat = categories[4]._id;

    // 2. Seed Users
    const users = [
      {
        name: 'Anusree Admin',
        email: 'admin@anusreetex.com',
        password: 'admin123',
        role: 'admin',
        phone: '9876543210',
        addresses: [
          {
            street: '12 Temple Street, T. Nagar',
            city: 'Chennai',
            state: 'Tamil Nadu',
            zipCode: '600017',
            country: 'India',
            isDefault: true,
          },
        ],
      },
      {
        name: 'Dhanush Kumar',
        email: 'customer@anusreetex.com',
        password: 'user123',
        role: 'user',
        phone: '9876543211',
        addresses: [
          {
            street: '45 Palace Road, Adyar',
            city: 'Chennai',
            state: 'Tamil Nadu',
            zipCode: '600020',
            country: 'India',
            isDefault: true,
          },
        ],
      },
    ];

    // Seed users (pre-save hook hashes password)
    const seededUsers = [];
    for (const u of users) {
      const newUser = new User(u);
      await newUser.save();
      seededUsers.push(newUser);
    }
    console.log('Users seeded.');

    const customerUser = seededUsers[1];

    // 3. Seed Products
    const productsData = [
      {
        name: 'Kalyana Swarnam Gold Jari Silk Veshti',
        description: 'Embrace the essence of Tamil wedding tradition with this premium pure silk veshti. Adorned with a rich 4-inch gold jari border, this hand-woven piece features a soft texture and elegant cream base, perfect for grooms.',
        price: 3999,
        discountPrice: 3499,
        category: weddingCat,
        images: ['/assets/products/silk-gold-border.jpg', '/assets/products/silk-gold-detail.jpg'],
        fabric: 'Silk',
        borderType: 'Gold Jari',
        borderSize: '4 inch',
        occasion: 'Wedding',
        color: 'Cream',
        size: '4 Meters (Double Veshti)',
        stock: 50,
        isFeatured: true,
        isNewArrival: true,
        isWedding: true,
        isPremium: true,
      },
      {
        name: 'Mayilkan Border Handloom Pure Cotton Veshti',
        description: 'Exquisitely styled with a traditional Peacock-eye (Mayilkan) border, this pure cotton veshti is crafted from 80s count handloom cotton. Breathable, comfortable, and perfect for hot weather or daily temple visits.',
        price: 1299,
        discountPrice: 999,
        category: cottonCat,
        images: ['/assets/products/cotton-green-border.jpg'],
        fabric: 'Cotton',
        borderType: 'Temple',
        borderSize: '2 inch',
        occasion: 'Casual',
        color: 'White',
        size: '4 Meters (Double Veshti)',
        stock: 120,
        isFeatured: true,
        isBestSeller: true,
      },
      {
        name: 'Valkalam Silver Jari Pure Silk Veshti',
        description: 'A contemporary twist to traditional wear. This pure silk veshti comes with a striking silver jari border. Its radiant white hue and smooth silk feel make it a popular choice for festivals and evening receptions.',
        price: 3499,
        discountPrice: 2999,
        category: silkCat,
        images: ['/assets/products/silk-silver-border.jpg'],
        fabric: 'Silk',
        borderType: 'Silver Jari',
        borderSize: '3 inch',
        occasion: 'Festival',
        color: 'White',
        size: '4 Meters (Double Veshti)',
        stock: 45,
        isNewArrival: true,
        isFestival: true,
      },
      {
        name: 'Swarnam Double Border Premium Handloom Veshti',
        description: 'Double-sided golden border woven with high precision thread work. Made from superior Giza cotton with silk-like finish, this premium veshti fits any grand occasion, symbolizing elegance and status.',
        price: 2490,
        discountPrice: 2190,
        category: premiumCat,
        images: ['/assets/products/premium-double-border.jpg'],
        fabric: 'Cotton',
        borderType: 'Gold Jari',
        borderSize: 'Double side',
        occasion: 'Festival',
        color: 'Off-white',
        size: '4 Meters (Double Veshti)',
        stock: 75,
        isFeatured: true,
        isPremium: true,
      },
      {
        name: 'Thangam Art Silk Veshti & Angavastram Set',
        description: 'Make your festive occasions special with this pre-matched Veshti and Angavastram (shawl) set. Made of premium art silk with a gold jari borders, offering a budget-friendly rich look.',
        price: 1799,
        discountPrice: 1499,
        category: offersCat,
        images: ['/assets/products/artsilk-gold-set.jpg'],
        fabric: 'Art Silk',
        borderType: 'Gold Jari',
        borderSize: '2 inch',
        occasion: 'Festival',
        color: 'Cream',
        size: '4 Meters (Double Veshti)',
        stock: 90,
        isBestSeller: true,
        isFestival: true,
      },
      {
        name: 'Classic White Silver Jari Cotton Veshti',
        description: 'Simple yet elegant. 100% fine cotton single veshti with a narrow silver line border. Ideal for prayers, lightweight requirements, and active comfortable movements.',
        price: 899,
        discountPrice: 699,
        category: offersCat,
        images: ['/assets/products/cotton-silver-line.jpg'],
        fabric: 'Cotton',
        borderType: 'Silver Jari',
        borderSize: '1 inch',
        occasion: 'Casual',
        color: 'White',
        size: '2 Meters (Single Veshti)',
        stock: 150,
        isBestSeller: true,
      },
      {
        name: 'Raja Rajan Premium Handloom Silk Veshti',
        description: 'Named after the legendary Chola emperor, this is the crown jewel of our silk collection. Woven using 100% pure Mulberry silk and certified zari, it comes with a grand peacock and mango motif gold border.',
        price: 7999,
        discountPrice: 6999,
        category: premiumCat,
        images: ['/assets/products/royal-silk-veshti.jpg'],
        fabric: 'Silk',
        borderType: 'Gold Jari',
        borderSize: '5 inch',
        occasion: 'Wedding',
        color: 'Off-white',
        size: '4 Meters (Double Veshti)',
        stock: 20,
        isFeatured: true,
        isWedding: true,
        isPremium: true,
      },
    ];

    const seededProducts = await Product.insertMany(productsData);
    console.log('Products seeded.');

    // 4. Seed Reviews
    const firstProduct = seededProducts[0];
    const secondProduct = seededProducts[1];

    const reviews = [
      {
        user: customerUser._id,
        name: customerUser.name,
        product: firstProduct._id,
        rating: 5,
        comment: 'Absolutely spectacular silk veshti! The gold border is extremely rich and perfect for my wedding day. High quality weave.',
      },
      {
        user: customerUser._id,
        name: customerUser.name,
        product: secondProduct._id,
        rating: 4,
        comment: 'Very lightweight and comfortable. The handloom cotton feels authentic and premium. Definitely buying again.',
      },
    ];

    await Review.insertMany(reviews);
    
    // Update product ratings
    firstProduct.numOfReviews = 1;
    firstProduct.ratings = 5;
    await firstProduct.save();

    secondProduct.numOfReviews = 1;
    secondProduct.ratings = 4;
    await secondProduct.save();

    console.log('Reviews seeded.');

    // 5. Seed Coupons
    const coupons = [
      {
        code: 'WELCOME10',
        discountType: 'percentage',
        discountAmount: 10,
        minPurchaseAmount: 1000,
        expiryDate: new Date('2028-12-31'),
        isActive: true,
        usageLimit: 1000,
      },
      {
        code: 'FESTIVE500',
        discountType: 'flat',
        discountAmount: 500,
        minPurchaseAmount: 3000,
        expiryDate: new Date('2028-12-31'),
        isActive: true,
        usageLimit: 500,
      },
      {
        code: 'ANUSREEGOLD',
        discountType: 'percentage',
        discountAmount: 15,
        minPurchaseAmount: 2000,
        expiryDate: new Date('2028-12-31'),
        isActive: true,
        usageLimit: 200,
      },
    ];

    await Coupon.insertMany(coupons);
    console.log('Coupons seeded.');

    // 6. Seed Blogs
    const blogs = [
      {
        title: 'A Beginner Guide to Wearing the Traditional South Indian Veshti',
        summary: 'Master the art of folding and draping a traditional veshti with our step-by-step styling guide, complete with tucking techniques.',
        content: `The veshti (dhoti) is the epitome of South Indian masculinity, heritage, and style. While it looks simple, mastering the perfect drape can seem daunting to beginners. In this article, we outline the exact steps you need to get the look right.

First, identify the border. For traditional wedding silk veshtis (like our Kalyana Swarnam), the main golden jari border should be aligned properly at the bottom.
Step 1: Wrap the double veshti around your waist from back to front, keeping both ends equal.
Step 2: Fold the right side over towards the left, keeping it snug against your waist.
Step 3: Take the left end, create a small, clean double fold (commonly known as the double fold drape), and fold it over the right side.
Step 4: Roll the top waist section inward twice to lock the drape firmly.
Step 5: For mobility, you can lift the bottom edge and tuck it neatly at the waist (the famous folded style).

Enjoy walking with elegance and confidence in your Anusree Tex!`,
        image: '/assets/blogs/wear-veshti.jpg',
        tags: ['Guide', 'Traditional', 'Veshti Draping'],
        readTime: '4 mins read',
      },
      {
        title: 'Veshti Styling Tips for the Modern Tamil Groom',
        summary: 'Explore styling options to pair your wedding veshti with shirts, angavastrams, accessories, and footwear for a premium look.',
        content: `Your wedding is a once-in-a-lifetime occasion, and stepping up in a traditional silk veshti is the ultimate tribute to Tamil heritage. However, styling it for modern cameras requires attention to details.

Pairing it with the right top:
- Traditionalists prefer matching the cream silk veshti with a pure silk cream shirt.
- For a contemporary look, pair your gold border veshti with a contrast-colored raw silk shirt in maroon, royal blue, or deep forest green.

Angavastram (The Shawl):
Ensure the angavastram matches the border patterns of your veshti. Drape it gracefully over the left shoulder, letting the gold border fall flat.

Footwear & Accessories:
Choose traditional leather mojris, kolhapuris, or premium tan leather sandals. Complete the look with a gold watch and a clean haircut. Anusree Tex wishes you a glorious wedding celebration!`,
        image: '/assets/blogs/wedding-fashion.jpg',
        tags: ['Wedding', 'Fashion', 'Groom Style'],
        readTime: '6 mins read',
      },
      {
        title: 'Cotton vs. Silk Veshtis: Making the Right Fabric Selection',
        summary: 'Compare cotton and silk dhotis across factors like breathability, luxury aesthetic, price points, and care instructions.',
        content: `When building your ethnic wardrobe, choosing between cotton and silk veshtis is key. Let us help you make the right choice:

Pure Handloom Cotton:
- Perfect for everyday wear, prayers, family visits, and summer festivals.
- Woven from 80s to 120s count cotton, they are incredibly soft and breathable.
- Budget-friendly and easy to wash.

Pure Silk (Pattu):
- Reserved for weddings, housewarmings, major festivals, and formal receptions.
- Exhibits a signature natural golden sheen and premium weight.
- Requires dry cleaning and careful storage.

At Anusree Tex, we weave both categories with high-grade handloom threads to ensure that whichever you choose, you wear absolute comfort.`,
        image: '/assets/blogs/fabric-guide.jpg',
        tags: ['Fabric', 'Cotton', 'Silk'],
        readTime: '5 mins read',
      },
    ];

    await Blog.insertMany(blogs);
    console.log('Blogs seeded.');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

const runSeeder = async () => {
  await connectDB();
  await seedData();
};

runSeeder();
