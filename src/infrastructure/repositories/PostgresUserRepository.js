const UserRepository = require('../../domain/repositories/UserRepository');
const User = require('../../domain/entities/User');
const UserModel = require('../database/models/UserModel');

/**
 * PostgreSQL implementation of the UserRepository interface
 */
class PostgresUserRepository extends UserRepository {
    /**
     * Maps a database model to a domain entity
     * @param {Object} model - The database model
     * @returns {User} The domain entity
     */
    toDomainEntity(model) {
        if (!model) return null;

        return new User(
            model.id,
            model.first_name,
            model.last_name,
            model.email,
            model.password,
            model.profile_image,
            model.createdAt,
            model.updatedAt
        );
    }

    /**
     * Maps a domain entity to a database model
     * @param {User} entity - The domain entity
     * @returns {Object} The database model
     */
    toDatabaseModel(entity) {
        const model = {
            first_name: entity.first_name,
            last_name: entity.last_name,
            email: entity.email,
            password: entity.password,
            profile_image: entity.profile_image,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };

        // Only include ID if it's not null
        if (entity.id) {
            model.id = entity.id;
        }

        return model;
    }

    /**
     * Find a user by ID
     * @param {string|number} id - The user ID
     * @returns {Promise<User|null>} The user entity or null if not found
     */
    async findById(id) {
        const model = await UserModel.findByPk(id);
        return this.toDomainEntity(model);
    }

    /**
     * Find a user by email
     * @param {string} email - The user's email
     * @returns {Promise<User|null>} The user entity or null if not found
     */
    async findByEmail(email) {
        const model = await UserModel.findOne({ where: { email } });
        return this.toDomainEntity(model);
    }

    /**
     * Create a new user
     * @param {User} user - The user entity to create
     * @returns {Promise<User>} The created user entity
     */
    async create(user) {
        const data = this.toDatabaseModel(user);
        const model = await UserModel.create(data);
        return this.toDomainEntity(model);
    }

    /**
     * Update an existing user
     * @param {string|number} id - The user ID
     * @param {User} user - The user entity with updated data
     * @returns {Promise<User|null>} The updated user entity or null if not found
     */
    async update(id, user) {
        const data = this.toDatabaseModel(user);
        const [updated] = await UserModel.update(data, {
            where: { id },
            returning: true
        });

        if (updated === 0) return null;

        const model = await UserModel.findByPk(id);
        return this.toDomainEntity(model);
    }

    /**
     * Delete a user
     * @param {string|number} id - The user ID
     * @returns {Promise<boolean>} True if deleted, false if not found
     */
    async delete(id) {
        const deleted = await UserModel.destroy({
            where: { id }
        });
        return deleted > 0;
    }

    /**
     * Find all users
     * @param {Object} options - Query options (pagination, sorting, etc.)
     * @returns {Promise<User[]>} Array of user entities
     */
    async findAll(options = {}) {
        const { page = 1, limit = 10, sort = 'createdAt', order = 'DESC' } = options;

        const offset = (page - 1) * limit;

        const { rows } = await UserModel.findAndCountAll({
            offset,
            limit,
            order: [[sort, order]]
        });

        return rows.map(model => this.toDomainEntity(model));
    }
}

module.exports = PostgresUserRepository;
