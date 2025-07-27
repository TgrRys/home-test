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
            const user = await this.userRepository.findByEmail(email);

            if (!user) {
                const error = new Error('User tidak ditemukan');
                error.statusCode = 404;
                error.errorCode = 109;
                throw error;
            }

            const updateData = {
                first_name: userData.first_name || user.first_name,
                last_name: userData.last_name || user.last_name
            };

            const updatedUser = await this.userRepository.update(user.id, updateData);

            return {
                status: 0,
                message: "Update Pofile berhasil",
                data: {
                    email: updatedUser.email,
                    first_name: updatedUser.first_name,
                    last_name: updatedUser.last_name,
                    profile_image: updatedUser.profile_image
                }
            };
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
                error.errorCode = 999;
            }
            throw error;
        }
    }
}

module.exports = UpdateUserProfile;
