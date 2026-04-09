const express = require('express');
const router = express.Router();

// Import route modules
const eventRoutes = require('./eventRoutes');
const challengeRoutes = require('./challengeRoutes');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');

// Use route modules
router.use('/events', eventRoutes);
router.use('/challenges', challengeRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

// Health check route
router.get('/', (req, res) => {
  res.json({ message: 'Club Hub API is running', version: '1.0.0' });
});

module.exports = router;
