import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { Cart } from '../models/Cart.js';

// @desc    Get all products with filtering, search, sorting, and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      inStock,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = { status: 'active' };

    // Text Search / Regex Search
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { category: searchRegex },
        { description: searchRegex }
      ];
    }

    // Category Filter
    if (category && category !== 'All' && category !== '') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Brand Filter
    if (brand && brand !== 'All' && brand !== '') {
      query.brand = { $regex: new RegExp(`^${brand}$`, 'i') };
    }

    // Price Range Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Rating Filter
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // In Stock Only Filter
    if (inStock === 'true' || inStock === true) {
      query.stock = { $gt: 0 };
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // Default: Newest first
    if (sort === 'price-asc') sortOptions = { price: 1 };
    else if (sort === 'price-desc') sortOptions = { price: -1 };
    else if (sort === 'rating') sortOptions = { rating: -1, reviewCount: -1 };
    else if (sort === 'discount') sortOptions = { discount: -1 };
    else if (sort === 'popular') sortOptions = { reviewCount: -1, rating: -1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('sellerId', 'name storeInfo email phone')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Get unique categories and brands for filter menus
    const categories = await Product.distinct('category', { status: 'active' });
    const brands = await Product.distinct('brand', { status: 'active' });

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      categories,
      brands,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('sellerId', 'name storeInfo email phone');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get related products from same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      status: 'active'
    })
      .populate('sellerId', 'name storeInfo')
      .limit(4);

    res.status(200).json({
      success: true,
      product,
      relatedProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured, trending, and top deals
// @route   GET /api/products/highlights
// @access  Public
export const getHighlights = async (req, res, next) => {
  try {
    const [featured, topDeals, topRated, newArrivals] = await Promise.all([
      Product.find({ status: 'active' }).populate('sellerId', 'name storeInfo').sort({ reviewCount: -1, rating: -1 }).limit(8),
      Product.find({ status: 'active', discount: { $gte: 15 } }).populate('sellerId', 'name storeInfo').sort({ discount: -1 }).limit(8),
      Product.find({ status: 'active', rating: { $gte: 4 } }).populate('sellerId', 'name storeInfo').sort({ rating: -1 }).limit(8),
      Product.find({ status: 'active' }).populate('sellerId', 'name storeInfo').sort({ createdAt: -1 }).limit(8)
    ]);

    res.status(200).json({
      success: true,
      featured,
      topDeals,
      topRated,
      newArrivals
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Seller only)
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      brand,
      price,
      discount,
      stock,
      sku,
      images,
      specifications,
      status
    } = req.body;

    if (!name || !description || !category || !brand || price === undefined || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, description, category, brand, price, and stock'
      });
    }

    const imageList = Array.isArray(images) && images.length > 0 
      ? images 
      : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'];

    const product = await Product.create({
      sellerId: req.user._id,
      name,
      description,
      category,
      brand,
      price: Number(price),
      discount: discount !== undefined ? Number(discount) : 0,
      stock: Number(stock),
      sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
      images: imageList,
      specifications: Array.isArray(specifications) ? specifications : [],
      status: status || 'active'
    });

    const populatedProduct = await Product.findById(product._id).populate('sellerId', 'name storeInfo');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: populatedProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Seller owner only)
export const updateProduct = async (req, res, next) => {
  try {
    // req.product is set by verifySellerProductOwnership middleware
    const {
      name,
      description,
      category,
      brand,
      price,
      discount,
      stock,
      sku,
      images,
      specifications,
      status
    } = req.body;

    const product = req.product;

    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    if (brand) product.brand = brand;
    if (price !== undefined) product.price = Number(price);
    if (discount !== undefined) product.discount = Number(discount);
    if (stock !== undefined) product.stock = Number(stock);
    if (sku) product.sku = sku;
    if (images && Array.isArray(images) && images.length > 0) product.images = images;
    if (specifications && Array.isArray(specifications)) product.specifications = specifications;
    if (status) product.status = status;

    await product.save();
    const updatedProduct = await Product.findById(product._id).populate('sellerId', 'name storeInfo');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Seller owner only)
export const deleteProduct = async (req, res, next) => {
  try {
    // req.product is set by verifySellerProductOwnership middleware
    const product = req.product;

    await Product.findByIdAndDelete(product._id);

    // Clean up cart items referencing this deleted product
    await Cart.updateMany(
      { 'items.productId': product._id },
      { $pull: { items: { productId: product._id } } }
    );

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public store page for a seller
// @route   GET /api/products/seller/:sellerId
// @access  Public
export const getSellerStore = async (req, res, next) => {
  try {
    const seller = await User.findOne({ _id: req.params.sellerId, role: 'seller' }).select('-password');
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller store not found'
      });
    }

    const products = await Product.find({ sellerId: seller._id, status: 'active' }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      seller,
      productCount: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};
