import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc   Create new order (Checkout)
// @route  POST /api/orders
// @access Private
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items provided' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.addressLine1 || !shippingAddress.postalCode) {
      return res.status(400).json({ success: false, message: 'Complete shipping address is required' });
    }

    // Verify stock and calculate subtotal
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.name} not found` });
      }

      const itemPrice = product.salePrice && product.salePrice < product.price
        ? product.salePrice
        : product.price;

      const itemTotal = itemPrice * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || '',
        price: itemPrice,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        subtotal: itemTotal
      });

      // Update product inventory stock
      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        if (product.sizes && product.sizes.length > 0) {
          const s = product.sizes.find(sz => sz.size === item.size);
          if (s && s.stock >= item.quantity) {
            s.stock -= item.quantity;
          }
        }
        await product.save();
      }
    }

    // Discount calculations
    let discount = 0;
    if (couponCode) {
      // Basic 10-20% discount depending on code
      if (couponCode.toUpperCase() === 'VALENTI10') {
        discount = Math.round(subtotal * 0.10);
      } else if (couponCode.toUpperCase() === 'LUXE20') {
        discount = Math.round(subtotal * 0.20);
      } else if (couponCode.toUpperCase() === 'WELCOME500') {
        discount = 500;
      }
    }

    const deliveryCharge = subtotal >= 1999 ? 0 : 150;
    const tax = Math.round((subtotal - discount) * 0.05);
    const total = Math.max(0, subtotal - discount + deliveryCharge + tax);

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `VAL-2026-${randomSuffix}`;
    const trackingNumber = `TRK-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const estimatedDeliveryDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

    const order = new Order({
      user: req.user._id,
      orderNumber,
      items: validatedItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Card',
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      orderStatus: 'Confirmed',
      pricing: {
        subtotal,
        discount,
        couponCode: couponCode || null,
        deliveryCharge,
        tax,
        total
      },
      trackingNumber,
      estimatedDeliveryDate,
      timeline: [
        {
          status: 'Confirmed',
          title: 'Order Confirmed',
          description: 'Your order has been verified and sent to our atelier for curation.',
          timestamp: new Date()
        }
      ]
    });

    const createdOrder = await order.save();

    // Clear user's cart
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [], appliedCoupon: { code: null, discountPercent: 0, discountAmount: 0 } } }
    );

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: createdOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get logged in user orders
// @route  GET /api/orders/my-orders
// @access Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get order details by ID
// @route  GET /api/orders/:id
// @access Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Ensure the order belongs to user or user is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized access to this order' });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Track order by Tracking Number or Order Number
// @route  GET /api/orders/track/:query
// @access Public
export const trackOrderByQuery = async (req, res) => {
  try {
    const query = req.params.query.trim();
    const order = await Order.findOne({
      $or: [
        { trackingNumber: { $regex: new RegExp(`^${query}$`, 'i') } },
        { orderNumber: { $regex: new RegExp(`^${query}$`, 'i') } }
      ]
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'No shipment found with this tracking/order number' });
    }

    res.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        trackingNumber: order.trackingNumber,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        estimatedDeliveryDate: order.estimatedDeliveryDate,
        shippingAddress: {
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          postalCode: order.shippingAddress.postalCode
        },
        itemsCount: order.items.length,
        items: order.items.map(i => ({ name: i.name, image: i.image, size: i.size, color: i.color })),
        timeline: order.timeline
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Cancel order
// @route  PUT /api/orders/:id/cancel
// @access Private
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered' || order.orderStatus === 'Out for Delivery') {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled in "${order.orderStatus}" state. Please request a return upon delivery.`
      });
    }

    order.orderStatus = 'Cancelled';
    order.timeline.push({
      status: 'Cancelled',
      title: 'Order Cancelled',
      description: 'The order was cancelled by the customer.',
      timestamp: new Date()
    });

    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
