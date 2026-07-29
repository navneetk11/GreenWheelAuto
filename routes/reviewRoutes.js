const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all reviews for a vehicle
router.get('/:vid', reviewController.getReviews);

// Add a review (logged-in users only)
router.post('/', authMiddleware, reviewController.addReview);

module.exports = router;