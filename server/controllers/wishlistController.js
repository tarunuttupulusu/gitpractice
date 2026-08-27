import Wishlist from '../models/Wishlist.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc   Get user wishlist
// @route  GET /api/wishlist
// @access Private
export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }
    res.json({
      success: true,
      data: wishlist.products || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Toggle product in wishlist (Add/Remove)
// @route  POST /api/wishlist/toggle
// @access Private
export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    const index = wishlist.products.findIndex(p => p.toString() === productId);
    let action = '';

    if (index > -1) {
      wishlist.products.splice(index, 1);
      action = 'removed';
    } else {
      wishlist.products.push(productId);
      action = 'added';
    }

    await wishlist.save();
    wishlist = await Wishlist.findById(wishlist._id).populate('products');

    res.json({
      success: true,
      action,
      message: action === 'added' ? 'Added to your Wishlist' : 'Removed from your Wishlist',
      data: wishlist.products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Move wishlist item to cart
// @route  POST /api/wishlist/move-to-cart
// @access Private
export const moveToCart = async (req, res) => {
  try {
    const { productId, size = 'M', color = 'Default' } = req.body;

    // Remove from wishlist
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
      await wishlist.save();
    }

    // Add to cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId && item.size === size && item.color === color
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({
        product: productId,
        size,
        color,
        quantity: 1
      });
    }

    await cart.save();

    res.json({
      success: true,
      message: 'Item moved from wishlist to bag'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
