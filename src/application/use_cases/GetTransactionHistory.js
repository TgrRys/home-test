/**
 * GetTransactionHistory use case
 * 
 * This class implements the business logic for retrieving user transaction history.
 */
class GetTransactionHistory {
    /**
     * Constructor
     * @param {TransactionRepository} transactionRepository - An implementation of TransactionRepository
     */
    constructor(transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    /**
     * Execute the use case
     * @param {string} userId - The user ID
     * @param {number|null} limit - The maximum number of records to return (optional)
     * @param {number} offset - The number of records to skip for pagination (default: 0)
     * @returns {Promise<Object>} The result object with transaction history data
     * @throws {Error} If validation fails
     */
    async execute(userId, limit = null, offset = 0) {
        try {
            if (!userId) {
                const error = new Error('User ID diperlukan');
                error.statusCode = 401;
                error.errorCode = 108;
                throw error;
            }

            if (offset < 0) {
                offset = 0;
            }

            if (limit !== null && (limit <= 0 || !Number.isInteger(limit))) {
                limit = null;
            }

            const result = await this.transactionRepository.getTransactionHistory(userId, limit, offset);

            const historyData = result.records.map(transaction => transaction.toHistoryJSON());

            return {
                status: 0,
                message: 'Get History Berhasil',
                data: {
                    offset: result.offset,
                    limit: result.limit,
                    records: historyData
                }
            };
        } catch (error) {
            console.error('GetTransactionHistory error:', error);
            throw error;
        }
    }
}

module.exports = GetTransactionHistory;
