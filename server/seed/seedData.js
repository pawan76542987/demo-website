export const demoUsers = [
  // Demo Buyer
  {
    name: 'Rahul Sharma',
    email: 'buyer@demo.com',
    phone: '+91 98765 43210',
    password: 'Password123!',
    role: 'buyer',
    addresses: [
      {
        fullName: 'Rahul Sharma',
        phone: '+91 98765 43210',
        street: 'Flat 402, Green Valley Heights, MG Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560001',
        country: 'India',
        isDefault: true
      },
      {
        fullName: 'Rahul Sharma (Office)',
        phone: '+91 98765 43210',
        street: 'Level 5, Tech Horizon Park, Outer Ring Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560103',
        country: 'India',
        isDefault: false
      }
    ]
  },
  // Seller 1: Electronics
  {
    name: 'Apex Tech Solutions',
    email: 'seller1@demo.com',
    phone: '+91 98111 22233',
    password: 'Password123!',
    role: 'seller',
    storeInfo: {
      storeName: 'Apex Tech Store',
      storeDescription: 'Authorized premium retailer of next-generation gadgets, audio gear, laptops, and smart home tech.',
      storeLogo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=200&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80',
      rating: 4.9,
      reviewCount: 1420
    }
  },
  // Seller 2: Fashion
  {
    name: 'Urban Vogue India',
    email: 'seller2@demo.com',
    phone: '+91 98222 33344',
    password: 'Password123!',
    role: 'seller',
    storeInfo: {
      storeName: 'Urban Vogue Studio',
      storeDescription: 'Contemporary Indian apparel, premium footwear, stylish streetwear, and timeless luxury accessories.',
      storeLogo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&auto=format&fit=crop&q=80',
      rating: 4.7,
      reviewCount: 980
    }
  },
  // Seller 3: Home & Kitchen
  {
    name: 'Aura Living & Home',
    email: 'seller3@demo.com',
    phone: '+91 98333 44455',
    password: 'Password123!',
    role: 'seller',
    storeInfo: {
      storeName: 'Aura Home & Living',
      storeDescription: 'Ergonomic furniture, smart kitchen essentials, minimalist decor, and eco-friendly home appliances.',
      storeLogo: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&auto=format&fit=crop&q=80',
      rating: 4.8,
      reviewCount: 650
    }
  },
  // Seller 4: Beauty & Personal Care
  {
    name: 'PureGlow Botanicals',
    email: 'seller4@demo.com',
    phone: '+91 98444 55566',
    password: 'Password123!',
    role: 'seller',
    storeInfo: {
      storeName: 'PureGlow Organics',
      storeDescription: 'Cruelty-free, dermatologically tested natural skincare, rejuvenating hair serums, and clean cosmetics.',
      storeLogo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&auto=format&fit=crop&q=80',
      rating: 4.9,
      reviewCount: 840
    }
  },
  // Seller 5: Grocery & Gourmet
  {
    name: 'FreshMart Organics',
    email: 'seller5@demo.com',
    phone: '+91 98555 66677',
    password: 'Password123!',
    role: 'seller',
    storeInfo: {
      storeName: 'FreshMart Farm Direct',
      storeDescription: 'Single-origin estate coffees, cold-pressed artisanal oils, dry fruits, organic superfoods, and artisanal spices.',
      storeLogo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1200&auto=format&fit=crop&q=80',
      rating: 4.8,
      reviewCount: 1120
    }
  }
];

export const categoriesData = [
  {
    name: 'Electronics',
    slug: 'electronics',
    icon: 'Smartphone',
    description: 'Smartphones, laptops, smartwatches, audio gear & accessories',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80'
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    icon: 'Shirt',
    description: 'Men & Women clothing, ethnic wear, footwear & accessories',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&auto=format&fit=crop&q=80'
  },
  {
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    icon: 'Home',
    description: 'Kitchen appliances, cookware, furniture & home decor',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=80'
  },
  {
    name: 'Beauty & Personal Care',
    slug: 'beauty',
    icon: 'Sparkles',
    description: 'Skincare, haircare, makeup, fragrances & wellness',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80'
  },
  {
    name: 'Grocery & Gourmet',
    slug: 'grocery',
    icon: 'ShoppingBag',
    description: 'Coffee, tea, gourmet staples, organic foods & dry fruits',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80'
  },
  {
    name: 'Sports & Fitness',
    slug: 'sports',
    icon: 'Dumbbell',
    description: 'Fitness gear, yoga mats, sports equipment & apparel',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=80'
  },
  {
    name: 'Books & Stationery',
    slug: 'books',
    icon: 'BookOpen',
    description: 'Bestselling books, planners, notebooks & art supplies',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&auto=format&fit=crop&q=80'
  }
];

export const productsData = [
  // SELLER 1 - APEX TECH (Electronics)
  {
    sellerIndex: 1,
    name: 'AcousticPro ANC Wireless Headphones',
    description: 'Industry-leading Active Noise Cancellation headphones with 40-hour battery life, high-res audio drivers, transparency mode, and ultra-plush memory foam earcups for all-day comfort.',
    category: 'Electronics',
    brand: 'AcousticPro',
    price: 14999,
    discount: 25,
    stock: 45,
    sku: 'AP-ANC-001',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Noise Cancellation', value: 'Hybrid Active (up to -35dB)' },
      { key: 'Battery Life', value: '40 Hours ANC ON, 60 Hours ANC OFF' },
      { key: 'Connectivity', value: 'Bluetooth 5.3 + 3.5mm Aux' },
      { key: 'Fast Charging', value: '10 min charge gives 5 hours' },
      { key: 'Weight', value: '254g' }
    ],
    rating: 4.8,
    reviewCount: 230,
    status: 'active'
  },
  {
    sellerIndex: 1,
    name: 'Zenith UltraSlim 14" OLED Laptop',
    description: 'Powered by latest 12-core processor, 16GB LPDDR5 RAM, 1TB NVMe Gen4 SSD, and a stunning 2.8K 120Hz OLED HDR display in an aerospace-grade aluminum chassis weighing just 1.2kg.',
    category: 'Electronics',
    brand: 'Zenith',
    price: 89999,
    discount: 12,
    stock: 18,
    sku: 'ZEN-LAP-14',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Display', value: '14" 2.8K 120Hz OLED 500 nits' },
      { key: 'RAM', value: '16GB LPDDR5 6400MHz' },
      { key: 'Storage', value: '1TB PCIe Gen4 NVMe SSD' },
      { key: 'Battery', value: '75Wh up to 14 hours' },
      { key: 'Weight', value: '1.2 kg' }
    ],
    rating: 4.9,
    reviewCount: 94,
    status: 'active'
  },
  {
    sellerIndex: 1,
    name: 'PixelWatch Active Pro Smartwatch',
    description: 'Advanced health smartwatch with 1.43" AMOLED always-on display, ECG sensor, SpO2 blood oxygen tracking, dual-band GPS, 5ATM water resistance, and 7-day battery life.',
    category: 'Electronics',
    brand: 'PulseTech',
    price: 7999,
    discount: 30,
    stock: 60,
    sku: 'PULSE-W-01',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Display', value: '1.43" AMOLED 466x466' },
      { key: 'Battery Life', value: 'Up to 7 Days' },
      { key: 'Water Rating', value: '5ATM (50 meters)' },
      { key: 'Sensors', value: 'Optical Heart Rate, SpO2, Accelerometer, Barometer' }
    ],
    rating: 4.7,
    reviewCount: 156,
    status: 'active'
  },
  {
    sellerIndex: 1,
    name: 'ViperX Wireless Gaming Mouse (26K DPI)',
    description: 'Ultralight 58g ergonomic gaming mouse with optical switches rated for 90 million clicks, 26,000 DPI Focus Pro sensor, and lag-free 4000Hz hyper-polling wireless dongle.',
    category: 'Electronics',
    brand: 'ViperX',
    price: 4499,
    discount: 20,
    stock: 35,
    sku: 'VIP-MSE-09',
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Sensor', value: '26,000 DPI Optical' },
      { key: 'Weight', value: '58 grams' },
      { key: 'Polling Rate', value: 'Up to 4000Hz' },
      { key: 'Battery', value: '90 Hours Continuous' }
    ],
    rating: 4.6,
    reviewCount: 78,
    status: 'active'
  },
  {
    sellerIndex: 1,
    name: 'Nova 4K Ultra HD Streaming Camera',
    description: 'Studio-grade 4K 60FPS webcam with Sony STARVIS 2 sensor, AI autoframing, dual beamforming noise-cancelling microphones, and physical magnetic privacy shutter.',
    category: 'Electronics',
    brand: 'NovaVision',
    price: 9999,
    discount: 15,
    stock: 22,
    sku: 'NOV-CAM-4K',
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Resolution', value: '4K @ 60 FPS / 1080p @ 60 FPS' },
      { key: 'Field of View', value: '90° Wide Angle' },
      { key: 'Microphone', value: 'Dual Omnidirectional with AI Noise Shield' }
    ],
    rating: 4.8,
    reviewCount: 42,
    status: 'active'
  },

  // SELLER 2 - URBAN VOGUE (Fashion)
  {
    sellerIndex: 2,
    name: 'Pure Breathable Linen Casual Shirt',
    description: 'Crafted from 100% French linen for exceptional breathability and effortless elegance. Features a relaxed tailored fit, mother-of-pearl buttons, and pre-washed finish to prevent shrinkage.',
    category: 'Fashion',
    brand: 'Urban Vogue',
    price: 2499,
    discount: 35,
    stock: 50,
    sku: 'UV-LIN-SHT',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Material', value: '100% Organic French Linen' },
      { key: 'Fit', value: 'Tailored Regular Fit' },
      { key: 'Collar', value: 'Spread Collar' },
      { key: 'Care', value: 'Machine wash cold, gentle cycle' }
    ],
    rating: 4.7,
    reviewCount: 180,
    status: 'active'
  },
  {
    sellerIndex: 2,
    name: 'Aerolite Velocity Running Sneakers',
    description: 'High-performance neutral running shoes featuring carbon-infused responsive foam midsole, breathable engineered mesh upper, and Continental rubber grip outsole.',
    category: 'Fashion',
    brand: 'Stratus',
    price: 5999,
    discount: 25,
    stock: 40,
    sku: 'STR-RUN-AERO',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Upper', value: 'Engineered Multi-Layer Mesh' },
      { key: 'Midsole', value: 'Energy Foam with Carbon Plate' },
      { key: 'Drop', value: '8mm' },
      { key: 'Weight', value: '215g (Size UK 9)' }
    ],
    rating: 4.9,
    reviewCount: 210,
    status: 'active'
  },
  {
    sellerIndex: 2,
    name: 'Artisan Full-Grain Leather Weekender Bag',
    description: 'Handcrafted from vegetable-tanned full-grain leather that patinas beautifully with time. Features dedicated shoe compartment, padded 15" laptop sleeve, and brass hardware.',
    category: 'Fashion',
    brand: 'Urban Vogue Heritage',
    price: 8499,
    discount: 18,
    stock: 15,
    sku: 'UV-LEA-BAG',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Leather', value: '100% Full-Grain Vegetable Tanned' },
      { key: 'Capacity', value: '42 Liters' },
      { key: 'Dimensions', value: '52 x 28 x 26 cm' },
      { key: 'Hardware', value: 'Solid Antique Brass' }
    ],
    rating: 4.9,
    reviewCount: 65,
    status: 'active'
  },
  {
    sellerIndex: 2,
    name: 'Polarized Aviator Sunglasses (UV400)',
    description: 'Classic teardrop aviator frame built with lightweight titanium alloy, scratch-resistant polarized TAC lenses offering 100% UVA/UVB protection, and self-adjusting silicone nose pads.',
    category: 'Fashion',
    brand: 'SolRay Optics',
    price: 1899,
    discount: 40,
    stock: 55,
    sku: 'SOL-AVI-01',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Lens', value: 'Tri-Acetate Cellulose (TAC) Polarized' },
      { key: 'Frame', value: 'Titanium + Acetate Temple Tips' },
      { key: 'UV Rating', value: 'UV400 100% Protection' }
    ],
    rating: 4.6,
    reviewCount: 112,
    status: 'active'
  },

  // SELLER 3 - AURA LIVING (Home & Kitchen)
  {
    sellerIndex: 3,
    name: 'ErgoPro 3D Mesh Ergonomic Office Chair',
    description: 'Endorsed by ergonomic specialists, featuring dynamic lumbar support, 4D adjustable armrests, breathable Korean mesh back, pneumatic height adjustment, and smooth rollerblade caster wheels.',
    category: 'Home & Kitchen',
    brand: 'Aura Living',
    price: 16999,
    discount: 30,
    stock: 20,
    sku: 'AURA-CHR-01',
    images: [
      'https://images.unsplash.com/photo-1580481077197-2a543884391a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Weight Capacity', value: 'Up to 150 kg' },
      { key: 'Recline Angle', value: '90° to 135° with 3 lock positions' },
      { key: 'Armrests', value: '4D (Height, Angle, Depth, Width)' },
      { key: 'Base', value: 'Heavy Duty Die-Cast Aluminum' }
    ],
    rating: 4.9,
    reviewCount: 175,
    status: 'active'
  },
  {
    sellerIndex: 3,
    name: 'Smart Robovac 2-in-1 Vacuum & Mop with LiDAR',
    description: 'Next-gen robotic vacuum with 5000Pa hyper suction, precision LiDAR navigation, smart room mapping via app, automatic carpet detection, and 5200mAh battery providing 180 min runtime.',
    category: 'Home & Kitchen',
    brand: 'CleanBot',
    price: 24999,
    discount: 22,
    stock: 14,
    sku: 'CLN-BOT-V2',
    images: [
      'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Suction Power', value: '5000 Pa' },
      { key: 'Navigation', value: 'LiDAR 360° Laser SLAM' },
      { key: 'Dustbin / Water', value: '450ml Dustbin / 250ml Water Tank' },
      { key: 'Runtime', value: 'Up to 180 minutes' }
    ],
    rating: 4.7,
    reviewCount: 88,
    status: 'active'
  },
  {
    sellerIndex: 3,
    name: 'Tri-Ply Stainless Steel 5-Piece Cookware Set',
    description: 'Professional grade 3-layer construction (stainless steel + aluminum core + induction steel) ensuring even heat distribution without hotspots. Oven-safe up to 260°C.',
    category: 'Home & Kitchen',
    brand: 'ChefCraft',
    price: 6499,
    discount: 20,
    stock: 28,
    sku: 'CC-COOK-5P',
    images: [
      'https://images.unsplash.com/photo-1584990347449-389a9f24bf74?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Construction', value: 'Tri-Ply SS304 Food Grade' },
      { key: 'Pieces Included', value: 'Fry Pan 24cm, Kadai 2.5L with Lid, Saucepan 1.5L with Lid' },
      { key: 'Compatibility', value: 'Induction, Gas, Ceramic, Halogen, Oven' }
    ],
    rating: 4.8,
    reviewCount: 120,
    status: 'active'
  },
  {
    sellerIndex: 3,
    name: 'Ultrasonic Essential Oil Aromatherapy Diffuser',
    description: '500ml wood grain aesthetic ultrasonic diffuser with whisper-quiet operation (<20dB), 7 soothing ambient LED light colors, waterless auto-shutoff, and timer settings.',
    category: 'Home & Kitchen',
    brand: 'Aura Living',
    price: 1799,
    discount: 40,
    stock: 45,
    sku: 'AURA-DIF-500',
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Capacity', value: '500 ml' },
      { key: 'Coverage', value: 'Up to 300 sq. ft.' },
      { key: 'Timer Modes', value: '1H / 3H / 6H / Continuous ON' }
    ],
    rating: 4.6,
    reviewCount: 95,
    status: 'active'
  },

  // SELLER 4 - PUREGLOW BOTANICALS (Beauty & Personal Care)
  {
    sellerIndex: 4,
    name: 'Vitamin C 20% + Hyaluronic Radiance Serum (30ml)',
    description: 'Stabilized 20% Vitamin C with pure Ferulic Acid and multi-molecular Hyaluronic acid. Brightens dark spots, evens skin tone, and boosts collagen synthesis without irritation.',
    category: 'Beauty & Personal Care',
    brand: 'PureGlow Botanicals',
    price: 899,
    discount: 25,
    stock: 80,
    sku: 'PG-VITC-30',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608248597359-bbcf32be6925?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Key Actives', value: '20% Ethyl Ascorbic Acid, Ferulic Acid, Hyaluronic Acid' },
      { key: 'Skin Type', value: 'All Skin Types (Dermatologically Tested)' },
      { key: 'Free From', value: 'Parabens, Sulphates, Mineral Oil, Synthetic Fragrance' }
    ],
    rating: 4.9,
    reviewCount: 310,
    status: 'active'
  },
  {
    sellerIndex: 4,
    name: 'Invisible Ultra-Light Matte Sunscreen SPF 50+ PA++++',
    description: 'Broad-spectrum chemical & mineral hybrid sunscreen with zero white cast, non-sticky matte gel texture, water resistance, and antioxidant Green Tea extracts.',
    category: 'Beauty & Personal Care',
    brand: 'PureGlow Botanicals',
    price: 649,
    discount: 15,
    stock: 95,
    sku: 'PG-SUN-50',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'SPF Rating', value: 'SPF 50+ Broad Spectrum UV Protection' },
      { key: 'PA Factor', value: 'PA++++ (Highest UVA Protection)' },
      { key: 'Finish', value: 'Ultra-Lightweight Invisible Matte' }
    ],
    rating: 4.8,
    reviewCount: 240,
    status: 'active'
  },
  {
    sellerIndex: 4,
    name: 'Rosemary & Biotin Scalp Revitalizing Oil (100ml)',
    description: 'Cold-pressed infusion of pure Rosemary essential oil, Biotin, Redensyl, and Golden Jojoba oil that stimulates microcirculation, strengthens hair follicles, and reduces hair fall.',
    category: 'Beauty & Personal Care',
    brand: 'PureGlow Botanicals',
    price: 749,
    discount: 20,
    stock: 65,
    sku: 'PG-OIL-100',
    images: [
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Volume', value: '100 ml Glass Dropper Bottle' },
      { key: 'Key Ingredients', value: 'Pure Rosemary Leaf Oil, Biotin, Castor Oil, Argan Oil' },
      { key: 'Benefit', value: 'Strengthens roots & stimulates healthy hair density' }
    ],
    rating: 4.7,
    reviewCount: 165,
    status: 'active'
  },

  // SELLER 5 - FRESHMART ORGANICS (Grocery & Gourmet)
  {
    sellerIndex: 5,
    name: 'Single-Origin Chikmagalur Arabica Coffee Beans (500g)',
    description: 'Directly sourced from high-altitude shade-grown estates of Western Ghats. Medium-dark roast with aromatic notes of dark cocoa, roasted hazelnuts, and a smooth caramel finish.',
    category: 'Grocery & Gourmet',
    brand: 'Monsoon Estate',
    price: 599,
    discount: 10,
    stock: 75,
    sku: 'FM-COF-500',
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Bean Type', value: '100% Arabica AAA Grade' },
      { key: 'Roast Level', value: 'Medium-Dark Artisanal Roast' },
      { key: 'Origin', value: 'Chikmagalur, Karnataka, India' },
      { key: 'Net Weight', value: '500g Valve Sealed Pouch' }
    ],
    rating: 4.9,
    reviewCount: 280,
    status: 'active'
  },
  {
    sellerIndex: 5,
    name: 'Cold-Pressed Extra Virgin Olive Oil (1 Litre)',
    description: 'First cold-pressed unrefined extra virgin olive oil with less than 0.3% acidity. Rich in polyphenols, monounsaturated fatty acids, and natural vitamin E. Packed in a dark glass bottle.',
    category: 'Grocery & Gourmet',
    brand: 'OliveGrove Organics',
    price: 1299,
    discount: 15,
    stock: 40,
    sku: 'FM-OIL-EV1L',
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Extraction', value: 'First Cold Extraction (<27°C)' },
      { key: 'Acidity', value: '< 0.3%' },
      { key: 'Volume', value: '1000 ml Dark UV Glass Bottle' }
    ],
    rating: 4.8,
    reviewCount: 140,
    status: 'active'
  },
  {
    sellerIndex: 5,
    name: 'Raw Unprocessed Himalayan Wildflower Honey (500g)',
    description: 'Sustainably harvested raw unpasteurized honey from high-altitude flora of the Himalayas. Retains all natural pollen, enzymes, antioxidants, and a delicate floral flavor.',
    category: 'Grocery & Gourmet',
    brand: 'Himalayan Nectar',
    price: 499,
    discount: 10,
    stock: 60,
    sku: 'FM-HNY-500',
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Type', value: 'Raw Unpasteurized Wildflower Honey' },
      { key: 'Purity', value: '100% Pure, Zero Added Sugars' },
      { key: 'Packaging', value: '500g Hexagonal Glass Jar' }
    ],
    rating: 4.9,
    reviewCount: 195,
    status: 'active'
  },

  // ADDITIONAL CROSS-CATEGORY PRODUCTS
  {
    sellerIndex: 1, // Apex Tech
    name: 'ProBass Soundbar 2.1 with Wireless Subwoofer',
    description: '240W Cinematic Dolby Audio soundbar featuring dedicated wireless subwoofer, HDMI eARC, Optical, AUX, and Bluetooth 5.3 inputs with 3 EQ sound presets for movies, music, and news.',
    category: 'Electronics',
    brand: 'AcousticPro',
    price: 11999,
    discount: 33,
    stock: 25,
    sku: 'AP-SB-240',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Total Power', value: '240W RMS' },
      { key: 'Audio Channels', value: '2.1 with 6.5" Wireless Subwoofer' },
      { key: 'Inputs', value: 'HDMI eARC, Optical, USB, Bluetooth 5.3' }
    ],
    rating: 4.7,
    reviewCount: 64,
    status: 'active'
  },
  {
    sellerIndex: 3, // Aura Living
    name: 'High-Density Non-Slip Eco Yoga Mat (6mm)',
    description: 'Eco-friendly TPE alignment yoga mat featuring dual-sided textured grip, body alignment guide lines, high resilience cushioning for joints, and complimentary carry strap.',
    category: 'Sports & Fitness',
    brand: 'Aura Living',
    price: 1299,
    discount: 35,
    stock: 50,
    sku: 'AURA-YGA-6M',
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Thickness', value: '6mm High-Density Cushioning' },
      { key: 'Material', value: 'Biodegradable Eco-TPE' },
      { key: 'Dimensions', value: '183 x 61 cm' }
    ],
    rating: 4.8,
    reviewCount: 89,
    status: 'active'
  },
  {
    sellerIndex: 2, // Urban Vogue
    name: 'Hardcover Minimalist Bullet Journal & Pen Set',
    description: '160 GSM ultra-thick bleed-proof dot grid journal bound in vegan leather with 180° lay-flat binding, expandable back pocket, 2 ribbon bookmarks, and archival fineliner pen.',
    category: 'Books & Stationery',
    brand: 'Urban Vogue Studio',
    price: 799,
    discount: 20,
    stock: 90,
    sku: 'UV-JRN-160',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Paper', value: '160 GSM Bleedproof Bamboo Paper' },
      { key: 'Pages', value: '192 Dot Grid Numbered Pages' },
      { key: 'Cover', value: 'Water-Resistant Vegan PU Leather' }
    ],
    rating: 4.9,
    reviewCount: 142,
    status: 'active'
  }
];
