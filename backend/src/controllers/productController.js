const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search, vendor, page = 1, limit = 20, minPrice, maxPrice, sort } = req.query;

    const query = { isActive: true };

    if (category) query.category = category;
    if (vendor) query.vendor = vendor;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'popular') sortOption = { numReviews: -1 };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name image')
        .populate('vendor', 'name email')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      products,
    });
  } catch (error) {
    console.error('GetProducts error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get featured/popular products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, stock: { $gt: 0 } })
      .populate('category', 'name image')
      .sort({ rating: -1, numReviews: -1 })
      .limit(12);

    res.json({ success: true, count: products.length, products });
  } catch (error) {
    console.error('GetFeaturedProducts error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name image')
      .populate('vendor', 'name email');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error('GetProduct error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private (vendor, admin)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, discountPrice, category, images, unit, stock, tags, deliveryTime } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Name and price are required' });
    }

    const vendorId = req.user.role === 'admin' ? req.body.vendor : req.user._id;

    const product = await Product.create({
      name,
      description,
      price,
      discountPrice,
      category,
      vendor: vendorId,
      images: images || [],
      unit,
      stock: stock || 0,
      tags: tags || [],
      deliveryTime,
    });

    const populated = await product.populate('category', 'name image');

    res.status(201).json({ success: true, message: 'Product created', product: populated });
  } catch (error) {
    console.error('CreateProduct error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (vendor owner, admin)
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Vendor can only update own products
    if (req.user.role === 'vendor' && product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this product' });
    }

    const allowedFields = ['name', 'description', 'price', 'discountPrice', 'category', 'images', 'unit', 'stock', 'tags', 'isActive', 'deliveryTime'];
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate('category', 'name image');

    res.json({ success: true, message: 'Product updated', product });
  } catch (error) {
    console.error('UpdateProduct error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (vendor owner, admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (req.user.role === 'vendor' && product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('DeleteProduct error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getFeaturedProducts };
