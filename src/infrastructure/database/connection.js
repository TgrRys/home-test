const { Sequelize } = require('sequelize');
const config = require('../../../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        logging: dbConfig.logging,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

module.exports = {
    sequelize,
    Sequelize,
    connect: async () => {
        try {
            await sequelize.authenticate();
            console.log('Database connection has been established successfully.');
            return true;
        } catch (error) {
            console.error('Unable to connect to the database:', error);
            return false;
        }
    },
    close: async () => {
        try {
            await sequelize.close();
            console.log('Database connection closed successfully.');
            return true;
        } catch (error) {
            console.error('Error closing database connection:', error);
            return false;
        }
    },
};
