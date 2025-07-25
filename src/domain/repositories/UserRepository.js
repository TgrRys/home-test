/**
 * UserRepository interface
 * 
 * This defines the contract that any UserRepository implementation must follow.
 * It specifies methods for CRUD operations on User entities.
 */
class UserRepository {
    /**
     * Find a user by ID
     * @param {string|number} id - The user ID
     * @returns {Promise<User|null>} The user entity or null if not found
     */
    async findById(id) {
        throw new Error('Method not implemented');
    }

    /**
     * Find a user by email
     * @param {string} email - The user's email
     * @returns {Promise<User|null>} The user entity or null if not found
     */
    async findByEmail(email) {
        throw new Error('Method not implemented');
    }

    /**
     * Create a new user
     * @param {User} user - The user entity to create
     * @returns {Promise<User>} The created user entity
     */
    async create(user) {
        throw new Error('Method not implemented');
    }

    /**
     * Update an existing user
     * @param {string|number} id - The user ID
     * @param {User} user - The user entity with updated data
     * @returns {Promise<User|null>} The updated user entity or null if not found
     */
    async update(id, user) {
        throw new Error('Method not implemented');
    }

    /**
     * Delete a user
     * @param {string|number} id - The user ID
     * @returns {Promise<boolean>} True if deleted, false if not found
     */
    async delete(id) {
        throw new Error('Method not implemented');
    }

    /**
     * Find all users
     * @param {Object} options - Query options (pagination, sorting, etc.)
     * @returns {Promise<User[]>} Array of user entities
     */
    async findAll(options = {}) {
        throw new Error('Method not implemented');
    }
}

module.exports = UserRepository;
