import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Coupon from '../models/Coupon.js';

// @desc   Get comprehensive Admin Dashboard metrics
// @route  GET /api/admin/dashboard
// @access Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'customer' });

    // Calculate total revenue from non-cancelled orders
    const salesData = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$pricing.total' } } }
    ]);
    const totalSales = salesData.length > 0 ? salesData[0].totalRevenue : 0;

    // Low stock products (total stock <= 10)
    const lowStockProducts = await Product.find({ stock: { $lte: 10 } })
      .select('name slug stock price images category')
      .limit(6);

    // Recent 6 orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    // Best-selling products
    const bestSellers = await Product.find({ isBestSeller: true })
      .select('name slug price salePrice images category rating reviewCount stock')
      .limit(5);

    // Sales by Category
    const categoryBreakdown = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, avgPrice: { $avg: '$price' } } },
      { $sort: { count: -1 } }
    ]);

    // Order status counts
    const statusCounts = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    // Mock/Real monthly trends
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const mIndex = (currentMonth - i + 12) % 12;
      monthlyTrends.push({
        month: months[mIndex],
        revenue: Math.round(35000 + Math.random() * 45000 + (5 - i) * 12000),
        orders: Math.round(18 + Math.random() * 25 + (5 - i) * 6)
      });
    }

    res.json({
      success: true,
      data: {
        summary: {
          totalSales,
          totalOrders,
          totalUsers,
          totalProducts,
          lowStockCount: lowStockProducts.length
        },
        lowStockProducts,
        recentOrders,
        bestSellers,
        categoryBreakdown,
        statusCounts,
        monthlyTrends
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get admin products with filters & pagination
// @route  GET /api/admin/products
// @access Private/Admin
export const getAdminProducts = async (req, res) => {
  try {
    const { search, category, gender, stockStatus, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      const reg = new RegExp(search.trim(), 'i');
      query.$or = [{ name: reg }, { brand: reg }, { category: reg }, { subcategory: reg }];
    }
    if (category) query.category = new RegExp(`^${category}$`, 'i');
    if (gender) query.gender = gender;
    if (stockStatus === 'out') query.stock = 0;
    if (stockStatus === 'low') query.stock = { $gt: 0, $lte: 10 };
    if (stockStatus === 'in') query.stock = { $gt: 10 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum);

    res.json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Create new product
// @route  POST /api/admin/products
// @access Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      subcategory,
      gender,
      price,
      salePrice,
      images,
      colors,
      sizes,
      material,
      careInstructions,
      isFeatured,
      isNewArrival,
      isBestSeller,
      specifications
    } = req.body;

    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    const product = new Product({
      name,
      slug,
      description,
      category,
      subcategory: subcategory || '',
      gender: gender || 'men',
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : null,
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80'],
      colors: colors || [{ name: 'Classic Black', hex: '#111111', inStock: true }],
      sizes: sizes || [
        { size: 'S', stock: 10 },
        { size: 'M', stock: 15 },
        { size: 'L', stock: 15 },
        { size: 'XL', stock: 10 }
      ],
      material: material || '100% Fine Egyptian Cotton',
      careInstructions: careInstructions || 'Dry clean recommended.',
      isFeatured: !!isFeatured,
      isNewArrival: !!isNewArrival,
      isBestSeller: !!isBestSeller,
      specifications: specifications || []
    });

    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update existing product
// @route  PUT /api/admin/products/:id
// @access Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updatableFields = [
      'name', 'description', 'category', 'subcategory', 'gender',
      'price', 'salePrice', 'images', 'colors', 'sizes', 'material',
      'careInstructions', 'isFeatured', 'isNewArrival', 'isBestSeller', 'specifications'
    ];

    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    const updatedProduct = await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete product
// @route  DELETE /api/admin/products/:id
// @access Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product removed from catalog'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get all customer orders
// @route  GET /api/admin/orders
// @access Private/Admin
export const getAdminOrders = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    if (search) {
      const reg = new RegExp(search.trim(), 'i');
      query.$or = [
        { orderNumber: reg },
        { trackingNumber: reg },
        { 'shippingAddress.fullName': reg },
        { 'shippingAddress.phone': reg }
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update order status & add timeline entry
// @route  PUT /api/admin/orders/:id/status
// @access Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, description, location } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const statusDescriptions = {
      'Confirmed': 'Your order has been verified and confirmed.',
      'Processing': 'Items are being tailored, packaged and quality inspected.',
      'Shipped': 'Package handed over to premium courier partner.',
      'Out for Delivery': 'Our courier associate is out for delivery in your area.',
      'Delivered': 'Shipment delivered successfully.',
      'Cancelled': 'Order has been cancelled by administration.'
    };

    order.orderStatus = status;
    if (status === 'Delivered') {
      order.paymentStatus = 'Paid';
    }

    order.timeline.push({
      status,
      title: `Order Status: ${status}`,
      description: description || statusDescriptions[status] || `Status updated to ${status}`,
      timestamp: new Date()
    });

    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get all users for admin
// @route  GET /api/admin/users
// @access Private/Admin
export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    // Aggregate user order stats
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const userOrders = await Order.find({ user: user._id });
        const totalSpent = userOrders.reduce((acc, o) => acc + (o.pricing?.total || 0), 0);
        return {
          ...user.toObject(),
          orderCount: userOrders.length,
          totalSpent
        };
      })
    );

    res.json({
      success: true,
      count: usersWithStats.length,
      data: usersWithStats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Toggle user active / suspended status
// @route  PUT /api/admin/users/:id/status
// @access Private/Admin
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin' && req.user._id.toString() === user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot deactivate your own admin account' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User account is now ${user.isActive ? 'Active' : 'Suspended'}`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Create Category
// @route  POST /api/admin/categories
// @access Private/Admin
export const createCategory = async (req, res) => {
  try {
    const { name, gender, description, image, subcategories } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const category = await Category.create({
      name,
      slug,
      gender: gender || 'men',
      description: description || '',
      image: image || '',
      subcategories: subcategories || []
    });

    res.status(201).json({
      success: true,
      message: 'Category created',
      data: category
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete Category
// @route  DELETE /api/admin/categories/:id
// @access Private/Admin
export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get all coupons
// @route  GET /api/admin/coupons
// @access Private/Admin
export const getAdminCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: coupons
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Create coupon
// @route  POST /api/admin/coupons
// @access Private/Admin
export const createCoupon = async (req, res) => {
  try {
    const { code, description, discountPercent, minOrderValue, maxDiscountAmount, validUntil } = req.body;

    const coupon = await Coupon.create({
      code: code.toUpperCase().trim(),
      description,
      discountPercent: Number(discountPercent),
      minOrderValue: Number(minOrderValue) || 0,
      maxDiscountAmount: Number(maxDiscountAmount) || 5000,
      validUntil: validUntil ? new Date(validUntil) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    });

    res.status(201).json({
      success: true,
      message: 'Promotion code created',
      data: coupon
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete coupon
// @route  DELETE /api/admin/coupons/:id
// @access Private/Admin
export const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
