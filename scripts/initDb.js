require('dotenv').config();
const { sequelize } = require('../src/infrastructure/database/connection');
const UserModel = require('../src/infrastructure/database/models/UserModel');

async function initializeDatabase() {
    try {
        // Sync all models with the database
        await sequelize.sync({ force: true });
        console.log('Database synchronized successfully');

        // Seed initial data if needed
        await UserModel.create({
            first_name: 'Admin',
            last_name: 'User',
            email: 'admin@example.com',
            password: 'password123'
        });
        console.log('Initial data seeded successfully');

        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initializeDatabase();
