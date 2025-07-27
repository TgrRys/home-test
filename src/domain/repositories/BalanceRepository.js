/**
 * Balance Repository Interface
 * Defines the contract for balance data access operations
 */
class BalanceRepository {
    /**
     * Get user balance
     * @param {string} userId - User ID
     * @returns {Promise<Balance|null>} Balance entity or null if not found
     */
    async findByUserId(userId) {
        throw new Error('Method "findByUserId" must be implemented.');
    }

    /**
     * Create initial balance for user
     * @param {Balance} balance - Balance entity
     * @returns {Promise<Balance>} Created balance
     */
    async create(balance) {
        throw new Error('Method "create" must be implemented.');
    }

    /**
     * Update user balance
     * @param {string} userId - User ID
     * @param {number} newBalance - New balance amount
     * @returns {Promise<Balance>} Updated balance
     */
    async updateBalance(userId, newBalance) {
        throw new Error('Method "updateBalance" must be implemented.');
    }

    /**
     * Add amount to user balance (topup)
     * @param {string} userId - User ID
     * @param {number} amount - Amount to add
     * @returns {Promise<Balance>} Updated balance
     */
    async addBalance(userId, amount) {
        throw new Error('Method "addBalance" must be implemented.');
    }

    /**
     * Deduct amount from user balance (payment)
     * @param {string} userId - User ID
     * @param {number} amount - Amount to deduct
     * @returns {Promise<Balance>} Updated balance
     */
    async deductBalance(userId, amount) {
        throw new Error('Method "deductBalance" must be implemented.');
    }
}

module.exports = BalanceRepository;
