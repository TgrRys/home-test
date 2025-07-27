/**
 * CreateTransaction use case
 * 
 * This class implements the business logic for creating a payment transaction.
 */
const Transaction = require('../../domain/entities/Transaction');
const { v4: uuidv4 } = require('uuid');

class CreateTransaction {
    /**
     * Constructor
     * @param {BalanceRepository} balanceRepository - An implementation of BalanceRepository
     * @param {TransactionRepository} transactionRepository - An implementation of TransactionRepository
     * @param {ServiceRepository} serviceRepository - An implementation of ServiceRepository
     */
    constructor(balanceRepository, transactionRepository, serviceRepository) {
        this.balanceRepository = balanceRepository;
        this.transactionRepository = transactionRepository;
        this.serviceRepository = serviceRepository;
    }

    /**
     * Execute the use case
     * @param {string} userId - The user ID
     * @param {string} serviceCode - The service code for the transaction
     * @returns {Promise<Object>} The result object with transaction data
     * @throws {Error} If validation fails or insufficient balance
     */
    async execute(userId, serviceCode) {
        try {
            if (!userId) {
                const error = new Error('User ID diperlukan');
                error.statusCode = 401;
                error.errorCode = 108;
                throw error;
            }

            if (!serviceCode) {
                const error = new Error('Service code diperlukan');
                error.statusCode = 400;
                error.errorCode = 102;
                throw error;
            }

            const service = await this.serviceRepository.findByCode(serviceCode);
            if (!service) {
                const error = new Error('Service ataus Layanan tidak ditemukan');
                error.statusCode = 400;
                error.errorCode = 102;
                throw error;
            }

            const serviceAmount = service.service_tariff;

            let userBalance = await this.balanceRepository.findByUserId(userId);
            if (!userBalance) {
                const error = new Error('Balance tidak mencukupi');
                error.statusCode = 400;
                error.errorCode = 102;
                throw error;
            }

            if (userBalance.balance < serviceAmount) {
                const error = new Error('Balance tidak mencukupi');
                error.statusCode = 400;
                error.errorCode = 102;
                throw error;
            }

            await this.balanceRepository.deductBalance(userId, serviceAmount);

            const transactionData = {
                id: uuidv4(),
                invoice_number: Transaction.generateInvoiceNumber(),
                user_id: userId,
                service_code: service.service_code,
                service_name: service.service_name,
                transaction_type: 'PAYMENT',
                total_amount: serviceAmount,
                description: service.service_name
            };

            const transaction = new Transaction(transactionData);
            const createdTransaction = await this.transactionRepository.create(transaction);

            return {
                status: 0,
                message: 'Transaksi berhasil',
                data: createdTransaction.toJSON()
            };
        } catch (error) {
            console.error('CreateTransaction error:', error);
            throw error;
        }
    }
}

module.exports = CreateTransaction;
