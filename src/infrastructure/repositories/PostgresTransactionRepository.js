const TransactionRepository = require('../../domain/repositories/TransactionRepository');
const Transaction = require('../../domain/entities/Transaction');

/**
 * PostgreSQL implementation of TransactionRepository.
 * Handles all transaction-related database operations.
 */
class PostgresTransactionRepository extends TransactionRepository {
    constructor(database) {
        super();
        this.database = database;
    }

    async create(transaction) {
        const query = `
            INSERT INTO transactions (
                id, invoice_number, user_id, service_code, service_name, 
                transaction_type, total_amount, description, created_on
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;

        const values = [
            transaction.id,
            transaction.invoice_number,
            transaction.user_id,
            transaction.service_code,
            transaction.service_name,
            transaction.transaction_type,
            transaction.total_amount,
            transaction.description,
            new Date()
        ];

        try {
            const result = await this.database.query(query, values);
            return new Transaction(result.rows[0]);
        } catch (error) {
            console.error('Error creating transaction:', error);
            throw new Error('Gagal membuat transaksi');
        }
    }

    async findById(id) {
        const query = 'SELECT * FROM transactions WHERE id = $1';

        try {
            const result = await this.database.query(query, [id]);

            if (result.rows.length === 0) {
                return null;
            }

            return new Transaction(result.rows[0]);
        } catch (error) {
            console.error('Error finding transaction by ID:', error);
            throw new Error('Gagal mencari transaksi');
        }
    }

    async findByInvoiceNumber(invoiceNumber) {
        const query = 'SELECT * FROM transactions WHERE invoice_number = $1';

        try {
            const result = await this.database.query(query, [invoiceNumber]);

            if (result.rows.length === 0) {
                return null;
            }

            return new Transaction(result.rows[0]);
        } catch (error) {
            console.error('Error finding transaction by invoice number:', error);
            throw new Error('Gagal mencari transaksi');
        }
    }

    async findByUserId(userId, limit = null, offset = 0) {
        let query = `
            SELECT * FROM transactions 
            WHERE user_id = $1 
            ORDER BY created_on DESC
        `;
        const params = [userId];

        if (limit !== null) {
            query += ` LIMIT $2 OFFSET $3`;
            params.push(limit, offset);
        }

        try {
            const result = await this.database.query(query, params);
            return result.rows.map(row => new Transaction(row));
        } catch (error) {
            console.error('Error finding transactions by user ID:', error);
            throw new Error('Gagal mencari transaksi user');
        }
    }

    async getTransactionHistory(userId, limit = null, offset = 0) {
        const countQuery = 'SELECT COUNT(*) FROM transactions WHERE user_id = $1';
        const countResult = await this.database.query(countQuery, [userId]);
        const total = parseInt(countResult.rows[0].count);

        let query = `
            SELECT * FROM transactions 
            WHERE user_id = $1 
            ORDER BY created_on DESC
        `;
        const params = [userId];

        if (limit !== null) {
            query += ` LIMIT $2 OFFSET $3`;
            params.push(limit, offset);
        }

        try {
            const result = await this.database.query(query, params);
            const records = result.rows.map(row => new Transaction(row));

            return {
                records,
                total,
                offset: offset || 0,
                limit: limit || total
            };
        } catch (error) {
            console.error('Error getting transaction history:', error);
            throw new Error('Gagal mendapatkan history transaksi');
        }
    }
}

module.exports = PostgresTransactionRepository;
