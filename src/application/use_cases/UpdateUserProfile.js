/**
 * UpdateUserProfile use case
 * 
 * This class implements the business logic for updating a user's profile.
 */
class UpdateUserProfile {
    /**
     * Constructor
     * @param {UserRepository} userRepository - An implementation of UserRepository
     */
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Execute the use case
     * @param {string} email - The email of the user to update
     * @param {Object} userData - The user data to update
     * @param {string} userData.first_name - The user's updated first name
     * @param {string} userData.last_name - The user's updated last name
     * @returns {Promise<Object>} The result object with updated user profile data
     * @throws {Error} If user is not found
     */
    async execute(email, userData) {
        try {
            // Find user by email
            const user = await this.userRepository.findByEmail(email);

            if (!user) {
                const error = new Error('User tidak ditemukan');
                error.statusCode = 404;
                error.errorCode = 109; // Custom error code for user not found
                throw error;
            }

            // Update user fields
            user.first_name = userData.first_name || user.first_name;
            user.last_name = userData.last_name || user.last_name;
            user.updatedAt = new Date();

            // Save the updated user
            await this.userRepository.update(user.id, user);

            // Return formatted updated user profile
            return {
                status: 0,
                message: "Update Pofile berhasil",
                data: {
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    profile_image: user.profile_image
                }
            };
        } catch (error) {
            // Make sure error has proper codes
            if (!error.statusCode) {
                error.statusCode = 500;
                error.errorCode = 999; // Default error code
            }
            throw error;
        }
    }
}

module.exports = UpdateUserProfile;
