/**
 * Service Domain Entity
 * 
 * Represents a service in the domain layer
 */
class Service {
    constructor(id, service_code, service_name, service_icon, service_tariff, created_at = null, updated_at = null) {
        this.id = id;
        this.service_code = service_code;
        this.service_name = service_name;
        this.service_icon = service_icon;
        this.service_tariff = service_tariff;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    /**
     * Validates the service data
     * @returns {boolean} True if valid
     */
    isValid() {
        return this.service_code &&
            this.service_name &&
            this.service_icon &&
            typeof this.service_tariff === 'number' &&
            this.service_tariff >= 0;
    }

    /**
     * Returns the service data for API response
     * @returns {Object} Service data without internal fields
     */
    toJSON() {
        return {
            service_code: this.service_code,
            service_name: this.service_name,
            service_icon: this.service_icon,
            service_tariff: this.service_tariff
        };
    }
}

module.exports = Service;
