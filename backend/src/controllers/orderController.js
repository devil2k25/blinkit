const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (user)
const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, notes, vendor } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    if (!deliveryAddress) {
      return res.status(400).json({ success: false, message: 'Delivery address is required' });
    }

    // Validate products and compute prices
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
      }
      if (!product.isActive || product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `${product.name} is not available in requested quantity` });
      }

      const itemPrice = product.discountPrice || product.price;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: itemPrice,
        quantity: item.quantity,
        image: product.images[0] || '',
      });

      subtotal += itemPrice * item.quantity;

      // Reduce stock
      await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.quantity } });
    }

    const deliveryFee = subtotal >= 199 ? 0 : 20;
    const total = subtotal + deliveryFee;
    const estimatedDelivery = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const order = await Order.create({
      user: req.user._id,
      vendor: vendor || null,
      items: orderItems,
      deliveryAddress,
      paymentMethod: paymentMethod || 'cod',
      subtotal,
      deliveryFee,
      total,
      estimatedDelivery,
      notes,
    });

    // Clear cart after successful order
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    const populated = await Order.findById(order._id)
      .populate('user', 'name email phone')
      .populate('vendor', 'name email')
      .populate('items.product', 'name images');

    res.status(201).json({ success: true, message: 'Order placed successfully', order: populated });
  } catch (error) {
    console.error('CreateOrder error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get logged-in user orders
// @route   GET /api/orders/my-orders
// @access  Private (user)
const getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { user: req.user._id };
    if (status) query.status = status;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('vendor', 'name email')
        .populate('driver', 'name phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: orders.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      orders,
    });
  } catch (error) {
    console.error('GetMyOrders error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('vendor', 'name email')
      .populate('driver', 'name email phone')
      .populate('items.product', 'name images unit');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Access control: user can only view own order, vendor sees vendor orders, etc.
    const userId = req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isOwner = order.user._id.toString() === userId;
    const isVendor = order.vendor && order.vendor._id.toString() === userId;
    const isDriver = order.driver && order.driver._id.toString() === userId;

    if (!isAdmin && !isOwner && !isVendor && !isDriver) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('GetOrder error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (vendor, driver, admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'picked_up', 'out_for_delivery', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const updateData = { status };
    if (status === 'delivered') {
      updateData.deliveredAt = new Date();
      updateData.paymentStatus = order.paymentMethod === 'cod' ? 'paid' : order.paymentStatus;
    }

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('user', 'name email phone')
      .populate('vendor', 'name email')
      .populate('driver', 'name email phone');

    res.json({ success: true, message: `Order status updated to ${status}`, order: updatedOrder });
  } catch (error) {
    console.error('UpdateOrderStatus error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get vendor orders
// @route   GET /api/orders/vendor
// @access  Private (vendor)
const getVendorOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { vendor: req.user._id };
    if (status) query.status = status;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email phone')
        .populate('driver', 'name phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: orders.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      orders,
    });
  } catch (error) {
    console.error('GetVendorOrders error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get driver orders
// @route   GET /api/orders/driver
// @access  Private (driver)
const getDriverOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { driver: req.user._id };
    if (status) query.status = status;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email phone')
        .populate('vendor', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: orders.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      orders,
    });
  } catch (error) {
    console.error('GetDriverOrders error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders/all
// @access  Private (admin)
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, vendor, driver } = req.query;
    const query = {};
    if (status) query.status = status;
    if (vendor) query.vendor = vendor;
    if (driver) query.driver = driver;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email phone')
        .populate('vendor', 'name email')
        .populate('driver', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: orders.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      orders,
    });
  } catch (error) {
    console.error('GetAllOrders error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Assign driver to order
// @route   PUT /api/orders/:id/assign-driver
// @access  Private (admin, vendor)
const assignDriver = async (req, res) => {
  try {
    const { driverId } = req.body;

    if (!driverId) {
      return res.status(400).json({ success: false, message: 'Driver ID is required' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { driver: driverId, status: 'confirmed' },
      { new: true }
    )
      .populate('user', 'name email phone')
      .populate('vendor', 'name email')
      .populate('driver', 'name email phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: 'Driver assigned successfully', order });
  } catch (error) {
    console.error('AssignDriver error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  getVendorOrders,
  getDriverOrders,
  getAllOrders,
  assignDriver,
};
