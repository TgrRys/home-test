/**
 * UpdateProfileImage use case
 * 
 * This class implements the business logic for updating a user's profile image.
 */
class UpdateProfileImage {
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
     * @param {Object} fileData - The uploaded file data
     * @param {string} fileData.mimetype - The MIME type of the uploaded file
     * @param {string} fileData.buffer - The file buffer
     * @param {string} fileData.originalname - The original file name
     * @returns {Promise<Object>} The result object with updated user profile data
     * @throws {Error} If user is not found or file format is invalid
     */
    async execute(email, fileData) {
        try {
            // Validate file format (only jpeg and png allowed)
            if (!this.isValidImageFormat(fileData.mimetype)) {
                const error = new Error('Format Image tidak sesuai');
                error.statusCode = 400;
                error.errorCode = 102;
                throw error;
            }

            // Find user by email
            const user = await this.userRepository.findByEmail(email);
            
            if (!user) {
                const error = new Error('User tidak ditemukan');
                error.statusCode = 404;
                error.errorCode = 109; // Custom error code for user not found
                throw error;
            }

            // In a real application, we would:
            // 1. Save the image to a storage service (S3, local disk, etc.)
            // 2. Generate a URL for the saved image
            // 3. Update the user's profile_image field with the URL

            // For this example, we'll just use a fake URL based on the original filename
            const imageUrl = `https://yoururlapi.com/${Date.now()}-${fileData.originalname}`;
            
            // Update user's profile image
            user.profile_image = imageUrl;
            user.updatedAt = new Date();

            // Save the updated user
            await this.userRepository.update(user.id, user);

            // Return formatted updated user profile
            return {
                status: 0,
                message: "Update Profile Image berhasil",
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

    /**
     * Check if the image format is valid (jpeg or png)
     * @param {string} mimetype - The MIME type of the file
     * @returns {boolean} Whether the format is valid
     */
    isValidImageFormat(mimetype) {
        const allowedFormats = ['image/jpeg', 'image/png'];
        return allowedFormats.includes(mimetype);
    }
}

module.exports = UpdateProfileImage;
