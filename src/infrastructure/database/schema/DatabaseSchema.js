const { Database } = require('../connection');

/**
 * Database Schema Manager
 * Handles table creation and database schema management using raw SQL
 */
class DatabaseSchema {
    /**
     * Create users table
     */
    static async createUsersTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                profile_image VARCHAR(500) DEFAULT 'https://yoururlapi.com/profile.jpeg',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        return await Database.query(query);
    }

    /**
     * Create banners table
     */
    static async createBannersTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS banners (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                banner_name VARCHAR(255) NOT NULL,
                banner_image VARCHAR(500) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        return await Database.query(query);
    }

    /**
     * Create services table
     */
    static async createServicesTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS services (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                service_code VARCHAR(50) UNIQUE NOT NULL,
                service_name VARCHAR(255) NOT NULL,
                service_icon VARCHAR(500) NOT NULL,
                service_tariff INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        return await Database.query(query);
    }

    /**
     * Create balances table
     */
    static async createBalancesTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS balances (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                balance BIGINT NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id)
            )
        `;
        return await Database.query(query);
    }

    /**
     * Create transactions table
     */
    static async createTransactionsTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS transactions (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                invoice_number VARCHAR(50) UNIQUE NOT NULL,
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                service_code VARCHAR(50),
                service_name VARCHAR(255),
                transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('TOPUP', 'PAYMENT')),
                total_amount BIGINT NOT NULL,
                description TEXT,
                created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        return await Database.query(query);
    }

    /**
     * Create all tables
     */
    static async createAllTables() {
        await this.createUsersTable();
        await this.createBannersTable();
        await this.createServicesTable();
        await this.createBalancesTable();
        await this.createTransactionsTable();
    }
}

module.exports = DatabaseSchema;
