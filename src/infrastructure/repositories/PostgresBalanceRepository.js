const BalanceRepository = require('../../domain/repositories/BalanceRepository');
const Balance = require('../../domain/entities/Balance');
const { Database } = require('../database/connection');

/**
 * PostgreSQL implementation of BalanceRepository.
 * Handles all balance-related database operations.
 */
class PostgresBalanceRepository extends BalanceRepository {
    constructor() {
        super();
    }

    async findByUserId(userId) {
        const query = 'SELECT * FROM balances WHERE user_id = $1';

        try {
            const result = await Database.query(query, [userId]);

            if (result.rows.length === 0) {
                return null;
            }

            return new Balance({
                user_id: result.rows[0].user_id,
                balance: parseInt(result.rows[0].balance),
                updated_at: result.rows[0].updated_at
            });
        } catch (error) {
            console.error('Error finding balance:', error);
            throw new Error('Gagal mencari balance');
        }
    }

    async create(balance) {
        const query = `
            INSERT INTO balances (user_id, balance, created_at, updated_at)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const values = [
            balance.user_id,
            balance.balance,
            new Date(),
            new Date()
        ];

        try {
            const result = await Database.query(query, values);
            return new Balance({
                user_id: result.rows[0].user_id,
                balance: parseInt(result.rows[0].balance),
                updated_at: result.rows[0].updated_at
            });
        } catch (error) {
            console.error('Error creating balance:', error);
            throw new Error('Gagal membuat balance');
        }
    }

    async updateBalance(userId, newBalance) {
        const query = `
            UPDATE balances 
            SET balance = $1, updated_at = $2 
            WHERE user_id = $3
            RETURNING *
        `;

        const values = [newBalance, new Date(), userId];

        try {
            const result = await Database.query(query, values);

            if (result.rows.length === 0) {
                throw new Error('Balance tidak ditemukan');
            }

            return new Balance({
                user_id: result.rows[0].user_id,
                balance: parseInt(result.rows[0].balance),
                updated_at: result.rows[0].updated_at
            });
        } catch (error) {
            console.error('Error updating balance:', error);
            throw new Error('Gagal update balance');
        }
    }

    async addBalance(userId, amount) {
        // Use transaction to ensure atomicity
        return await Database.transaction(async (client) => {
            // Get current balance
            const selectQuery = 'SELECT balance FROM balances WHERE user_id = $1 FOR UPDATE';
            const selectResult = await client.query(selectQuery, [userId]);

            if (selectResult.rows.length === 0) {
                // Create initial balance if not exists
                const createQuery = `
                    INSERT INTO balances (user_id, balance, created_at, updated_at)
                    VALUES ($1, $2, $3, $4)
                    RETURNING *
                `;
                const createResult = await client.query(createQuery, [userId, amount, new Date(), new Date()]);
                return new Balance({
                    user_id: createResult.rows[0].user_id,
                    balance: parseInt(createResult.rows[0].balance),
                    updated_at: createResult.rows[0].updated_at
                });
            }

            // Update existing balance
            const currentBalance = parseInt(selectResult.rows[0].balance);
            const newBalance = currentBalance + amount;

            const updateQuery = `
                UPDATE balances 
                SET balance = $1, updated_at = $2 
                WHERE user_id = $3
                RETURNING *
            `;
            const updateResult = await client.query(updateQuery, [newBalance, new Date(), userId]);

            return new Balance({
                user_id: updateResult.rows[0].user_id,
                balance: parseInt(updateResult.rows[0].balance),
                updated_at: updateResult.rows[0].updated_at
            });
        });
    }

    async deductBalance(userId, amount) {
        // Use transaction to ensure atomicity
        return await Database.transaction(async (client) => {
            // Get current balance
            const selectQuery = 'SELECT balance FROM balances WHERE user_id = $1 FOR UPDATE';
            const selectResult = await client.query(selectQuery, [userId]);

            if (selectResult.rows.length === 0) {
                const error = new Error('Balance tidak ditemukan');
                error.statusCode = 400;
                error.errorCode = 102;
                throw error;
            }

            const currentBalance = parseInt(selectResult.rows[0].balance);

            if (currentBalance < amount) {
                const error = new Error('Balance tidak mencukupi');
                error.statusCode = 400;
                error.errorCode = 102;
                throw error;
            }

            const newBalance = currentBalance - amount;

            const updateQuery = `
                UPDATE balances 
                SET balance = $1, updated_at = $2 
                WHERE user_id = $3
                RETURNING *
            `;
            const updateResult = await client.query(updateQuery, [newBalance, new Date(), userId]);

            return new Balance({
                user_id: updateResult.rows[0].user_id,
                balance: parseInt(updateResult.rows[0].balance),
                updated_at: updateResult.rows[0].updated_at
            });
        });
    }
}

module.exports = PostgresBalanceRepository;
