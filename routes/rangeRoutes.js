const express = require('express');
const router = express.Router();
const rangeController = require('../controllers/rangeController');

// Public routes (no authentication required)
router.get('/range/all', rangeController.getAllRanges);
router.get('/range/statistics', rangeController.getRangeStatistics);
router.get('/range/top', rangeController.getTopRangeVehicles);
router.get('/range/search', rangeController.searchRange);
router.get('/range/vehicle/:id', rangeController.getRangeByVehicleId);
router.get('/range/above', rangeController.getVehiclesWithRangeAbove);
router.get('/range/fast-charging', rangeController.getVehiclesWithFastCharging);

// Update route (protected - add auth middleware later)
router.put('/range/update/:id', rangeController.updateRange);

module.exports = router;