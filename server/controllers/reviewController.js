import Review from '../models/Review.js';
import Product from '../models/Product.js';

// @desc   Get product reviews
// @route  GET /api/reviews/product/:productId
// @access Public
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Create new review
// @route  POST /api/reviews
// @access Private
export const createReview = async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      title,
      comment,
      verifiedPurchase: true
    });

    // Recalculate product rating
    const allReviews = await Review.find({ product: productId });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    product.rating = Number(avgRating.toFixed(1));
    product.reviewCount = allReviews.length;
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been submitted.',
      data: review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
