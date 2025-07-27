/**
 * BannerRepository Interface
 * 
 * Defines the contract for banner data access
 */
class BannerRepository {
    /**
     * Find all banners
     * @returns {Promise<Banner[]>} Array of banner entities
     */
    async findAll() {
        throw new Error('Method findAll must be implemented');
    }

    /**
     * Find banner by ID
     * @param {string} id - Banner ID
     * @returns {Promise<Banner|null>} Banner entity or null
     */
    async findById(id) {
        throw new Error('Method findById must be implemented');
    }

    /**
     * Create a new banner
     * @param {Banner} banner - Banner entity
     * @returns {Promise<Banner>} Created banner entity
     */
    async create(banner) {
        throw new Error('Method create must be implemented');
    }

    /**
     * Update an existing banner
     * @param {string} id - Banner ID
     * @param {Banner} banner - Banner entity with updated data
     * @returns {Promise<Banner|null>} Updated banner entity or null
     */
    async update(id, banner) {
        throw new Error('Method update must be implemented');
    }

    /**
     * Delete a banner
     * @param {string} id - Banner ID
     * @returns {Promise<boolean>} True if deleted, false if not found
     */
    async delete(id) {
        throw new Error('Method delete must be implemented');
    }
}

module.exports = BannerRepository;
