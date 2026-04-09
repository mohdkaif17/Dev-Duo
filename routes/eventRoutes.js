const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authMiddleware } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminOnly');

// Public routes
router.get('/', eventController.getEvents);

// Protected routes
router.post('/', authMiddleware, adminOnly, eventController.createEvent);
router.post('/:id/register', authMiddleware, eventController.registerForEvent);

module.exports = router;
