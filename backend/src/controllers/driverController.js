const Order = require('../models/Order');
const DriverProfile = require('../models/DriverProfile');

// @desc    Get driver dashboard stats
// @route   GET /api/drivers/dashboard
// @access  Private (driver)
const getDriverDashboard = async (req, res) => {
  try {
    const driverId = req.user._id;

    const [
      totalDeliveries,
      activeDeliveries,
      completedToday,
      profile,
      recentDeliveries,
      earningsData,
    ] = await Promise.all([
      Order.countDocuments({ driver: driverId }),
      Order.countDocuments({ driver: driverId, status: { $in: ['picked_up', 'out_for_delivery'] } }),
      (async () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return Order.countDocuments({ driver: driverId, status: 'delivered', deliveredAt: { $gte: today } });
      })(),
      DriverProfile.findOne({ user: driverId }),
      Order.find({ driver: driverId })
        .populate('user', 'name phone')
        .populate('vendor', 'name')
        .sort({ createdAt: -1 })
        .limit(5),
      Order.aggregate([
        { $match: { driver: driverId, paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$deliveryFee' } } },
      ]),
    ]);

    // Earnings for last 7 days
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
            driver: driverId,
            status: 'delivered',
            deliveredAt: { $gte: date, $lt: nextDate },
          },
        },
        { $group: { _id: null, earnings: { $sum: '$deliveryFee' }, deliveries: { $sum: 1 } } },
      ]);

      earningsChart.push({
        date: date.toISOString().split('T')[0],
        earnings: dayData.length > 0 ? dayData[0].earnings : 0,
        deliveries: dayData.length > 0 ? dayData[0].deliveries : 0,
      });
    }

    const totalEarnings = earningsData.length > 0 ? earningsData[0].total : 0;

    res.json({
      success: true,
      stats: {
        totalDeliveries,
        activeDeliveries,
        completedToday,
        totalEarnings,
        isAvailable: profile ? profile.isAvailable : false,
        isApproved: profile ? profile.isApproved : false,
        rating: profile ? profile.rating : 0,
        recentDeliveries,
        earningsChart,
      },
    });
  } catch (error) {
    console.error('GetDriverDashboard error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get driver profile
// @route   GET /api/drivers/profile
// @access  Private (driver)
const getDriverProfile = async (req, res) => {
  try {
    const profile = await DriverProfile.findOne({ user: req.user._id }).populate('user', 'name email phone');

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Driver profile not found' });
    }

    res.json({ success: true, profile });
  } catch (error) {
    console.error('GetDriverProfile error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update driver profile
// @route   PUT /api/drivers/profile
// @access  Private (driver)
const updateDriverProfile = async (req, res) => {
  try {
    const { vehicleType, vehicleNumber, licenseNumber, currentLocation } = req.body;

    const updateData = {};
    if (vehicleType) updateData.vehicleType = vehicleType;
    if (vehicleNumber) updateData.vehicleNumber = vehicleNumber;
    if (licenseNumber) updateData.licenseNumber = licenseNumber;
    if (currentLocation) updateData.currentLocation = currentLocation;

    const profile = await DriverProfile.findOneAndUpdate(
      { user: req.user._id },
      updateData,
      { new: true, upsert: true }
    ).populate('user', 'name email phone');

    res.json({ success: true, message: 'Driver profile updated', profile });
  } catch (error) {
    console.error('UpdateDriverProfile error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Toggle driver availability
// @route   PUT /api/drivers/availability
// @access  Private (driver)
const toggleAvailability = async (req, res) => {
  try {
    const profile = await DriverProfile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Driver profile not found' });
    }

    if (!profile.isApproved) {
      return res.status(400).json({ success: false, message: 'Your profile is pending approval' });
    }

    profile.isAvailable = !profile.isAvailable;
    await profile.save();

    res.json({
      success: true,
      message: `You are now ${profile.isAvailable ? 'available' : 'unavailable'} for deliveries`,
      isAvailable: profile.isAvailable,
    });
  } catch (error) {
    console.error('ToggleAvailability error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get available orders for driver to accept
// @route   GET /api/drivers/available-orders
// @access  Private (driver)
const getAvailableOrders = async (req, res) => {
  try {
    const profile = await DriverProfile.findOne({ user: req.user._id });

    if (!profile || !profile.isApproved || !profile.isAvailable) {
      return res.status(400).json({ success: false, message: 'You must be approved and available to see orders' });
    }

    const orders = await Order.find({
      status: 'confirmed',
      driver: null,
    })
      .populate('user', 'name phone')
      .populate('vendor', 'name')
      .sort({ createdAt: 1 });

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error('GetAvailableOrders error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Accept an order
// @route   PUT /api/drivers/orders/:id/accept
// @access  Private (driver)
const acceptOrder = async (req, res) => {
  try {
    const profile = await DriverProfile.findOne({ user: req.user._id });
    if (!profile || !profile.isApproved || !profile.isAvailable) {
      return res.status(400).json({ success: false, message: 'You must be approved and available to accept orders' });
    }

    const order = await Order.findOne({ _id: req.params.id, status: 'confirmed', driver: null });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not available for acceptance' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { driver: req.user._id, status: 'preparing' },
      { new: true }
    )
      .populate('user', 'name email phone')
      .populate('vendor', 'name email');

    res.json({ success: true, message: 'Order accepted successfully', order: updatedOrder });
  } catch (error) {
    console.error('AcceptOrder error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update delivery status
// @route   PUT /api/drivers/orders/:id/status
// @access  Private (driver)
const updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const driverStatuses = ['picked_up', 'out_for_delivery', 'delivered'];

    if (!driverStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Driver can only set status to: ${driverStatuses.join(', ')}` });
    }

    const order = await Order.findOne({ _id: req.params.id, driver: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found or not assigned to you' });
    }

    const updateData = { status };
    if (status === 'delivered') {
      updateData.deliveredAt = new Date();
      if (order.paymentMethod === 'cod') {
        updateData.paymentStatus = 'paid';
      }
      // Update driver stats
      await DriverProfile.findOneAndUpdate(
        { user: req.user._id },
        { $inc: { totalDeliveries: 1, earnings: order.deliveryFee || 20 } }
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('user', 'name email phone')
      .populate('vendor', 'name email');

    res.json({ success: true, message: `Delivery status updated to ${status}`, order: updatedOrder });
  } catch (error) {
    console.error('UpdateDeliveryStatus error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getDriverDashboard,
  getDriverProfile,
  updateDriverProfile,
  toggleAvailability,
  getAvailableOrders,
  acceptOrder,
  updateDeliveryStatus,
};
