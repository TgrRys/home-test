const { Database } = require('../connection');

/**
 * User Database Operations
 * Handles direct user database operations for seeding and setup
 */
class UserDatabaseOperations {
    /**
     * Create a new user using prepared statement
     * @param {Object} userData - User data
     * @returns {Promise<Object>} Created user
     */
    static async create(userData) {
        const query = `
            INSERT INTO users (first_name, last_name, email, password, profile_image)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, first_name, last_name, email, profile_image, created_at, updated_at
        `;
        const values = [
            userData.first_name,
            userData.last_name,
            userData.email,
            userData.password,
            userData.profile_image || 'https://yoururlapi.com/profile.jpeg'
        ];

        const result = await Database.query(query, values);
        return result.rows[0];
    }

    /**
     * Find user by email using prepared statement
     * @param {string} email - User email
     * @returns {Promise<Object|null>} User or null
     */
    static async findByEmail(email) {
        const query = `
            SELECT id, first_name, last_name, email, password, profile_image, created_at, updated_at
            FROM users
            WHERE email = $1
        `;
        const result = await Database.query(query, [email]);
        return result.rows[0] || null;
    }
}

module.exports = UserDatabaseOperations;
