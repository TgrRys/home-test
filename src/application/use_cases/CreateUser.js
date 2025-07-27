/**
 * CreateUser use case
 * 
 * This class implements the business logic for creating a new user.
 */
const User = require('../../domain/entities/User');

class CreateUser {
    /**
     * Constructor
     * @param {UserRepository} userRepository - An implementation of UserRepository
     */
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Execute the use case
     * @param {Object} userData - The user data
     * @param {string} userData.email - The user's email
     * @param {string} userData.first_name - The user's first name
     * @param {string} userData.last_name - The user's last name
     * @param {string} userData.password - The user's password
     * @returns {Promise<Object>} The result object
     * @throws {Error} If validation fails
     */
    async execute(userData) {
        try {
            const existingUser = await this.userRepository.findByEmail(userData.email);
            if (existingUser) {
                const error = new Error('Email sudah terdaftar');
                error.statusCode = 400;
                error.errorCode = 101;
                throw error;
            }

            const user = new User(
                null,
                userData.first_name,
                userData.last_name,
                userData.email,
                userData.password
            );

            await this.userRepository.create(user);

            return {
                status: 0,
                message: "Registrasi berhasil silahkan login",
                data: null
            };
        } catch (error) {
            if (error.code) {
                error.statusCode = 400;
                error.errorCode = error.code;
            }
            throw error;
        }
    }
}

module.exports = CreateUser;
