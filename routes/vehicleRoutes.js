const express = require('express');
const router = express.Router();
const {
    getAllVehicles,
    getVehicleById,
    filterVehicles,
    sortVehicles,
    getHotDeals
} = require('../controllers/vehicleController');

// UC03 — Browse all vehicles
router.get('/', getAllVehicles);

// UC05 — Filter vehicles
router.get('/filter', filterVehicles);

// UC04 — Sort vehicles
router.get('/sort', sortVehicles);
router.get('/hot-deals', getHotDeals);

// UC06 — Vehicle detail (must be last!)
router.get('/:id', getVehicleById);

module.exports = router;