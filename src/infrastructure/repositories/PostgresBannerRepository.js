const BannerRepository = require('../../domain/repositories/BannerRepository');
const Banner = require('../../domain/entities/Banner');

/**
 * PostgreSQL implementation of the BannerRepository interface using raw queries
 */
class PostgresBannerRepository extends BannerRepository {
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
     * @returns {Banner} The domain entity
     */
    toDomainEntity(row) {
        if (!row) return null;

        return new Banner(
            row.id,
            row.banner_name,
            row.banner_image,
            row.description,
            row.created_at,
            row.updated_at
        );
    }

    /**
     * Maps a domain entity to a database object
     * @param {Banner} entity - The domain entity
     * @returns {Object} The database object
     */
    toDatabaseModel(entity) {
        return {
            banner_name: entity.banner_name,
            banner_image: entity.banner_image,
            description: entity.description
        };
    }

    /**
     * Find all banners using prepared statement
     * @returns {Promise<Banner[]>} Array of banner entities
     */
    async findAll() {
        const query = `
            SELECT id, banner_name, banner_image, description, created_at, updated_at
            FROM banners
            ORDER BY created_at ASC
        `;
        const result = await this.database.query(query);
        return result.rows.map(row => this.toDomainEntity(row));
    }

    /**
     * Find banner by ID using prepared statement
     * @param {string} id - Banner ID
     * @returns {Promise<Banner|null>} Banner entity or null
     */
    async findById(id) {
        const query = `
            SELECT id, banner_name, banner_image, description, created_at, updated_at
            FROM banners
            WHERE id = $1
        `;
        const result = await this.database.query(query, [id]);
        return this.toDomainEntity(result.rows[0]);
    }

    /**
     * Create a new banner using prepared statement
     * @param {Banner} banner - Banner entity
     * @returns {Promise<Banner>} Created banner entity
     */
    async create(banner) {
        const data = this.toDatabaseModel(banner);
        const query = `
            INSERT INTO banners (banner_name, banner_image, description)
            VALUES ($1, $2, $3)
            RETURNING id, banner_name, banner_image, description, created_at, updated_at
        `;
        const values = [data.banner_name, data.banner_image, data.description];
        const result = await this.database.query(query, values);
        return this.toDomainEntity(result.rows[0]);
    }

    /**
     * Update an existing banner using prepared statement
     * @param {string} id - Banner ID
     * @param {Banner} banner - Banner entity with updated data
     * @returns {Promise<Banner|null>} Updated banner entity or null
     */
    async update(id, banner) {
        const data = this.toDatabaseModel(banner);
        const query = `
            UPDATE banners
            SET banner_name = $1, banner_image = $2, description = $3, updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING id, banner_name, banner_image, description, created_at, updated_at
        `;
        const values = [data.banner_name, data.banner_image, data.description, id];
        const result = await this.database.query(query, values);
        return this.toDomainEntity(result.rows[0]);
    }

    /**
     * Delete a banner using prepared statement
     * @param {string} id - Banner ID
     * @returns {Promise<boolean>} True if deleted, false if not found
     */
    async delete(id) {
        const query = `DELETE FROM banners WHERE id = $1`;
        const result = await this.database.query(query, [id]);
        return result.rowCount > 0;
    }
}

module.exports = PostgresBannerRepository;
