const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');
const { authMiddleware } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminOnly');

// Public routes
router.get('/', challengeController.getChallenges);

// Protected routes
router.post('/', authMiddleware, adminOnly, challengeController.createChallenge);
router.post('/:id/submit', authMiddleware, challengeController.submitChallenge);

module.exports = router;
