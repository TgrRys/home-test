/**
 * Banner Domain Entity
 * 
 * Represents a banner in the domain layer
 */
class Banner {
    constructor(id, banner_name, banner_image, description, created_at = null, updated_at = null) {
        this.id = id;
        this.banner_name = banner_name;
        this.banner_image = banner_image;
        this.description = description;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    /**
     * Validates the banner data
     * @returns {boolean} True if valid
     */
    isValid() {
        return this.banner_name &&
            this.banner_image &&
            this.description;
    }

    /**
     * Returns the banner data for API response
     * @returns {Object} Banner data without internal fields
     */
    toJSON() {
        return {
            banner_name: this.banner_name,
            banner_image: this.banner_image,
            description: this.description
        };
    }
}

module.exports = Banner;
