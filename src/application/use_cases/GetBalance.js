/**
 * GetBalance use case
 * 
 * This class implements the business logic for retrieving user balance.
 */
const Balance = require('../../domain/entities/Balance');

class GetBalance {
    /**
     * Constructor
     * @param {BalanceRepository} balanceRepository - An implementation of BalanceRepository
     */
    constructor(balanceRepository) {
        this.balanceRepository = balanceRepository;
    }

    /**
     * Execute the use case
     * @param {string} userId - The user ID
     * @returns {Promise<Object>} The result object with balance data
     * @throws {Error} If validation fails
     */
    async execute(userId) {
        try {
            if (!userId) {
                const error = new Error('User ID diperlukan');
                error.statusCode = 401;
                error.errorCode = 108;
                throw error;
            }

            let balance = await this.balanceRepository.findByUserId(userId);

            if (!balance) {
                const newBalance = new Balance({ user_id: userId, balance: 0 });
                balance = await this.balanceRepository.create(newBalance);
            }

            return {
                status: 0,
                message: 'Get Balance Berhasil',
                data: balance.toJSON()
            };
        } catch (error) {
            console.error('GetBalance error:', error);
            throw error;
        }
    }
}

module.exports = GetBalance;
