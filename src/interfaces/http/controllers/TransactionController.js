/**
 * TransactionController
 * 
 * This controller handles transaction-related HTTP requests.
 */
class TransactionController {
    /**
     * Constructor
     * @param {GetBalance} getBalance - The get balance use case
     * @param {TopUpBalance} topUpBalance - The top up balance use case
     * @param {CreateTransaction} createTransaction - The create transaction use case
     * @param {GetTransactionHistory} getTransactionHistory - The get transaction history use case
     */
    constructor(getBalance, topUpBalance, createTransaction, getTransactionHistory) {
        this.getBalanceUseCase = getBalance;
        this.topUpBalanceUseCase = topUpBalance;
        this.createTransactionUseCase = createTransaction;
        this.getTransactionHistoryUseCase = getTransactionHistory;
    }

    /**
     * Get user balance
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getBalance(req, res) {
        try {
            const userId = req.user.id;
            const result = await this.getBalanceUseCase.execute(userId);
            res.status(200).json(result);
        } catch (error) {
            console.error('Balance error:', error);
            const errorResponse = {
                status: error.errorCode || 999,
                message: error.message || 'Internal server error',
                data: null
            };
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json(errorResponse);
        }
    }

    /**
     * Top up user balance
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async topUp(req, res) {
        try {
            const userId = req.user.id;
            const { top_up_amount } = req.body;

            const result = await this.topUpBalanceUseCase.execute(userId, top_up_amount);
            res.status(200).json(result);
        } catch (error) {
            console.error('TopUp error:', error);
            const errorResponse = {
                status: error.errorCode || 999,
                message: error.message || 'Internal server error',
                data: null
            };
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json(errorResponse);
        }
    }

    /**
     * Create a new transaction
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async transaction(req, res) {
        try {
            const userId = req.user.id;
            const { service_code } = req.body;

            const result = await this.createTransactionUseCase.execute(userId, service_code);
            res.status(200).json(result);
        } catch (error) {
            console.error('Transaction error:', error);
            const errorResponse = {
                status: error.errorCode || 999,
                message: error.message || 'Internal server error',
                data: null
            };
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json(errorResponse);
        }
    }

    /**
     * Get transaction history
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async getTransactionHistory(req, res, next) {
        try {
            const userId = req.user.id;
            const offset = parseInt(req.query.offset) || 0;
            const limit = req.query.limit ? parseInt(req.query.limit) : null;

            const result = await this.getTransactionHistoryUseCase.execute(userId, limit, offset);

            res.status(200).json(result);
        } catch (error) {
            const errorResponse = {
                status: error.errorCode || 999,
                message: error.message || 'Internal server error',
                data: null
            };
            res.status(error.statusCode || 500).json(errorResponse);
        }
    }
}

module.exports = TransactionController;
