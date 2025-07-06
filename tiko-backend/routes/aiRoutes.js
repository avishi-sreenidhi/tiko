const express = require('express');
const { generateReply } = require('../controllers/aiController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Generate AI reply (admin only)
router.post('/generate-reply', protect, admin, generateReply);

module.exports = router;