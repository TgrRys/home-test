/**
 * ServiceController
 * Handles HTTP requests for service operations
 */
class ServiceController {
    /**
     * Constructor
     * @param {GetServices} getServicesUseCase - Get services use case
     */
    constructor(getServicesUseCase) {
        this.getServicesUseCase = getServicesUseCase;
    }

    /**
     * Get all services
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getServices(req, res) {
        try {
            const result = await this.getServicesUseCase.execute();

            res.status(200).json({
                status: 0,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            console.error('Error in getServices:', error);
            res.status(500).json({
                status: 500,
                message: 'Internal server error',
                data: null
            });
        }
    }
}

module.exports = ServiceController;
