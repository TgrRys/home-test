class PostgresUserRepository {
    constructor(database) {
        this.database = database;
    }

    async findByEmail(email) {
        const query = `
            SELECT id, first_name, last_name, email, password, profile_image, created_at, updated_at
            FROM users
            WHERE email = $1
        `;
        const result = await this.database.query(query, [email]);
        return result.rows[0];
    }

    async create(userData) {
        const query = `
            INSERT INTO users (first_name, last_name, email, password, profile_image)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, first_name, last_name, email, profile_image, created_at, updated_at
        `;
        const values = [
            userData.first_name,
            userData.last_name,
            userData.email,
            userData.password,
            userData.profile_image || 'https://yoururlapi.com/profile.jpeg'
        ];
        
        const result = await this.database.query(query, values);
        return result.rows[0];
    }

    async findById(id) {
        const query = `
            SELECT id, first_name, last_name, email, profile_image, created_at, updated_at
            FROM users
            WHERE id = $1
        `;
        const result = await this.database.query(query, [id]);
        return result.rows[0];
    }

    async update(id, userData) {
        const fields = [];
        const values = [];
        let paramCounter = 1;

        Object.keys(userData).forEach(key => {
            if (userData[key] !== undefined) {
                fields.push(`${key} = $${paramCounter}`);
                values.push(userData[key]);
                paramCounter++;
            }
        });

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `
            UPDATE users
            SET ${fields.join(', ')}
            WHERE id = $${paramCounter}
            RETURNING id, first_name, last_name, email, profile_image, created_at, updated_at
        `;

        const result = await this.database.query(query, values);
        return result.rows[0];
    }
}

module.exports = PostgresUserRepository;
