import Product from '../models/Product.js';

// @desc   Get all products with filtering, sorting & search
// @route  GET /api/products
// @access Public
export const getProducts = async (req, res) => {
  try {
    const {
      gender,
      category,
      subcategory,
      minPrice,
      maxPrice,
      size,
      color,
      inStock,
      featured,
      newArrival,
      bestSeller,
      onSale,
      search,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // Gender filter
    if (gender && gender !== 'all') {
      query.gender = gender.toLowerCase();
    }

    // Category filter
    if (category && category !== 'all') {
      const escapedCat = category.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.category = { $regex: new RegExp(`^${escapedCat}$`, 'i') };
    }

    // Subcategory filter
    if (subcategory) {
      const escapedSub = subcategory.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.subcategory = { $regex: new RegExp(`^${escapedSub}$`, 'i') };
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Size filter
    if (size) {
      const sizeArr = Array.isArray(size) ? size : size.split(',');
      query['sizes.size'] = { $in: sizeArr };
    }

    // Color filter with synonym/token matching
    if (color) {
      const colorArr = Array.isArray(color) ? color : color.split(',');
      const colorTokens = colorArr.flatMap(c => {
        const tokens = c.split(/[\/\s,]+/).filter(Boolean);
        return tokens.map(t => {
          if (/white/i.test(t)) return 'white|ivory';
          if (/black/i.test(t)) return 'black|noir|onyx';
          if (/navy/i.test(t)) return 'navy|blue|azure';
          if (/gold|champagne/i.test(t)) return 'gold|champagne|baroque';
          if (/emerald/i.test(t)) return 'emerald|green|sage|olive';
          if (/camel|brown/i.test(t)) return 'camel|brown|bronze|sand|tan';
          return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        });
      });
      query['colors.name'] = { $in: colorTokens.map(t => new RegExp(t, 'i')) };
    }

    // In Stock filter
    if (inStock === 'true') {
      query['sizes.stock'] = { $gt: 0 };
    }

    // Badges / Flags
    if (featured === 'true') query.isFeatured = true;
    if (newArrival === 'true') query.isNewArrival = true;
    if (bestSeller === 'true') query.isBestSeller = true;
    if (onSale === 'true') query.salePrice = { $ne: null, $gt: 0 };

    // Search query across name, description, category, subcategory, material
    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { subcategory: searchRegex },
        { material: searchRegex },
        { brand: searchRegex }
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1, reviewCount: -1 };
    else if (sort === 'popular') sortOption = { isBestSeller: -1, reviewCount: -1 };
    else if (sort === 'discount') sortOption = { isOnSale: -1, price: 1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    // Compute aggregations/facets for filter sidebars
    const totalMatching = await Product.find(query);
    const availableCategories = [...new Set(totalMatching.map(p => p.category))];
    const availableSizes = [...new Set(totalMatching.flatMap(p => p.sizes ? p.sizes.map(s => s.size) : []))];
    const availableColors = [...new Set(totalMatching.flatMap(p => p.colors ? p.colors.map(c => c.name) : []))];

    res.json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      facets: {
        categories: availableCategories,
        sizes: availableSizes,
        colors: availableColors
      },
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get single product by ID or Slug
// @route  GET /api/products/:idOrSlug
// @access Public
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ slug: id.toLowerCase() });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get related products
// @route  GET /api/products/:id/related
// @access Public
export const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const currentProduct = await Product.findById(id);
    if (!currentProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const related = await Product.find({
      _id: { $ne: currentProduct._id },
      $or: [
        { category: currentProduct.category },
        { gender: currentProduct.gender }
      ]
    }).limit(4);

    res.json({
      success: true,
      data: related
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get featured collections for homepage
// @route  GET /api/products/curated/collections
// @access Public
export const getCuratedCollections = async (req, res) => {
  try {
    const featured = await Product.find({ isFeatured: true }).limit(8);
    const newArrivals = await Product.find({ isNewArrival: true }).limit(8);
    const bestSellers = await Product.find({ isBestSeller: true }).limit(8);
    const saleItems = await Product.find({ isOnSale: true }).limit(8);

    res.json({
      success: true,
      data: {
        featured,
        newArrivals,
        bestSellers,
        saleItems
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
