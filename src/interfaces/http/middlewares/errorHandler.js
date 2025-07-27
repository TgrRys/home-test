/**
 * Error handling middleware
 * 
 * This middleware catches all errors thrown in the application and formats them
 * for a consistent API response.
 */
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const errorResponse = {
        status: err.errorCode || 999, 
        message: err.message || 'An unexpected error occurred',
        data: null
    };

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
