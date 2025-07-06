const express = require('express');
const router = express.Router();
const { register, login, getUserCount } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

// Registration route
router.post('/register', register);
router.post('/login', login);

// Get user count (admin only)
router.get('/users/count', protect, admin, getUserCount);

module.exports = router;