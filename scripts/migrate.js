/**
 * Database migration to add profile_image column to users table
 */
const { sequelize } = require('../src/infrastructure/database/connection');

async function migrate() {
    try {
        // Connect to the database
        await sequelize.authenticate();
        console.log('Connected to the database.');

        // Add profile_image column to users table if it doesn't exist
        await sequelize.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS profile_image VARCHAR(255) 
            DEFAULT 'https://yoururlapi.com/profile.jpeg'
        `);
        
        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
