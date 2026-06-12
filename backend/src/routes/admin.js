const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  getVendors,
  getDrivers,
  approveVendor,
  approveDriver,
  toggleUserStatus,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.get('/vendors', getVendors);
router.get('/drivers', getDrivers);
router.put('/vendors/:id/approve', approveVendor);
router.put('/drivers/:id/approve', approveDriver);
router.put('/users/:id/toggle-status', toggleUserStatus);

module.exports = router;
