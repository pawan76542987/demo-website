import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// Helper to generate JWT Token
const generateToken = (id) => {
  const jwtSecret = process.env.JWT_SECRET || 'demo_jwt_secret_key_portfolio_2026';
  return jwt.sign({ id }, jwtSecret, { expiresIn: '7d' });
};

// @desc    Register a new user (buyer or seller)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, storeName, storeDescription, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, phone, and password'
      });
    }

    const assignedRole = role === 'seller' ? 'seller' : 'buyer';

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    const userData = {
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: assignedRole
    };

    if (assignedRole === 'seller') {
      userData.storeInfo = {
        storeName: storeName || `${name}'s Store`,
        storeDescription: storeDescription || 'Welcome to our official store on DEMO marketplace.',
        rating: 4.8,
        reviewCount: 0
      };
    }

    if (address && (address.street || address.city)) {
      userData.addresses = [{
        fullName: address.fullName || name,
        phone: address.phone || phone,
        street: address.street || '',
        city: address.city || '',
        state: address.state || '',
        postalCode: address.postalCode || '',
        country: address.country || 'India',
        isDefault: true
      }];
    }

    const user = await User.create(userData);
    const token = generateToken(user._id);

    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(201).json({
      success: true,
      message: `${assignedRole === 'seller' ? 'Seller' : 'Buyer'} account registered successfully`,
      token,
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password, requiredRole } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // If client requested a specific portal login (e.g. login from seller portal)
    if (requiredRole && user.role !== requiredRole) {
      return res.status(403).json({
        success: false,
        message: `Account found, but this is a ${user.role} account. Please use the ${user.role} login portal.`
      });
    }

    const token = generateToken(user._id);

    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile & store info
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { name, phone, storeName, storeDescription, storeLogo, banner } = req.body;

    if (name) user.name = name;
    if (phone) user.phone = phone;

    if (user.role === 'seller') {
      user.storeInfo = {
        ...user.storeInfo,
        storeName: storeName !== undefined ? storeName : user.storeInfo?.storeName,
        storeDescription: storeDescription !== undefined ? storeDescription : user.storeInfo?.storeDescription,
        storeLogo: storeLogo !== undefined ? storeLogo : user.storeInfo?.storeLogo,
        banner: banner !== undefined ? banner : user.storeInfo?.banner
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add shipping address
// @route   POST /api/auth/addresses
// @access  Private (Buyer)
export const addAddress = async (req, res, next) => {
  try {
    const { fullName, phone, street, city, state, postalCode, country, isDefault } = req.body;

    if (!fullName || !phone || !street || !city || !state || !postalCode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required address fields'
      });
    }

    const user = await User.findById(req.user._id);

    // If this is the first address or marked as default, reset other default addresses
    if (isDefault || user.addresses.length === 0) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push({
      fullName,
      phone,
      street,
      city,
      state,
      postalCode,
      country: country || 'India',
      isDefault: isDefault || user.addresses.length === 0
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      addresses: user.addresses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete shipping address
// @route   DELETE /api/auth/addresses/:addressId
// @access  Private (Buyer)
export const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const addressId = req.params.addressId;

    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
    
    // If we deleted default address and have other addresses, make first one default
    if (user.addresses.length > 0 && !user.addresses.some(a => a.isDefault)) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      addresses: user.addresses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set default shipping address
// @route   PUT /api/auth/addresses/:addressId/default
// @access  Private (Buyer)
export const setDefaultAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const addressId = req.params.addressId;

    let found = false;
    user.addresses.forEach(addr => {
      if (addr._id.toString() === addressId) {
        addr.isDefault = true;
        found = true;
      } else {
        addr.isDefault = false;
      }
    });

    if (!found) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Default address updated',
      addresses: user.addresses
    });
  } catch (error) {
    next(error);
  }
};
