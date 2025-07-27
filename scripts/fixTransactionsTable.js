#!/usr/bin/env node

const { Pool } = require('pg');

async function fixTransactionsTable() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    try {
        console.log('Checking and fixing transactions table schema...');

        const checkTableQuery = `
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'transactions' 
            ORDER BY ordinal_position;
        `;

        const tableInfo = await pool.query(checkTableQuery);
        console.log('Current transactions table columns:', tableInfo.rows);

        const hasServiceCode = tableInfo.rows.some(row => row.column_name === 'service_code');

        if (!hasServiceCode) {
            console.log('service_code column missing, adding it...');

            await pool.query('ALTER TABLE transactions ADD COLUMN service_code VARCHAR(50)');
            console.log('added service_code column');
        } else {
            console.log('service_code column already exists');
        }

        const hasServiceName = tableInfo.rows.some(row => row.column_name === 'service_name');

        if (!hasServiceName) {
            console.log('service_name column missing, adding it...');

            await pool.query('ALTER TABLE transactions ADD COLUMN service_name VARCHAR(255)');
            console.log('added service_name column');
        } else {
            console.log('service_name column already exists');
        }

        // Verify the fix
        const finalCheck = await pool.query(checkTableQuery);
        console.log('final transactions table structure:', finalCheck.rows);

        console.log('transactions table schema fix completed successfully!');

    } catch (error) {
        console.error('error fixing transactions table:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

if (require.main === module) {
    fixTransactionsTable()
        .then(() => {
            console.log('Migration completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Migration failed:', error);
            process.exit(1);
        });
}

module.exports = fixTransactionsTable;
