/**
 * User entity
 * 
 * This is a domain entity representing a user in the system.
 * It contains the core business logic and validation rules.
 */
class User {
    constructor(id, first_name, last_name, email, password, profile_image = "https://yoururlapi.com/profile.jpeg", createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
        this.profile_image = profile_image;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;

        this.validate();
    }

    validate() {
        if (!this.first_name || this.first_name.trim().length === 0) {
            throw new Error('First name is required');
        }

        if (!this.last_name || this.last_name.trim().length === 0) {
            throw new Error('Last name is required');
        }

        if (!this.email || !this.isValidEmail(this.email)) {
            const error = new Error('Paramter email tidak sesuai format');
            error.code = 102;
            throw error;
        }

        if (!this.password || this.password.length < 8) {
            const error = new Error('Password minimal 8 karakter');
            error.code = 103;
            throw error;
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    toJSON() {
        return {
            id: this.id,
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            profile_image: this.profile_image,
            // Password is intentionally excluded for security
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = User;
