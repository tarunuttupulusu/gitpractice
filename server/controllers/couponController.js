import Coupon from '../models/Coupon.js';

// @desc   Validate coupon code
// @route  POST /api/coupons/validate
// @access Private
export const validateCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide a coupon code' });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase().trim(),
      isActive: true,
      validUntil: { $gt: new Date() }
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired promo code' });
    }

    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Coupon requires minimum order value of ₹${coupon.minOrderValue.toLocaleString()}`
      });
    }

    let discount = Math.round((subtotal * coupon.discountPercent) / 100);
    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }

    res.json({
      success: true,
      message: `Coupon "${coupon.code}" applied! You save ₹${discount.toLocaleString()}`,
      data: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        discountAmount: discount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
