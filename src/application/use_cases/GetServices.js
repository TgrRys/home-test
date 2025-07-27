/**
 * GetServices use case
 * 
 * This class implements the business logic for retrieving services.
 */
class GetServices {
    /**
     * Constructor
     * @param {ServiceRepository} serviceRepository - An implementation of ServiceRepository
     */
    constructor(serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    /**
     * Execute the use case
     * @returns {Promise<Object>} The result object
     */
    async execute() {
        try {
            const services = await this.serviceRepository.findAll();

            const serviceData = services.map(service => service.toJSON());

            return {
                success: true,
                data: serviceData,
                message: 'Sukses'
            };
        } catch (error) {
            console.error('Error in GetServices use case:', error);
            throw new Error('Failed to retrieve services');
        }
    }
}

module.exports = GetServices;
