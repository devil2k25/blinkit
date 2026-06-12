const express = require('express');
const router = express.Router();
const {
  getVendorDashboard,
  getVendorProfile,
  updateVendorProfile,
  getVendorProducts,
  getVendorEarnings,
} = require('../controllers/vendorController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('vendor', 'admin'));

router.get('/dashboard', getVendorDashboard);
router.get('/profile', getVendorProfile);
router.put('/profile', updateVendorProfile);
router.get('/products', getVendorProducts);
router.get('/earnings', getVendorEarnings);

module.exports = router;
