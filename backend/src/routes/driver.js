const express = require('express');
const router = express.Router();
const {
  getDriverDashboard,
  getDriverProfile,
  updateDriverProfile,
  toggleAvailability,
  getAvailableOrders,
  acceptOrder,
  updateDeliveryStatus,
} = require('../controllers/driverController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('driver', 'admin'));

router.get('/dashboard', getDriverDashboard);
router.get('/profile', getDriverProfile);
router.put('/profile', updateDriverProfile);
router.put('/availability', toggleAvailability);
router.get('/available-orders', getAvailableOrders);
router.put('/orders/:id/accept', acceptOrder);
router.put('/orders/:id/status', updateDeliveryStatus);

module.exports = router;
