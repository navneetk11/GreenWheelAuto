// cartRoutes.js
const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middleware/authMiddleware');

// All cart routes require the user to be logged in
router.use(verifyToken);

// Cart
router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);              // UC11
router.put('/:itemId', cartController.updateCartItem);   // UC12
router.delete('/:itemId', cartController.removeCartItem);// UC12

// Checkout & Payment
router.post('/checkout', cartController.checkout);       // UC13
router.post('/payment', cartController.processPayment);  // UC13

// Order details
router.get('/orders/:orderId', cartController.getOrder);

module.exports = router;