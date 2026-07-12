const express = require('express');
const router = express.Router();
const rangeController = require('../controllers/rangeController');

// GET all vehicles with range data
router.get('/vehicles', rangeController.getAllVehiclesWithRange);

// GET range statistics
router.get('/statistics', rangeController.getRangeStatistics);

// GET top range vehicles
router.get('/top', rangeController.getTopRangeVehicles);

// POST - Range suitability checker
router.post('/check', rangeController.checkRangeSuitability);

module.exports = router;