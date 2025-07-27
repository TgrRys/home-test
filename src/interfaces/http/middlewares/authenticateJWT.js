/**
 * JWT Authentication Middleware
 * 
 * This middleware validates JWT tokens from the Authorization header.
 */
const jwt = require('jsonwebtoken');
const PostgresUserRepository = require('../../../infrastructure/repositories/PostgresUserRepository');
const { Database } = require('../../../infrastructure/database/connection');
require('dotenv').config();

/**
 * Middleware to authenticate JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 108,
            message: 'Token tidak valid atau kadaluwarsa',
            data: null
        });
    }

    const token = authHeader.split(' ')[1];
    const JWT_SECRET = process.env.JWT_SECRET || 'nutech-integrasi-secret-key';

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).json({
                status: 108,
                message: 'Token tidak valid atau kadaluwarsa',
                data: null
            });
        }

        try {
            const userRepository = new PostgresUserRepository(Database);
            const userData = await userRepository.findByEmail(decoded.data);

            if (!userData) {
                return res.status(401).json({
                    status: 108,
                    message: 'Token tidak valid atau kadaluwarsa',
                    data: null
                });
            }

            req.user = {
                id: userData.id,
                email: userData.email,
                first_name: userData.first_name,
                last_name: userData.last_name
            };
            next();
        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(500).json({
                status: 999,
                message: 'Internal server error',
                data: null
            });
        }
    });
};

module.exports = authenticateJWT;
