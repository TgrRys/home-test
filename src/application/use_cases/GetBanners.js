/**
 * GetBanners use case
 * 
 * This class implements the business logic for retrieving banners.
 */
class GetBanners {
    /**
     * Constructor
     * @param {BannerRepository} bannerRepository - An implementation of BannerRepository
     */
    constructor(bannerRepository) {
        this.bannerRepository = bannerRepository;
    }

    /**
     * Execute the use case
     * @returns {Promise<Object>} The result object
     */
    async execute() {
        try {
            const banners = await this.bannerRepository.findAll();

            return {
                status: 0,
                message: 'Sukses',
                data: banners.map(banner => banner.toJSON())
            };
        } catch (error) {
            console.error('GetBanners error:', error);
            throw error;
        }
    }
}

module.exports = GetBanners;
