/**
 * LoginUser use case
 * 
 * This class implements the business logic for user login.
 */
const jwt = require('jsonwebtoken');
require('dotenv').config();

class LoginUser {
    /**
     * Constructor
     * @param {UserRepository} userRepository - An implementation of UserRepository
     */
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.JWT_SECRET = process.env.JWT_SECRET || 'nutech-integrasi-secret-key';
        this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '12h';
    }

    /**
     * Execute the use case
     * @param {Object} userData - The user credentials
     * @param {string} userData.email - The user's email
     * @param {string} userData.password - The user's password
     * @returns {Promise<Object>} The result object with JWT token
     * @throws {Error} If validation fails or credentials are invalid
     */
    async execute(userData) {
        try {
            if (!this.isValidEmail(userData.email)) {
                const error = new Error('Paramter email tidak sesuai format');
                error.statusCode = 400;
                error.errorCode = 102;
                throw error;
            }

            if (!userData.password || userData.password.length < 8) {
                const error = new Error('Password minimal 8 karakter');
                error.statusCode = 400;
                error.errorCode = 103;
                throw error;
            }

            const user = await this.userRepository.findByEmail(userData.email);

            if (!user || user.password !== userData.password) {
                const error = new Error('Username atau password salah');
                error.statusCode = 401;
                error.errorCode = 103;
                throw error;
            }

            const token = jwt.sign(
                {
                    data: userData.email
                },
                this.JWT_SECRET,
                {
                    expiresIn: this.JWT_EXPIRES_IN
                }
            );

            return {
                status: 0,
                message: "Login Sukses",
                data: {
                    token
                }
            };
        } catch (error) {
            if (error.code) {
                error.statusCode = 400;
                error.errorCode = error.code;
            }
            throw error;
        }
    }

    /**
     * Validate email format
     * @param {string} email - The email to validate
     * @returns {boolean} Whether the email is valid
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

module.exports = LoginUser;
