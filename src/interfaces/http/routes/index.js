const express = require('express');
const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const bannerRoutes = require('./bannerRoutes');
const serviceRoutes = require('./serviceRoutes');
const transactionRoutes = require('./transactionRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

router.get('/health', (req, res) => {
    res.status(200).json({
        status: 0,
        message: 'API is running',
        data: {
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        }
    });
});

router.use('/', authRoutes);
router.use('/profile', profileRoutes);
router.use('/banner', bannerRoutes);
router.use('/services', serviceRoutes);
router.use('/', transactionRoutes);
router.use('/users', userRoutes);

module.exports = router;
