import Category from '../models/Category.js';

// @desc   Get all categories tree
// @route  GET /api/categories
// @access Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ displayOrder: 1, name: 1 });

    const men = categories.filter(c => c.gender === 'men');
    const women = categories.filter(c => c.gender === 'women');
    const unisex = categories.filter(c => c.gender === 'unisex');

    res.json({
      success: true,
      data: {
        all: categories,
        men,
        women,
        unisex
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get single category by slug
// @route  GET /api/categories/:slug
// @access Public
export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug.toLowerCase() });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
