/**
 * ServiceRepository Interface
 * 
 * Defines the contract for service data access
 */
class ServiceRepository {
    /**
     * Find all services
     * @returns {Promise<Service[]>} Array of service entities
     */
    async findAll() {
        throw new Error('Method findAll must be implemented');
    }

    /**
     * Find service by ID
     * @param {string} id - Service ID
     * @returns {Promise<Service|null>} Service entity or null
     */
    async findById(id) {
        throw new Error('Method findById must be implemented');
    }

    /**
     * Find service by code
     * @param {string} serviceCode - Service code
     * @returns {Promise<Service|null>} Service entity or null
     */
    async findByCode(serviceCode) {
        throw new Error('Method findByCode must be implemented');
    }

    /**
     * Create a new service
     * @param {Service} service - Service entity
     * @returns {Promise<Service>} Created service entity
     */
    async create(service) {
        throw new Error('Method create must be implemented');
    }

    /**
     * Update an existing service
     * @param {string} id - Service ID
     * @param {Service} service - Service entity with updated data
     * @returns {Promise<Service|null>} Updated service entity or null
     */
    async update(id, service) {
        throw new Error('Method update must be implemented');
    }

    /**
     * Delete a service
     * @param {string} id - Service ID
     * @returns {Promise<boolean>} True if deleted, false if not found
     */
    async delete(id) {
        throw new Error('Method delete must be implemented');
    }
}

module.exports = ServiceRepository;
