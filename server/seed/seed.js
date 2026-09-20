import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { Review } from '../models/Review.js';
import { Cart } from '../models/Cart.js';
import { Wishlist } from '../models/Wishlist.js';
import { demoUsers, categoriesData, productsData } from './seedData.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/demo_marketplace';
    await mongoose.connect(mongoUri);
    console.log(`[Seed] Connected to MongoDB: ${mongoUri}`);

    // Clear existing collections
    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      Review.deleteMany({}),
      Cart.deleteMany({}),
      Wishlist.deleteMany({})
    ]);

    // 1. Seed Categories
    console.log('[Seed] Seeding categories...');
    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`[Seed] Seeded ${createdCategories.length} categories.`);

    // 2. Seed Users (Buyer + 5 Sellers)
    console.log('[Seed] Seeding users with hashed passwords...');
    const createdUsers = [];
    for (const userData of demoUsers) {
      // Create user individually so the Mongoose pre('save') password hashing runs
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    console.log(`[Seed] Seeded ${createdUsers.length} users (1 Buyer + 5 Sellers).`);

    const buyerUser = createdUsers[0]; // Buyer
    const sellers = createdUsers.slice(1); // 5 Sellers

    // 3. Seed Products associated with corresponding seller IDs
    console.log('[Seed] Seeding products with specifications & images...');
    const productsToInsert = productsData.map(prod => {
      const seller = sellers[prod.sellerIndex - 1];
      const productObj = { ...prod, sellerId: seller._id };
      delete productObj.sellerIndex;
      return productObj;
    });

    const createdProducts = await Product.insertMany(productsToInsert);
    console.log(`[Seed] Seeded ${createdProducts.length} rich marketplace products.`);

    // 4. Create sample initial multi-vendor orders for the Buyer
    console.log('[Seed] Creating sample multi-vendor orders...');
    const prodHeadphones = createdProducts[0]; // Seller 1 (Apex)
    const prodShirt = createdProducts[5];      // Seller 2 (Urban Vogue)
    const prodChair = createdProducts[9];      // Seller 3 (Aura Living)
    const prodSerum = createdProducts[13];     // Seller 4 (PureGlow)
    const prodCoffee = createdProducts[16];    // Seller 5 (FreshMart)

    // Order 1: Delivered multi-vendor order (Apex Tech + Urban Vogue)
    const order1Items = [
      {
        productId: prodHeadphones._id,
        sellerId: prodHeadphones.sellerId,
        name: prodHeadphones.name,
        image: prodHeadphones.images[0],
        price: prodHeadphones.price,
        discount: prodHeadphones.discount,
        sellingPrice: Math.round(prodHeadphones.price * (1 - prodHeadphones.discount / 100)),
        quantity: 1,
        itemStatus: 'Delivered'
      },
      {
        productId: prodShirt._id,
        sellerId: prodShirt.sellerId,
        name: prodShirt.name,
        image: prodShirt.images[0],
        price: prodShirt.price,
        discount: prodShirt.discount,
        sellingPrice: Math.round(prodShirt.price * (1 - prodShirt.discount / 100)),
        quantity: 2,
        itemStatus: 'Delivered'
      }
    ];

    const subtotal1 = (prodHeadphones.price * 1) + (prodShirt.price * 2);
    const total1 = (order1Items[0].sellingPrice * 1) + (order1Items[1].sellingPrice * 2);

    const order1 = await Order.create({
      buyerId: buyerUser._id,
      items: order1Items,
      shippingAddress: buyerUser.addresses[0],
      subtotal: subtotal1,
      discount: subtotal1 - total1,
      deliveryFee: 0,
      total: total1,
      paymentMethod: 'DEMO_ONLINE',
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
      paymentDetails: {
        transactionId: `TXN-DEMO-${Date.now()}-001`,
        simulatedResult: 'SUCCESS',
        paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        paymentGateway: 'DEMO Instant Pay'
      },
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    });

    // Order 2: In-transit order (Aura Living + PureGlow Botanicals)
    const order2Items = [
      {
        productId: prodChair._id,
        sellerId: prodChair.sellerId,
        name: prodChair.name,
        image: prodChair.images[0],
        price: prodChair.price,
        discount: prodChair.discount,
        sellingPrice: Math.round(prodChair.price * (1 - prodChair.discount / 100)),
        quantity: 1,
        itemStatus: 'Shipped'
      },
      {
        productId: prodSerum._id,
        sellerId: prodSerum.sellerId,
        name: prodSerum.name,
        image: prodSerum.images[0],
        price: prodSerum.price,
        discount: prodSerum.discount,
        sellingPrice: Math.round(prodSerum.price * (1 - prodSerum.discount / 100)),
        quantity: 1,
        itemStatus: 'Shipped'
      }
    ];

    const subtotal2 = (prodChair.price * 1) + (prodSerum.price * 1);
    const total2 = (order2Items[0].sellingPrice * 1) + (order2Items[1].sellingPrice * 1);

    await Order.create({
      buyerId: buyerUser._id,
      items: order2Items,
      shippingAddress: buyerUser.addresses[0],
      subtotal: subtotal2,
      discount: subtotal2 - total2,
      deliveryFee: 0,
      total: total2,
      paymentMethod: 'DEMO_ONLINE',
      paymentStatus: 'Paid',
      orderStatus: 'Shipped',
      paymentDetails: {
        transactionId: `TXN-DEMO-${Date.now()}-002`,
        simulatedResult: 'SUCCESS',
        paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        paymentGateway: 'DEMO Instant Pay'
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    });

    // 5. Create verified reviews for delivered order products
    console.log('[Seed] Seeding verified product reviews...');
    await Review.create([
      {
        productId: prodHeadphones._id,
        buyerId: buyerUser._id,
        orderId: order1._id,
        rating: 5,
        title: 'Exceptional sound quality & ANC!',
        comment: 'The noise cancellation is on par with the best flagship brands. Deep rich bass and crystal clear vocals. Super fast delivery on DEMO!',
        buyerName: buyerUser.name,
        isVerifiedPurchase: true
      },
      {
        productId: prodShirt._id,
        buyerId: buyerUser._id,
        orderId: order1._id,
        rating: 5,
        title: 'Premium French linen, perfectly tailored',
        comment: 'Extremely comfortable for warm weather. The stitching and buttons feel luxurious. Highly recommend Urban Vogue!',
        buyerName: buyerUser.name,
        isVerifiedPurchase: true
      }
    ]);

    // 6. Seed sample Wishlist and Cart for the buyer
    console.log('[Seed] Seeding sample wishlist & cart for demo buyer...');
    await Wishlist.create({
      userId: buyerUser._id,
      products: [prodCoffee._id, createdProducts[1]._id]
    });

    await Cart.create({
      userId: buyerUser._id,
      items: [
        {
          productId: prodCoffee._id,
          sellerId: prodCoffee.sellerId,
          quantity: 1,
          price: prodCoffee.price,
          discount: prodCoffee.discount
        }
      ]
    });

    console.log('====================================================');
    console.log('✅ DEMO MARKETPLACE DATABASE SEEDED SUCCESSFULLY!');
    console.log('====================================================');
    console.log('Demo Credentials:');
    console.log('  Buyer:   buyer@demo.com   / Password123!');
    console.log('  Seller 1 (Apex Tech):      seller1@demo.com / Password123!');
    console.log('  Seller 2 (Urban Vogue):    seller2@demo.com / Password123!');
    console.log('  Seller 3 (Aura Living):    seller3@demo.com / Password123!');
    console.log('  Seller 4 (PureGlow):       seller4@demo.com / Password123!');
    console.log('  Seller 5 (FreshMart):      seller5@demo.com / Password123!');
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();
