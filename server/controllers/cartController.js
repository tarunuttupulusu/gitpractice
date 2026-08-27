import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';

// Helper to compute cart totals
export const calculateCartTotals = (cart) => {
  let subtotal = 0;
  let itemsCount = 0;

  const validItems = [];

  for (const item of cart.items) {
    if (item.product) {
      const price = item.product.salePrice && item.product.salePrice < item.product.price
        ? item.product.salePrice
        : item.product.price;

      subtotal += price * item.quantity;
      itemsCount += item.quantity;
      validItems.push(item);
    }
  }

  let discount = 0;
  if (cart.appliedCoupon && cart.appliedCoupon.code) {
    if (cart.appliedCoupon.discountPercent > 0) {
      discount = Math.round((subtotal * cart.appliedCoupon.discountPercent) / 100);
      if (cart.appliedCoupon.maxDiscountAmount && discount > cart.appliedCoupon.maxDiscountAmount) {
        discount = cart.appliedCoupon.maxDiscountAmount;
      }
    }
  }

  const deliveryCharge = subtotal >= 1999 || subtotal === 0 ? 0 : 150; // Free delivery over ₹1,999
  const tax = Math.round((subtotal - discount) * 0.05); // 5% GST on apparel
  const total = Math.max(0, subtotal - discount + deliveryCharge + tax);

  return {
    itemsCount,
    subtotal,
    discount,
    deliveryCharge,
    tax,
    total,
    freeDeliveryThreshold: 1999,
    amountForFreeDelivery: Math.max(0, 1999 - subtotal)
  };
};

// @desc   Get current user cart
// @route  GET /api/cart
// @access Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const calculations = calculateCartTotals(cart);

    res.json({
      success: true,
      data: {
        _id: cart._id,
        items: cart.items,
        appliedCoupon: cart.appliedCoupon,
        ...calculations
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Add item to cart
// @route  POST /api/cart/items
// @access Private
export const addToCart = async (req, res) => {
  try {
    const { productId, size, color, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if same product + size + color already exists in cart
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId && item.size === size && item.color === color
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        product: productId,
        size,
        color,
        quantity: Number(quantity)
      });
    }

    await cart.save();
    cart = await Cart.findById(cart._id).populate('items.product');
    const calculations = calculateCartTotals(cart);

    res.json({
      success: true,
      message: 'Item added to bag',
      data: {
        _id: cart._id,
        items: cart.items,
        appliedCoupon: cart.appliedCoupon,
        ...calculations
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update item quantity in cart
// @route  PUT /api/cart/items/:itemId
// @access Private
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (quantity <= 0) {
      return removeFromCart(req, res);
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    item.quantity = Number(quantity);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    const calculations = calculateCartTotals(populatedCart);

    res.json({
      success: true,
      message: 'Bag updated',
      data: {
        _id: populatedCart._id,
        items: populatedCart.items,
        appliedCoupon: populatedCart.appliedCoupon,
        ...calculations
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Remove item from cart
// @route  DELETE /api/cart/items/:itemId
// @access Private
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    const calculations = calculateCartTotals(populatedCart);

    res.json({
      success: true,
      message: 'Item removed from bag',
      data: {
        _id: populatedCart._id,
        items: populatedCart.items,
        appliedCoupon: populatedCart.appliedCoupon,
        ...calculations
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Apply discount coupon
// @route  POST /api/cart/apply-coupon
// @access Private
export const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Please enter a coupon code' });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase().trim(),
      isActive: true,
      validUntil: { $gt: new Date() }
    });

    if (!coupon) {
      return res.status(400).json({ success: false, message: 'Invalid or expired coupon code' });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your bag is empty' });
    }

    let subtotal = 0;
    cart.items.forEach(item => {
      if (item.product) {
        const price = item.product.salePrice || item.product.price;
        subtotal += price * item.quantity;
      }
    });

    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `This coupon requires a minimum purchase value of ₹${coupon.minOrderValue.toLocaleString()}`
      });
    }

    cart.appliedCoupon = {
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      maxDiscountAmount: coupon.maxDiscountAmount
    };

    await cart.save();
    const calculations = calculateCartTotals(cart);

    res.json({
      success: true,
      message: `Coupon "${coupon.code}" applied! You saved ${coupon.discountPercent}%`,
      data: {
        _id: cart._id,
        items: cart.items,
        appliedCoupon: cart.appliedCoupon,
        ...calculations
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Remove coupon
// @route  DELETE /api/cart/remove-coupon
// @access Private
export const removeCoupon = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.appliedCoupon = { code: null, discountPercent: 0, discountAmount: 0 };
    await cart.save();

    const calculations = calculateCartTotals(cart);

    res.json({
      success: true,
      message: 'Coupon removed',
      data: {
        _id: cart._id,
        items: cart.items,
        appliedCoupon: cart.appliedCoupon,
        ...calculations
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Clear entire cart
// @route  DELETE /api/cart/clear
// @access Private
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.appliedCoupon = { code: null, discountPercent: 0, discountAmount: 0 };
      await cart.save();
    }
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
