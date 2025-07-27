const { sequelize } = require('../src/infrastructure/database/connection');

async function migrate() {
    try {
        await sequelize.authenticate();
        console.log('Connected to the database.');

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
