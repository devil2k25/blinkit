const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const VendorProfile = require('../models/VendorProfile');
const DriverProfile = require('../models/DriverProfile');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (admin)
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalVendors,
      totalDrivers,
      totalOrders,
      revenueData,
      recentOrders,
      topProducts,
      ordersByStatus,
    ] = await Promise.all([
      User.countDocuments({ role: 'user', isActive: true }),
      User.countDocuments({ role: 'vendor', isActive: true }),
      User.countDocuments({ role: 'driver', isActive: true }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.find()
        .populate('user', 'name email')
        .populate('vendor', 'name')
        .sort({ createdAt: -1 })
        .limit(5),
      Product.find({ isActive: true })
        .sort({ numReviews: -1, rating: -1 })
        .limit(5)
        .populate('category', 'name'),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // Daily revenue for the last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayRevenue = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: date, $lt: nextDate },
            paymentStatus: 'paid',
          },
        },
        { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } },
      ]);

      last7Days.push({
        date: date.toISOString().split('T')[0],
        revenue: dayRevenue.length > 0 ? dayRevenue[0].total : 0,
        orders: dayRevenue.length > 0 ? dayRevenue[0].count : 0,
      });
    }

    const statusMap = {};
    ordersByStatus.forEach((s) => { statusMap[s._id] = s.count; });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalVendors,
        totalDrivers,
        totalOrders,
        totalRevenue,
        ordersByStatus: statusMap,
        recentOrders,
        topProducts,
        revenueChart: last7Days,
      },
    });
  } catch (error) {
    console.error('GetDashboardStats error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all users with pagination
// @route   GET /api/admin/users
// @access  Private (admin)
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, isActive } = req.query;
    const query = { role: 'user' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: users.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      users,
    });
  } catch (error) {
    console.error('GetUsers error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all vendors
// @route   GET /api/admin/vendors
// @access  Private (admin)
const getVendors = async (req, res) => {
  try {
    const { page = 1, limit = 20, isApproved } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const profileQuery = {};
    if (isApproved !== undefined) profileQuery.isApproved = isApproved === 'true';

    const [vendors, total] = await Promise.all([
      VendorProfile.find(profileQuery)
        .populate('user', 'name email phone isActive createdAt')
        .populate('categories', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      VendorProfile.countDocuments(profileQuery),
    ]);

    res.json({
      success: true,
      count: vendors.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      vendors,
    });
  } catch (error) {
    console.error('GetVendors error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all drivers
// @route   GET /api/admin/drivers
// @access  Private (admin)
const getDrivers = async (req, res) => {
  try {
    const { page = 1, limit = 20, isApproved, isAvailable } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const profileQuery = {};
    if (isApproved !== undefined) profileQuery.isApproved = isApproved === 'true';
    if (isAvailable !== undefined) profileQuery.isAvailable = isAvailable === 'true';

    const [drivers, total] = await Promise.all([
      DriverProfile.find(profileQuery)
        .populate('user', 'name email phone isActive createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      DriverProfile.countDocuments(profileQuery),
    ]);

    res.json({
      success: true,
      count: drivers.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      drivers,
    });
  } catch (error) {
    console.error('GetDrivers error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Approve vendor
// @route   PUT /api/admin/vendors/:id/approve
// @access  Private (admin)
const approveVendor = async (req, res) => {
  try {
    const profile = await VendorProfile.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).populate('user', 'name email');

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }

    res.json({ success: true, message: 'Vendor approved successfully', vendor: profile });
  } catch (error) {
    console.error('ApproveVendor error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Approve driver
// @route   PUT /api/admin/drivers/:id/approve
// @access  Private (admin)
const approveDriver = async (req, res) => {
  try {
    const profile = await DriverProfile.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).populate('user', 'name email');

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Driver profile not found' });
    }

    res.json({ success: true, message: 'Driver approved successfully', driver: profile });
  } catch (error) {
    console.error('ApproveDriver error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (admin)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot deactivate admin account' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: { _id: user._id, name: user.name, email: user.email, isActive: user.isActive },
    });
  } catch (error) {
    console.error('ToggleUserStatus error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  getVendors,
  getDrivers,
  approveVendor,
  approveDriver,
  toggleUserStatus,
};
