const ServiceRepository = require('../../domain/repositories/ServiceRepository');
const Service = require('../../domain/entities/Service');

/**
 * PostgreSQL implementation of the ServiceRepository interface using raw queries
 */
class PostgresServiceRepository extends ServiceRepository {
    /**
     * Constructor that accepts database connection
     * @param {Object} database - Database connection instance
     */
    constructor(database) {
        super();
        this.database = database;
    }
    /**
     * Maps a database row to a domain entity
     * @param {Object} row - The database row
     * @returns {Service} The domain entity
     */
    toDomainEntity(row) {
        if (!row) return null;

        return new Service(
            row.id,
            row.service_code,
            row.service_name,
            row.service_icon,
            row.service_tariff,
            row.created_at,
            row.updated_at
        );
    }

    /**
     * Maps a domain entity to a database object
     * @param {Service} entity - The domain entity
     * @returns {Object} The database object
     */
    toDatabaseModel(entity) {
        return {
            service_code: entity.service_code,
            service_name: entity.service_name,
            service_icon: entity.service_icon,
            service_tariff: entity.service_tariff
        };
    }

    /**
     * Find all services using prepared statement
     * @returns {Promise<Service[]>} Array of service entities
     */
    async findAll() {
        const query = `
            SELECT id, service_code, service_name, service_icon, service_tariff, created_at, updated_at
            FROM services
            ORDER BY created_at ASC
        `;
        const result = await this.database.query(query);
        return result.rows.map(row => this.toDomainEntity(row));
    }

    /**
     * Find service by ID using prepared statement
     * @param {string} id - Service ID
     * @returns {Promise<Service|null>} Service entity or null
     */
    async findById(id) {
        const query = `
            SELECT id, service_code, service_name, service_icon, service_tariff, created_at, updated_at
            FROM services
            WHERE id = $1
        `;
        const result = await this.database.query(query, [id]);
        return this.toDomainEntity(result.rows[0]);
    }

    /**
     * Find service by code using prepared statement
     * @param {string} serviceCode - Service code
     * @returns {Promise<Service|null>} Service entity or null
     */
    async findByCode(serviceCode) {
        const query = `
            SELECT id, service_code, service_name, service_icon, service_tariff, created_at, updated_at
            FROM services
            WHERE service_code = $1
        `;
        const result = await this.database.query(query, [serviceCode]);
        return this.toDomainEntity(result.rows[0]);
    }

    /**
     * Create a new service using prepared statement
     * @param {Service} service - Service entity
     * @returns {Promise<Service>} Created service entity
     */
    async create(service) {
        const data = this.toDatabaseModel(service);
        const query = `
            INSERT INTO services (service_code, service_name, service_icon, service_tariff)
            VALUES ($1, $2, $3, $4)
            RETURNING id, service_code, service_name, service_icon, service_tariff, created_at, updated_at
        `;
        const values = [data.service_code, data.service_name, data.service_icon, data.service_tariff];
        const result = await this.database.query(query, values);
        return this.toDomainEntity(result.rows[0]);
    }

    /**
     * Update an existing service using prepared statement
     * @param {string} id - Service ID
     * @param {Service} service - Service entity with updated data
     * @returns {Promise<Service|null>} Updated service entity or null
     */
    async update(id, service) {
        const data = this.toDatabaseModel(service);
        const query = `
            UPDATE services
            SET service_code = $1, service_name = $2, service_icon = $3, service_tariff = $4, updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING id, service_code, service_name, service_icon, service_tariff, created_at, updated_at
        `;
        const values = [data.service_code, data.service_name, data.service_icon, data.service_tariff, id];
        const result = await this.database.query(query, values);
        return this.toDomainEntity(result.rows[0]);
    }

    /**
     * Delete a service using prepared statement
     * @param {string} id - Service ID
     * @returns {Promise<boolean>} True if deleted, false if not found
     */
    async delete(id) {
        const query = `DELETE FROM services WHERE id = $1`;
        const result = await this.database.query(query, [id]);
        return result.rowCount > 0;
    }
}

module.exports = PostgresServiceRepository;
