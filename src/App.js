const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./interfaces/http/routes');
const errorHandler = require('./interfaces/http/middlewares/errorHandler');
const { connect } = require('./infrastructure/database/connection');

class App {
    constructor() {
        this.app = express();
        this.setupMiddlewares();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    setupMiddlewares() {
        // Body parser middleware
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        // Security middlewares
        this.app.use(helmet());
        this.app.use(cors());

        // Logging middleware
        this.app.use(morgan('dev'));
    }

    setupRoutes() {
        // API routes
        this.app.use('/api', routes);

        // 404 handler
        this.app.use('*', (req, res) => {
            res.status(404).json({
                success: false,
                error: 'Endpoint not found'
            });
        });
    }

    setupErrorHandling() {
        // Global error handler
        this.app.use(errorHandler);
    }

    async start() {
        try {
            // Connect to database
            await connect();

            // Start server
            const PORT = process.env.PORT || 3000;
            this.app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        } catch (error) {
            console.error('Failed to start server:', error);
            process.exit(1);
        }
    }
}

module.exports = App;
