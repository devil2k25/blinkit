const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  getVendorOrders,
  getDriverOrders,
  getAllOrders,
  assignDriver,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('user'), createOrder);
router.get('/my-orders', protect, authorize('user'), getMyOrders);
router.get('/vendor', protect, authorize('vendor'), getVendorOrders);
router.get('/driver', protect, authorize('driver'), getDriverOrders);
router.get('/all', protect, authorize('admin'), getAllOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, authorize('vendor', 'driver', 'admin'), updateOrderStatus);
router.put('/:id/assign-driver', protect, authorize('admin', 'vendor'), assignDriver);

module.exports = router;
