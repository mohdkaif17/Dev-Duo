const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');

// Public route - leaderboard
router.get('/leaderboard', userController.getLeaderboard);

// Protected route - get current user
router.get('/me', authMiddleware, userController.getMe);

module.exports = router;
