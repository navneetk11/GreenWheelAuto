const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');

// UC01 — Register
router.post('/register', register);

// UC02 — Sign in
router.post('/login', login);

// UC02 — Sign out
router.post('/logout', logout);

module.exports = router;