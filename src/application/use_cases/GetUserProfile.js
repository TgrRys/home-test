/**
 * GetUserProfile use case
 * 
 * This class implements the business logic for retrieving a user's profile.
 */
class GetUserProfile {
    /**
     * Constructor
     * @param {UserRepository} userRepository - An implementation of UserRepository
     */
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Execute the use case
     * @param {string} email - The email of the user to retrieve
     * @returns {Promise<Object>} The result object with user profile data
     * @throws {Error} If user is not found
     */
    async execute(email) {
        try {
            // Find user by email
            const user = await this.userRepository.findByEmail(email);
            
            if (!user) {
                const error = new Error('User tidak ditemukan');
                error.statusCode = 404;
                error.errorCode = 109; // Custom error code for user not found
                throw error;
            }

            // Return formatted user profile
            return {
                status: 0,
                message: "Sukses",
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

module.exports = GetUserProfile;
