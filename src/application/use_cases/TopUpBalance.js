/**
 * TopUpBalance use case
 * 
 * This class implements the business logic for topping up user balance.
 */
const Transaction = require('../../domain/entities/Transaction');
const { v4: uuidv4 } = require('uuid');

class TopUpBalance {
    /**
     * Constructor
     * @param {BalanceRepository} balanceRepository - An implementation of BalanceRepository
     * @param {TransactionRepository} transactionRepository - An implementation of TransactionRepository
     */
    constructor(balanceRepository, transactionRepository) {
        this.balanceRepository = balanceRepository;
        this.transactionRepository = transactionRepository;
    }

    /**
     * Execute the use case
     * @param {string} userId - The user ID
     * @param {number} topUpAmount - The amount to top up
     * @returns {Promise<Object>} The result object with balance data
     * @throws {Error} If validation fails
     */
    async execute(userId, topUpAmount) {
        try {
            if (!userId) {
                const error = new Error('User ID diperlukan');
                error.statusCode = 401;
                error.errorCode = 108;
                throw error;
            }

            if (!topUpAmount || typeof topUpAmount !== 'number' || topUpAmount <= 0) {
                const error = new Error('Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0');
                error.statusCode = 400;
                error.errorCode = 102;
                throw error;
            }

            const updatedBalance = await this.balanceRepository.addBalance(userId, topUpAmount);

            const transactionData = {
                id: uuidv4(),
                invoice_number: Transaction.generateInvoiceNumber(),
                user_id: userId,
                service_code: null,
                service_name: null,
                transaction_type: 'TOPUP',
                total_amount: topUpAmount,
                description: 'Top Up balance'
            };

            const transaction = new Transaction(transactionData);
            await this.transactionRepository.create(transaction);

            return {
                status: 0,
                message: 'Top Up Balance berhasil',
                data: updatedBalance.toJSON()
            };
        } catch (error) {
            console.error('TopUpBalance error:', error);
            throw error;
        }
    }
}

module.exports = TopUpBalance;
