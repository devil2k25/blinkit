const Order = require('../models/Order');
const Product = require('../models/Product');
const VendorProfile = require('../models/VendorProfile');

// @desc    Get vendor dashboard stats
// @route   GET /api/vendors/dashboard
// @access  Private (vendor)
const getVendorDashboard = async (req, res) => {
  try {
    const vendorId = req.user._id;

    const [
      totalOrders,
      pendingOrders,
      activeOrders,
      completedOrders,
      cancelledOrders,
      revenueData,
      totalProducts,
      activeProducts,
      recentOrders,
      profile,
    ] = await Promise.all([
      Order.countDocuments({ vendor: vendorId }),
      Order.countDocuments({ vendor: vendorId, status: 'pending' }),
      Order.countDocuments({ vendor: vendorId, status: { $in: ['confirmed', 'preparing', 'picked_up', 'out_for_delivery'] } }),
      Order.countDocuments({ vendor: vendorId, status: 'delivered' }),
      Order.countDocuments({ vendor: vendorId, status: 'cancelled' }),
      Order.aggregate([
        { $match: { vendor: vendorId, paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Product.countDocuments({ vendor: vendorId }),
      Product.countDocuments({ vendor: vendorId, isActive: true }),
      Order.find({ vendor: vendorId })
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 })
        .limit(5),
      VendorProfile.findOne({ user: vendorId }),
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // Earnings by day for last 7 days
    const earningsChart = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayData = await Order.aggregate([
        {
          $match: {
            vendor: vendorId,
            createdAt: { $gte: date, $lt: nextDate },
            paymentStatus: 'paid',
          },
        },
        { $group: { _id: null, revenue: { $sum: '$total' }, count: { $sum: 1 } } },
      ]);

      earningsChart.push({
        date: date.toISOString().split('T')[0],
        revenue: dayData.length > 0 ? dayData[0].revenue : 0,
        orders: dayData.length > 0 ? dayData[0].count : 0,
      });
    }

    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        activeOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue,
        totalProducts,
        activeProducts,
        recentOrders,
        earningsChart,
        isApproved: profile ? profile.isApproved : false,
        isOpen: profile ? profile.isOpen : false,
        rating: profile ? profile.rating : 0,
      },
    });
  } catch (error) {
    console.error('GetVendorDashboard error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get vendor profile
// @route   GET /api/vendors/profile
// @access  Private (vendor)
const getVendorProfile = async (req, res) => {
  try {
    const profile = await VendorProfile.findOne({ user: req.user._id })
      .populate('user', 'name email phone')
      .populate('categories', 'name image');

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }

    res.json({ success: true, profile });
  } catch (error) {
    console.error('GetVendorProfile error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update vendor profile
// @route   PUT /api/vendors/profile
// @access  Private (vendor)
const updateVendorProfile = async (req, res) => {
  try {
    const { storeName, storeImage, description, address, categories, isOpen, openTime, closeTime } = req.body;

    const updateData = {};
    if (storeName !== undefined) updateData.storeName = storeName;
    if (storeImage !== undefined) updateData.storeImage = storeImage;
    if (description !== undefined) updateData.description = description;
    if (address !== undefined) updateData.address = address;
    if (categories !== undefined) updateData.categories = categories;
    if (isOpen !== undefined) updateData.isOpen = isOpen;
    if (openTime !== undefined) updateData.openTime = openTime;
    if (closeTime !== undefined) updateData.closeTime = closeTime;

    const profile = await VendorProfile.findOneAndUpdate(
      { user: req.user._id },
      updateData,
      { new: true, upsert: true }
    )
      .populate('user', 'name email phone')
      .populate('categories', 'name image');

    res.json({ success: true, message: 'Vendor profile updated', profile });
  } catch (error) {
    console.error('UpdateVendorProfile error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get vendor's products
// @route   GET /api/vendors/products
// @access  Private (vendor)
const getVendorProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, isActive } = req.query;
    const query = { vendor: req.user._id };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name image')
        .sort({ createdAt: -1 })
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
    console.error('GetVendorProducts error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get vendor earnings data
// @route   GET /api/vendors/earnings
// @access  Private (vendor)
const getVendorEarnings = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const { period = '7d' } = req.query;

    let days = 7;
    if (period === '30d') days = 30;
    else if (period === '90d') days = 90;

    const earningsData = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayData = await Order.aggregate([
        {
          $match: {
            vendor: vendorId,
            createdAt: { $gte: date, $lt: nextDate },
            paymentStatus: 'paid',
          },
        },
        {
          $group: {
            _id: null,
            revenue: { $sum: '$total' },
            orders: { $sum: 1 },
          },
        },
      ]);

      earningsData.push({
        date: date.toISOString().split('T')[0],
        revenue: dayData.length > 0 ? dayData[0].revenue : 0,
        orders: dayData.length > 0 ? dayData[0].orders : 0,
      });
    }

    // Total earnings
    const totalEarnings = await Order.aggregate([
      { $match: { vendor: vendorId, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } },
    ]);

    // This month earnings
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthEarnings = await Order.aggregate([
      { $match: { vendor: vendorId, paymentStatus: 'paid', createdAt: { $gte: monthStart } } },
      { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      earnings: {
        chart: earningsData,
        total: totalEarnings.length > 0 ? totalEarnings[0].total : 0,
        totalOrders: totalEarnings.length > 0 ? totalEarnings[0].count : 0,
        thisMonth: monthEarnings.length > 0 ? monthEarnings[0].total : 0,
        thisMonthOrders: monthEarnings.length > 0 ? monthEarnings[0].count : 0,
      },
    });
  } catch (error) {
    console.error('GetVendorEarnings error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getVendorDashboard,
  getVendorProfile,
  updateVendorProfile,
  getVendorProducts,
  getVendorEarnings,
};
