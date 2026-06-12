const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });
    res.json({ success: true, count: categories.length, categories });
  } catch (error) {
    console.error('GetCategories error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, category });
  } catch (error) {
    console.error('GetCategory error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private (admin)
const createCategory = async (req, res) => {
  try {
    const { name, image, description, order } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const category = await Category.create({ name, image, description, order });
    res.status(201).json({ success: true, message: 'Category created', category });
  } catch (error) {
    console.error('CreateCategory error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (admin)
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, message: 'Category updated', category });
  } catch (error) {
    console.error('UpdateCategory error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (admin)
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await category.deleteOne();
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('DeleteCategory error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
