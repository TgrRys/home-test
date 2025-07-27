/**
 * BannerController
 * Handles HTTP requests for banner operations
 */
class BannerController {
    /**
     * Constructor
     * @param {GetBanners} getBannersUseCase - Get banners use case
     */
    constructor(getBannersUseCase) {
        this.getBannersUseCase = getBannersUseCase;
    }

    /**
     * Get all banners
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getBanners(req, res) {
        try {
            const result = await this.getBannersUseCase.execute();

            res.status(200).json({
                status: 0,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            console.error('Error in getBanners:', error);
            res.status(500).json({
                status: 500,
                message: 'Internal server error',
                data: null
            });
        }
    }
}

module.exports = BannerController;
