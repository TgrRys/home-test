/**
 * Transaction Repository Interface
 * Defines the contract for transaction data access operations
 */
class TransactionRepository {
    /**
     * Create a new transaction
     * @param {Transaction} transaction - Transaction entity
     * @returns {Promise<Transaction>} Created transaction
     */
    async create(transaction) {
        throw new Error('Method "create" must be implemented.');
    }

    /**
     * Find transaction by ID
     * @param {string} id - Transaction ID
     * @returns {Promise<Transaction|null>} Transaction or null if not found
     */
    async findById(id) {
        throw new Error('Method "findById" must be implemented.');
    }

    /**
     * Find transaction by invoice number
     * @param {string} invoiceNumber - Invoice number
     * @returns {Promise<Transaction|null>} Transaction or null if not found
     */
    async findByInvoiceNumber(invoiceNumber) {
        throw new Error('Method "findByInvoiceNumber" must be implemented.');
    }

    /**
     * Find transactions by user ID
     * @param {string} userId - User ID
     * @param {number} limit - Limit number of records
     * @param {number} offset - Offset for pagination
     * @returns {Promise<Transaction[]>} Array of transactions
     */
    async findByUserId(userId, limit, offset) {
        throw new Error('Method "findByUserId" must be implemented.');
    }

    /**
     * Get transaction history for user
     * @param {string} userId - User ID
     * @param {number} limit - Limit number of records
     * @param {number} offset - Offset for pagination
     * @returns {Promise<{records: Transaction[], total: number}>} Transaction history
     */
    async getTransactionHistory(userId, limit, offset) {
        throw new Error('Method "getTransactionHistory" must be implemented.');
    }
}

module.exports = TransactionRepository;
